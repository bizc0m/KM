import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {ownedRepositories} from './km-tool-fiches.mjs';
const root=process.env.KM_ROOT||process.cwd(),base=process.env.KM_PIPELINE_DATA||path.join(os.homedir(),'Library/Application Support/KM/pipeline');
try{const l=JSON.parse(await fs.readFile(path.join(base,'run.lock'),'utf8'));try{process.kill(l.pid,0);throw Error('pipeline_active');}catch(e){if(e.code!=='ESRCH')throw e;}}catch(e){if(e.code!=='ENOENT')throw e;}
await fs.mkdir(base,{recursive:true});
const groups=new Map();for(const name of await fs.readdir(path.join(root,'watch'))){if(!name.endsWith('.md')||name==='index.md')continue;const file='watch/'+name,text=await fs.readFile(path.join(root,file),'utf8');for(const repo of ownedRepositories(text)){if(!groups.has(repo))groups.set(repo,[]);groups.get(repo).push({file,text});}}
const duplicates=[...groups.entries()].filter(([,rows])=>rows.length>1),replacement=new Map();let backup=null;
if(duplicates.length){backup=path.join(os.homedir(),'Library/Application Support/KM/backups','merge-tools-'+Date.now());await fs.mkdir(path.join(backup,'watch'),{recursive:true,mode:0o700});}
for(const [repo,rows]of duplicates){rows.sort((a,b)=>a.file.localeCompare(b.file));const keep=rows[0];const sources=[...new Set([repo,...rows.flatMap(r=>(r.text.split('## Sources')[1]?.split('\n## ')[0]||'').match(/https?:\/\/\S+/g)||[])])];const origins=[...new Set(rows.map(r=>r.text.match(/- Origine : (.+)/)?.[1]).filter(Boolean))];
 for(const r of rows)await fs.writeFile(path.join(backup,r.file),r.text,{mode:0o600});
 const interest=rows.map(r=>r.text.match(/## Intérêts[ \t]*\n([\s\S]*?)(?=\n## |$)/)?.[1]?.trim()).find(v=>v&&v!=='Intérêt à vérifier');
 let merged=keep.text.replace(/## Sources\n[\s\S]*?(?=\n## |$)/,'## Sources\n\n'+sources.map(s=>'- '+s).join('\n')+'\n');
 if(interest&&!/## Intérêts/.test(merged))merged=merged.replace('## Sources','## Intérêts\n\n'+interest+'\n\n## Sources');
 if(origins.length>1)merged+='\n## Origines associées\n\n'+origins.map(o=>'- '+o).join('\n')+'\n';
 await fs.writeFile(path.join(root,keep.file),merged,{mode:0o600});for(const other of rows.slice(1)){replacement.set(other.file,keep.file);await fs.unlink(path.join(root,other.file));}
}
if(replacement.size){const rp=path.join(root,'km.fiche-redirects.json');let redirects={};try{redirects=JSON.parse(await fs.readFile(rp,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}for(const [from,to]of replacement)redirects[from]=to;for(const from of Object.keys(redirects)){let to=redirects[from],seen=new Set([from]);while(redirects[to]&&!seen.has(to)){seen.add(to);to=redirects[to];}redirects[from]=to;}await fs.writeFile(rp,JSON.stringify(redirects,null,2)+'\n');for(const file of ['index.md','watch/index.md']){const p=path.join(root,file),text=await fs.readFile(p,'utf8');await fs.writeFile(path.join(backup,file.replaceAll('/','-')),text,{mode:0o600});await fs.writeFile(p,text.split('\n').filter(line=>![...replacement.keys()].some(f=>line.includes('`'+f+'`')||line.includes('`'+path.basename(f)+'`'))).join('\n'));}
 const p=path.join(base,'state.json'),text=await fs.readFile(p,'utf8').catch(e=>{if(e.code==='ENOENT')return '{}';throw e;}),state=JSON.parse(text);await fs.writeFile(path.join(backup,'state.json'),text,{mode:0o600});for(const collection of [state.urls,state.notes])for(const entry of Object.values(collection||{})){if(replacement.has(entry.fiche))entry.fiche=replacement.get(entry.fiche);if(entry.fiches)entry.fiches=[...new Set(entry.fiches.map(f=>replacement.get(f)||f))];}await fs.writeFile(p,JSON.stringify(state),{mode:0o600});}
const report={at:new Date().toISOString(),duplicateGroups:duplicates.length,archivedFiches:replacement.size,backup,rule:'Identical canonical repository with unambiguous ownership only; ambiguous same-title fiches retained'};await fs.writeFile(path.join(base,'merge-tools-report.json'),JSON.stringify(report),{mode:0o600});console.log(JSON.stringify(report));
