// Isolated reader: the parent can terminate a macOS consent/file-provider stall.
// No raw notes or private paths are written to disk or to diagnostic output.
import {readdir,readFile,stat,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {blocked,technicalSignal} from './km-technical-policy.mjs';
import {inWindow,cutoff} from './km-noteplan-window.mjs';
const data=process.env.KM_PIPELINE_DATA||path.join(os.homedir(),'Library/Application Support/KM/pipeline');
let cursor={};try{cursor=JSON.parse(await readFile(path.join(data,'noteplan-cursor.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
let manifest={},state={};try{manifest=JSON.parse(await readFile(path.join(data,'noteplan-reader-manifest.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}try{state=JSON.parse(await readFile(path.join(data,'state.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const scanStartedAt=new Date().toISOString();
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.') || /^(@Archive|@Trash|@Templates)$/.test(e.name) || e.name.endsWith('_attachments'))continue;const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(e.isFile() && /\.(md|txt)$/i.test(e.name))out.push(p);}return out;}
const roots=process.env.NOTEPLAN_ROOT?[process.env.NOTEPLAN_ROOT]:[
 path.join(os.homedir(),'Library/Containers/co.noteplan.NotePlan-setapp/Data/Library/Application Support/co.noteplan.NotePlan-setapp'),
 path.join(os.homedir(),'Library/Containers/co.noteplan.NotePlan3/Data/Library/Application Support/co.noteplan.NotePlan3'),
 path.join(os.homedir(),'Library/Mobile Documents/iCloud~co~noteplan~NotePlan/Documents')];
let denied=false,found=false;const notes=[];let scanned=0,unreadable=0,examined=0,unchanged=0;
for(const root of roots){
 let files;
 try{files=await walk(path.join(root,'Calendar'));}
 catch(e){if(['EPERM','EACCES'].includes(e.code))denied=true;continue;}
 found=true;
 for(const file of files){
  const rel=path.relative(root,file);if(blocked(rel))continue;
  try{
   const metadata=await stat(file);examined++;if(metadata.size>512000)continue;const id=hash(file),cached=manifest[id],pending=(cursor.pending||[]).includes(id);const alreadyComplete=!cursor.lastSuccess&&cached&&cached.mtimeMs===metadata.mtimeMs&&cached.size===metadata.size&&state.notes?.[id]?.hash===cached.digest&&!pending;if(alreadyComplete||!inWindow(file,metadata.mtimeMs,cursor.lastSuccess,pending)){unchanged++;continue;}
   const body=await readFile(file,'utf8');scanned++;
   const segments=body.split(/\n(?=#{1,6}\s)|\n\s*\n/).filter(s=>!blocked(s)).flatMap(s=>{
    if(technicalSignal(s))return [s.slice(0,16000)];
    // A bare X link must be read before its topic can be determined.
    // Forward URLs only, without the surrounding nontechnical/private context.
    const links=s.match(/https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[^\s/]+\/status\/\d+[^\s<>"'\[\]]*/g) || [];
    return links.map(u=>u.replace(/[).,;!}`]+$/g,''));
   });
   const allowText=!blocked(body);
   const digest=hash(body);manifest[id]={mtimeMs:metadata.mtimeMs,size:metadata.size,digest};notes.push({id,digest,segments,allowText});
  }catch{unreadable++;}
 }
 break;
}
if(found&&unreadable===0){await writeFile(path.join(data,'noteplan-reader-manifest.json.tmp'),JSON.stringify(manifest),{mode:0o600});await rename(path.join(data,'noteplan-reader-manifest.json.tmp'),path.join(data,'noteplan-reader-manifest.json'));}
console.log(JSON.stringify({scope:'calendar-only',scanStartedAt,cutoff:cutoff(cursor.lastSuccess),examined,unchanged,ok:found && unreadable===0,scanned,unreadable,reason:!found?(denied?'NOTEPLAN_PERMISSION_DENIED':'NOTEPLAN_NOT_FOUND'):unreadable?'NOTEPLAN_PARTIAL_READ':null,notes}));
