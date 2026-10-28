import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {inWindow} from './km-noteplan-window.mjs';
import {smartSortMarkdown} from '../src/core/sorter';
import {blocked,canonical,technicalSignal} from './km-technical-policy.mjs';
const timed=<T>(p:Promise<T>):Promise<T>=>Promise.race([p,new Promise<T>((_,reject)=>{const t=setTimeout(()=>reject(Error('noteplan_io_timeout')),3000);t.unref();})]);
const hash=(s:string)=>crypto.createHash('sha256').update(s).digest('hex');
const task=/^(\s*)[-*+]\s+\[([^\]])\]\s+/;
const urls=(s:string)=>[...s.matchAll(/https?:\/\/[^\s<>"'\[\]]+/g)].map(m=>m[0].replace(/[).,;!}`]+$/g,'')).filter(u=>!u.includes('bizc0m.github.io/KM/')&&!/127\.0\.0\.1:876[67]/.test(u));
export function planWriteback(body:string,state:any,validFiles:Set<string>){
 if(blocked(body)||/^\s*(```|~~~)/m.test(body))return {content:body,marked:0,skip:'mixed_or_fenced'};
 const items:any[]=[];const pending:any[]=[];const lines=body.split(/\r?\n/);let marked=0;
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
  if(!complete){const known=links.map(u=>{try{return state.urls[hash(canonical(u))];}catch{return null;}}).filter(Boolean);if(known.length)pending.push({sources:links,files:[...new Set(known.flatMap(r=>[...(r.fiches||[]),...(r.fiche?[r.fiche]:[])]))],reason:'Liens non terminés, exploration partielle ou fiche non établie'});continue;}
  lines[i]=lines[i].replace(/\[ \]/,'[x]')+' #km-fait';items.push({files:[...files]});marked++;
 }
 
 const beforeSort=lines.join('\n');let moved=0;
 for(let n=0;n<lines.length;n++)if(lines[n].includes('#km-fait'))lines[n]=lines[n].replace(/ +\[KM\]\(https:\/\/bizc0m\.github\.io\/KM\/search-v2\.html#fiche=[a-zA-Z0-9-]+\)/g,'');
 let candidate=lines.join(body.includes('\r\n')?'\r\n':'\n');
 // Sort only homogeneous task sections. Free-standing prose must not move.
 const sections=candidate.split(/(?=^#{1,6}\s)/m);
 candidate=sections.map(section=>{const ls=section.split(/\r?\n/);const hasMarker=section.includes('#km-fait')||technicalSignal(section);const unsafe=ls.some((l,k)=>l.trim()&&!/^#{1,6}\s/.test(l)&&!task.test(l)&&!/^\s/.test(l));return hasMarker&&!unsafe?smartSortMarkdown(section):section;}).join('');
 const positions=(text:string)=>text.split(/\r?\n/).map((line,index)=>({line,index})).filter(x=>task.test(x.line));const old=positions(lines.join('\n')),next=positions(candidate);const used=new Set<number>();for(const x of old){const n=next.findIndex((y,k)=>!used.has(k)&&y.line===x.line);if(n>=0){used.add(n);if(next[n].index!==x.index)moved++;}}
 return {content:candidate,marked,items,pending,moved};
}
async function main(){
 const root=process.env.KM_ROOT||process.cwd(),data=process.env.KM_PIPELINE_DATA||path.join(os.homedir(),'Library/Application Support/KM/pipeline');await fs.mkdir(data,{recursive:true,mode:0o700});
 const apply=process.argv.includes('--apply'),started=new Date().toISOString();const state=JSON.parse(await fs.readFile(path.join(data,'state.json'),'utf8'));let cursor:any={files:{}};try{cursor=JSON.parse(await fs.readFile(path.join(data,'writeback-cursor.json'),'utf8'));}catch(e:any){if(e.code!=='ENOENT')throw e;}cursor.files??={};
 const roots=process.env.NOTEPLAN_ROOT?[process.env.NOTEPLAN_ROOT]:[path.join(os.homedir(),'Library/Containers/co.noteplan.NotePlan-setapp/Data/Library/Application Support/co.noteplan.NotePlan-setapp'),path.join(os.homedir(),'Library/Containers/co.noteplan.NotePlan3/Data/Library/Application Support/co.noteplan.NotePlan3'),path.join(os.homedir(),'Library/Mobile Documents/iCloud~co~noteplan~NotePlan/Documents')];
 const valid=new Set<string>(),titles=new Map<string,string>();for(const r of Object.values(state.urls) as any[])for(const p of [...(r.fiches||[]),...(r.fiche?[r.fiche]:[])])if(/^(watch|resources|books)\/[a-z0-9_-]+\.md$/i.test(p)){try{const text=await fs.readFile(path.join(root,p),'utf8');if(blocked(text))continue;valid.add(p);titles.set(p,text.match(/^# (.+)/)?.[1]||'Fiche KM');}catch{}}
 const report:any={at:started,apply,examined:0,scanned:0,notRead:0,candidates:0,marked:0,moved:0,written:0,conflicts:0,unreadable:0,skipped:0,backup:'',items:[],pending:[],sortedNotes:[]};
 const backup=path.join(os.homedir(),'Library/Application Support/KM/backups','noteplan-writeback-'+Date.now());let activeBase='';
 const signature=(keys:string[])=>hash(JSON.stringify(keys.map(k=>state.urls[k]||null)));
 async function walk(dir:string):Promise<string[]>{let out:string[]=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.')||/^(@Archive|@Trash|@Templates)$/.test(e.name)||e.name.endsWith('_attachments'))continue;const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(e.isFile())out.push(p);}return out;}
 for(const base of roots){const cal=path.join(base,'Calendar');let names:string[];try{names=await walk(cal);}catch{continue;}activeBase=base;
  for(const file of names){const name=path.relative(cal,file);if(!/\.(md|txt)$/i.test(file))continue;
   try{if(Date.now()-Date.parse(started)>90000){report.unreadable++;break;}const st=await timed(fs.lstat(file));if(!st.isFile()||st.size>512000)continue;report.examined++;const id=hash(file),prior=cursor.files[id];
    const depChanged=prior&&signature(prior.keys)!==prior.signature;
    if(prior&&!depChanged&&st.mtimeMs===prior.mtimeMs&&st.size===prior.size&&!inWindow(file,st.mtimeMs,cursor.lastSuccess)){report.notRead++;continue;}
    const body=await timed(fs.readFile(file,'utf8'));report.scanned++;const p=planWriteback(body,state,valid);const keys=[...new Set(urls(body).map(u=>{try{return hash(canonical(u));}catch{return '';}}).filter(Boolean))];
    const fields={mtimeMs:st.mtimeMs,size:st.size,keys,signature:signature(keys)};
    report.pending.push(...(p.pending||[]).map((x:any)=>({...x,note:name})));if(p.content===body){report.skipped++;cursor.files[id]=fields;continue;}report.candidates++;
    if(!apply){report.marked+=p.marked;report.moved+=p.moved||0;continue;}
    await fs.mkdir(path.dirname(path.join(backup,name)),{recursive:true,mode:0o700});report.backup=backup;await fs.writeFile(path.join(backup,name),body,{mode:0o600,flag:'wx'});
    if(hash(await timed(fs.readFile(file,'utf8')))!==hash(body)){report.conflicts++;continue;}
    const tmp=file+'.km-writeback.tmp';await fs.writeFile(tmp,p.content,{mode:st.mode&0o777,flag:'wx'});
    if(hash(await timed(fs.readFile(file,'utf8')))!==hash(body)){await fs.rm(tmp);report.conflicts++;continue;}await fs.rename(tmp,file);if(await timed(fs.readFile(file,'utf8'))!==p.content)throw Error('writeback_verification_failed');report.written++;report.marked+=p.marked;report.moved+=p.moved||0;
    report.items.push(...(p.items||[]).map((x:any)=>({...x,note:name})));if(p.moved)report.sortedNotes.push(name);const after=await fs.stat(file);cursor.files[id]={...fields,mtimeMs:after.mtimeMs,size:after.size};
   }catch{report.unreadable++;}
  }break;
 }
 if(!activeBase)throw Error('noteplan_unavailable');
 if(apply){
  let eventLines:string[]=[];try{eventLines=(await fs.readFile(path.join(data,'fiche-events.jsonl'),'utf8')).trim().split('\n').filter(Boolean);}catch(e:any){if(e.code!=='ENOENT')throw e;}const ficheEvents:any[]=[];for(const line of eventLines.slice(cursor.ficheEventCount||0)){const e=JSON.parse(line);if(!/^(watch|resources|books)\/[a-z0-9_-]+\.md$/i.test(e.file)||blocked(e.title))continue;try{await fs.access(path.join(root,e.file));titles.set(e.file,e.title);ficheEvents.push(e);}catch{}}
  const visible={ficheEvents,items:report.items,pending:report.pending,sortedNotes:report.sortedNotes};const contentHash=hash(JSON.stringify(visible));
  if(report.written||ficheEvents.length||report.pending.length&&contentHash!==cursor.lastReport){
   const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Paris'}).format(new Date(started));const time=new Intl.DateTimeFormat('fr-FR',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date(started));
   const link=(f:string)=>'['+(titles.get(f)||'Fiche KM')+'](https://bizc0m.github.io/KM/search-v2.html#fiche='+f.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')+')';
   const safeNote=(n:string)=>/^\d{4}[-\dWQ]*\.(md|txt)$/i.test(path.basename(n))?path.basename(n).replace(/\.(md|txt)$/,''):'note Calendar';
   let block='### '+time+' — '+(ficheEvents.length?'Fiches mises à jour':report.marked?'Éléments traités':report.pending.length?'À reprendre':'Notes réorganisées')+'\n\n';
   if(ficheEvents.length)block+='#### Fiches créées ou enrichies\n\n'+ficheEvents.map((e:any)=>'* '+link(e.file)+' — '+e.action+'.').join('\n')+'\n\n';
   if(report.items.length)block+='#### Traités\n\n'+report.items.map((x:any)=>'* '+x.files.map(link).join(' · ')+' — agenda '+safeNote(x.note)+', coché.').join('\n')+'\n\n';
   if(report.sortedNotes.length)block+='#### Tri effectué\n\n'+report.sortedNotes.map((n:string)=>'* Agenda '+safeNote(n)).join('\n')+'\n\n';
   if(report.pending.length)block+='#### À reprendre\n\n'+report.pending.map((x:any)=>'* '+(x.files.filter((f:string)=>valid.has(f)).map(link).join(' · ')||(x.sources?.length?'[Source à reprendre]('+x.sources[0]+')':'Élément KM'))+' — agenda '+safeNote(x.note)+' : '+x.reason+'.').join('\n')+'\n\n';
   block+='#### Contrôle\n\n* '+report.marked+' tâche(s) cochée(s), '+report.moved+' tâche(s) déplacée(s), '+report.conflicts+' conflit(s).\n\n';
   const note=path.join(activeBase,'Notes/Rapports KM.md');await fs.mkdir(path.dirname(note),{recursive:true});let old='';try{old=await fs.readFile(note,'utf8');}catch(e:any){if(e.code!=='ENOENT')throw e;}
   const tag='## '+date;const at=old.indexOf(tag+'\n');let next;
   if(at>=0){const end=old.indexOf('\n## ',at+tag.length);const pos=end<0?old.length:end;next=old.slice(0,pos).trimEnd()+'\n\n'+block+old.slice(pos);}else next=(old||'# Rapports KM\n').trimEnd()+'\n\n'+tag+'\n\n'+block;
   await fs.mkdir(backup,{recursive:true,mode:0o700});await fs.writeFile(path.join(backup,'Rapports KM.before.md'),old,{mode:0o600});let current='';try{current=await fs.readFile(note,'utf8');}catch(e:any){if(e.code!=='ENOENT')throw e;}if(current!==old)throw Error('report_conflict');await fs.writeFile(note,next,{mode:0o600});cursor.lastReport=contentHash;report.reportAdded=true;
  }
  cursor.ficheEventCount=eventLines.length;report.fiches=ficheEvents.length;
  await fs.appendFile(path.join(data,'noteplan-writeback-history.jsonl'),JSON.stringify(report)+'\n',{mode:0o600});
  if(!report.conflicts&&!report.unreadable)cursor.lastSuccess=started;
  await fs.writeFile(path.join(data,'writeback-cursor.json'),JSON.stringify(cursor),{mode:0o600});
 }
 await fs.writeFile(path.join(data,apply?'noteplan-writeback.json':'noteplan-writeback-preview.json'),JSON.stringify(report,null,2),{mode:0o600});console.log(JSON.stringify({...report,items:report.items.length,pending:report.pending.length,sortedNotes:report.sortedNotes.length}));
}
if(process.argv[1]?.endsWith('km-noteplan-writeback.mjs'))await main();
