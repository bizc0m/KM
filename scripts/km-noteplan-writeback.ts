import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {smartSortMarkdown} from '../src/core/sorter';
import {blocked,canonical,technicalSignal} from './km-technical-policy.mjs';
const hash=(s:string)=>crypto.createHash('sha256').update(s).digest('hex');
const task=/^(\s*)[-*+]\s+\[([^\]])\]\s+/;
const urls=(s:string)=>[...s.matchAll(/https?:\/\/[^\s<>"'\[\]]+/g)].map(m=>m[0].replace(/[).,;!}`]+$/g,'')).filter(u=>!u.includes('bizc0m.github.io/KM/')&&!/127\.0\.0\.1:876[67]/.test(u));
export function planWriteback(body:string,state:any,validFiles:Set<string>){
 if(blocked(body)||/^\s*(```|~~~)/m.test(body))return {content:body,marked:0,skip:'mixed_or_fenced'};
 const lines=body.split(/\r?\n/);let marked=0;
 for(let i=0;i<lines.length;i++){
  const m=lines[i].match(task);if(!m||m[2]!==' ')continue;
  // Parent completion is refused while a child remains open.
  let j=i+1;for(;j<lines.length;j++){if(/^#{1,6}\s/.test(lines[j]))break;const n=lines[j].match(task);if(n&&n[1].length<=m[1].length)break;if(lines[j].trim()&&!/^\s/.test(lines[j]))break;}
  if(lines.slice(i+1,j).some(l=>{const n=l.match(task);return n&&n[2].toLowerCase()!=='x';}))continue;
  const links=urls(lines.slice(i,j).join('\n'));if(!links.length)continue;const files=new Set<string>();let complete=true;
  for(const u of links){let r;try{r=state.urls[hash(canonical(u))];}catch{complete=false;break;}
   const f=[...(r?.fiches||[]),...(r?.fiche?[r.fiche]:[])];
   if(r?.status!=='done'||!f.length||f.some((p:string)=>!validFiles.has(p))||r.crawl&&(!r.crawl.complete)){complete=false;break;}f.forEach((p:string)=>files.add(p));
  }
  if(!complete)continue;
  const refs=[...files].map(p=>'[KM](https://bizc0m.github.io/KM/search-v2.html#fiche='+p.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')+')').join(' ');
  lines[i]=lines[i].replace(/\[ \]/,'[x]')+' '+refs+' #km-fait';marked++;
 }
 
 let candidate=lines.join(body.includes('\r\n')?'\r\n':'\n');
 // Sort only homogeneous task sections. Free-standing prose must not move.
 const sections=candidate.split(/(?=^#{1,6}\s)/m);
 candidate=sections.map(section=>{const ls=section.split(/\r?\n/);const hasMarker=section.includes('#km-fait')||technicalSignal(section);const unsafe=ls.some((l,k)=>l.trim()&&!/^#{1,6}\s/.test(l)&&!task.test(l)&&!/^\s/.test(l));return hasMarker&&!unsafe?smartSortMarkdown(section):section;}).join('');
 return {content:candidate,marked};
}
async function main(){
 const root=process.env.KM_ROOT||process.cwd(),data=process.env.KM_PIPELINE_DATA||path.join(os.homedir(),'Library/Application Support/KM/pipeline');
 const apply=process.argv.includes('--apply');const state=JSON.parse(await fs.readFile(path.join(data,'state.json'),'utf8'));
 const roots=process.env.NOTEPLAN_ROOT?[process.env.NOTEPLAN_ROOT]:[path.join(os.homedir(),'Library/Containers/co.noteplan.NotePlan-setapp/Data/Library/Application Support/co.noteplan.NotePlan-setapp'),path.join(os.homedir(),'Library/Containers/co.noteplan.NotePlan3/Data/Library/Application Support/co.noteplan.NotePlan3'),path.join(os.homedir(),'Library/Mobile Documents/iCloud~co~noteplan~NotePlan/Documents')];
 const valid=new Set<string>();for(const r of Object.values(state.urls) as any[])for(const p of [...(r.fiches||[]),...(r.fiche?[r.fiche]:[])])if(/^(watch|resources|books)\/[a-z0-9_-]+\.md$/i.test(p)){try{await fs.access(path.join(root,p));valid.add(p);}catch{}}
 const report={at:new Date().toISOString(),apply,scanned:0,candidates:0,marked:0,written:0,conflicts:0,skipped:0,backup:''};
 const backup=path.join(os.homedir(),'Library/Application Support/KM/backups','noteplan-writeback-'+Date.now());
 async function walk(dir:string):Promise<string[]>{let out:string[]=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.')||/^(@Archive|@Trash|@Templates)$/.test(e.name)||e.name.endsWith('_attachments'))continue;const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(e.isFile())out.push(p);}return out;}
 for(const base of roots){const cal=path.join(base,'Calendar');let names:string[];try{names=await walk(cal);}catch{continue;}
  for(const file of names){const name=path.relative(cal,file);if(!/\.(md|txt)$/i.test(file))continue;const st=await fs.lstat(file);if(!st.isFile()||st.size>512000)continue;const body=await fs.readFile(file,'utf8');report.scanned++;const p=planWriteback(body,state,valid);if(p.content===body){report.skipped++;continue;}report.candidates++;report.marked+=p.marked;
   if(!apply)continue;
   await fs.mkdir(backup,{recursive:true,mode:0o700});report.backup=backup;await fs.mkdir(path.dirname(path.join(backup,name)),{recursive:true,mode:0o700});await fs.writeFile(path.join(backup,name),body,{mode:0o600,flag:'wx'});
   if(hash(await fs.readFile(file,'utf8'))!==hash(body)){report.conflicts++;continue;}
   const tmp=file+'.km-writeback.tmp';await fs.writeFile(tmp,p.content,{mode:st.mode&0o777,flag:'wx'});
   if(hash(await fs.readFile(file,'utf8'))!==hash(body)){await fs.rm(tmp);report.conflicts++;continue;}await fs.rename(tmp,file);if(await fs.readFile(file,'utf8')!==p.content)throw Error('writeback_verification_failed');report.written++;
  }break;
 }
 await fs.writeFile(path.join(data,apply?'noteplan-writeback.json':'noteplan-writeback-preview.json'),JSON.stringify(report,null,2),{mode:0o600});console.log(JSON.stringify(report));
}
if(process.argv[1]?.endsWith('km-noteplan-writeback.mjs'))await main();
