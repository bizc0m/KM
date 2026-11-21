import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {canonical,blocked} from './km-technical-policy.mjs';
import {crawlKey} from './km-source-crawl.mjs';
const exec=promisify(execFile),root=process.env.KM_ROOT || process.cwd(),base=process.env.KM_PIPELINE_DATA || path.join(os.homedir(),'Library/Application Support/KM/pipeline');
// This maintenance stage runs before collection, never alongside its state writer.
try{const l=JSON.parse(await fs.readFile(path.join(base,'run.lock'),'utf8'));try{process.kill(l.pid,0);throw Error('pipeline_active');}catch(e){if(e.code!=='ESRCH')throw e;}}catch(e){if(e.code!=='ENOENT')throw e;}
const reader=path.join(root,'scripts/km-noteplan-technical-read.mjs');let command=process.execPath,args=[reader];
if(process.env.KM_NOTEPLAN_SSH==='1'){const quote=s=>"'"+s.replaceAll("'","'\\''")+"'";command='/usr/bin/ssh';args=['-o','BatchMode=yes','-o','IdentitiesOnly=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=5','-i',path.join(os.homedir(),'.ssh/id_ed25519_atn_core'),`${os.userInfo().username}@127.0.0.1`,[process.execPath,reader].map(quote).join(' ')];}
const scan=JSON.parse((await exec(command,args,{timeout:30000,maxBuffer:32*1024*1024})).stdout);if(!scan.ok)throw Error('noteplan_scan_incomplete');
const key=u=>{try{return crawlKey(u.replace(/[).,;!}`]+$/g,''));}catch{return null;}};
const sourceFiles=new Map();
for(const name of await fs.readdir(path.join(root,'watch'))){if(!/^technical-.*\.md$/.test(name))continue;const text=await fs.readFile(path.join(root,'watch',name),'utf8');const section=text.split('## Sources')[1]?.split('\n## ')[0]||'';for(const match of section.matchAll(/https?:\/\/[^\s<>]+/g)){const k=key(match[0]);if(k){if(!sourceFiles.has(k))sourceFiles.set(k,new Set());sourceFiles.get(k).add('watch/'+name);}}}
const file=path.join(base,'state.json'),state=JSON.parse(await fs.readFile(file,'utf8'));state.notes??={};let linkedNotes=0;
for(const note of scan.notes){const files=new Set(state.notes[note.id]?.fiches || []);for(const segment of note.segments)for(const m of segment.matchAll(/https?:\/\/[^\s<>"'\[\]]+/g)){if(blocked(m[0]))continue;const k=key(m[0]);for(const f of sourceFiles.get(k)||[])files.add(f);try{const v=state.urls[crypto.createHash('sha256').update(canonical(m[0].replace(/[).,;!}`]+$/g,''))).digest('hex')];for(const f of [...(v?.fiches||[]),...(v?.fiche?[v.fiche]:[])])files.add(f);}catch{}}
 if(files.size){linkedNotes++;state.notes[note.id]={...state.notes[note.id],fiches:[...files],linksReconciledAt:new Date().toISOString()};}}
const report={at:new Date().toISOString(),calendarNotesRead:scan.scanned,notesWithLinkedFiches:linkedNotes,meaning:'Source links matched, not proof that every linked note originally created a fiche',rawNotesStored:false};
const backup=path.join(os.homedir(),'Library/Application Support/KM/backups','note-links-'+Date.now());await fs.mkdir(backup,{recursive:true,mode:0o700});await fs.copyFile(file,path.join(backup,'state.json'));await fs.chmod(path.join(backup,'state.json'),0o600);
state.noteLinkReconciliation=report;await fs.writeFile(file+'.reconcile.tmp',JSON.stringify(state),{mode:0o600});await fs.rename(file+'.reconcile.tmp',file);await fs.writeFile(path.join(base,'note-links-report.json'),JSON.stringify(report),{mode:0o600});console.log(JSON.stringify(report));
