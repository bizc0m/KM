#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {canonical,blocked,technicalSignal} from './km-technical-policy.mjs';
import {crawlKey} from './km-source-crawl.mjs';
const root=process.env.KM_ROOT || fileURLToPath(new URL('..',import.meta.url));
const data=process.env.KM_PIPELINE_DATA || path.join(os.homedir(),'Library/Application Support/KM/pipeline');
const files=(await fs.readdir(path.join(root,'watch'))).filter(n=>/^technical-[a-f0-9]+\.md$/.test(n));
const documents=await Promise.all(files.map(async n=>({file:'watch/'+n,text:await fs.readFile(path.join(root,'watch',n),'utf8'),mtime:(await fs.stat(path.join(root,'watch',n))).mtimeMs})));
const groups=new Map();
for(const doc of documents){
 const section=doc.text.split('## Sources')[1]?.split('\n## ')[0] || '';
 const sources=section.match(/https?:\/\/[^\s<>]+/g) || [];
 const repositories=[...new Set(sources.filter(s=>{try{const u=new URL(s);return u.hostname==='github.com' && /^\/[^/]+\/[^/]+\/?$/.test(u.pathname);}catch{return false;}}).map(canonical))];
 const tweet=sources[0] && /^https?:\/\/(?:x\.com|twitter\.com)\/.*\/status\/\d+/.test(sources[0]);
 const first=tweet?crawlKey(sources[0]):repositories.length===1?repositories[0]:sources[0];
 if(!first)continue;
 try{const key=canonical(first);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(doc);}catch{}
}
const duplicates=[...groups.values()].filter(g=>g.length>1);
const archived=[];
if(process.argv.includes('--repair')){
 const lock=path.join(data,'run.lock');
 try{const l=JSON.parse(await fs.readFile(lock,'utf8'));try{process.kill(l.pid,0);throw new Error('Pipeline is running; stop it before repair');}catch(e){if(e.code!=='ESRCH')throw e;}}catch(e){if(e.code!=='ENOENT')throw e;}
 const backup=path.join(os.homedir(),'Library/Application Support/KM/backups','dedup-'+new Date().toISOString().replace(/[:.]/g,'-'));
 await fs.mkdir(backup,{recursive:true,mode:0o700});
 const replacements=new Map();
 for(const group of duplicates){
  group.sort((a,b)=>a.mtime-b.mtime || a.file.localeCompare(b.file));
  for(const duplicate of group.slice(1)){
   await fs.copyFile(path.join(root,duplicate.file),path.join(backup,path.basename(duplicate.file)));
   await fs.chmod(path.join(backup,path.basename(duplicate.file)),0o600);
   replacements.set(duplicate.file,group[0].file);
   await fs.unlink(path.join(root,duplicate.file));archived.push({file:duplicate.file,kept:group[0].file});
  }
 }
 for(const name of ['index.md','watch/index.md']){
  const p=path.join(root,name);const text=await fs.readFile(p,'utf8');await fs.copyFile(p,path.join(backup,name.replaceAll('/','-')));
  const filtered=text.split('\n').filter(line=>![...replacements.keys()].some(f=>line.includes('`'+f+'`') || line.includes('`'+path.basename(f)+'`'))).join('\n');
  await fs.writeFile(p,filtered,{mode:0o600});
 }
 const stateFile=path.join(data,'state.json');
 try{const state=JSON.parse(await fs.readFile(stateFile,'utf8'));await fs.copyFile(stateFile,path.join(backup,'state.json'));
  for(const collection of [state.urls,state.notes])for(const entry of Object.values(collection || {}))if(replacements.has(entry.fiche))entry.fiche=replacements.get(entry.fiche);
  await fs.writeFile(stateFile,JSON.stringify(state),{mode:0o600});
 }catch(e){if(e.code!=='ENOENT')throw e;}
 console.log(JSON.stringify({archived,backup}));
}else{
 const global=await fs.readFile(path.join(root,'index.md'),'utf8');const watch=await fs.readFile(path.join(root,'watch/index.md'),'utf8');
 const html=await fs.readFile(path.join(root,'search-v2.html'),'utf8');const match=html.match(/const KM_INDEX=(\[.*?\]);\n/s);if(!match)throw new Error('KM_INDEX missing');const index=JSON.parse(match[1]);
 const rows=documents.map(d=>({file:d.file,globalIndex:global.includes('`'+d.file+'`'),watchIndex:watch.includes('`'+path.basename(d.file)+'`'),dashboard:index.some(i=>i.path===d.file),policyAllowed:!blocked(d.text) && technicalSignal(d.text)}));
 const errors=rows.filter(r=>!r.globalIndex || !r.watchIndex || r.dashboard!==r.policyAllowed);
 const report={at:new Date().toISOString(),fiches:rows.length,displayed:rows.filter(r=>r.dashboard).length,totalDashboard:index.length,duplicateGroups:duplicates.length,errors,rows};
 await fs.mkdir(data,{recursive:true,mode:0o700});await fs.writeFile(path.join(data,'placement.json'),JSON.stringify(report,null,2),{mode:0o600});
 console.log(JSON.stringify({...report,rows:undefined}));
 if(errors.length || duplicates.length)process.exitCode=1;
}
