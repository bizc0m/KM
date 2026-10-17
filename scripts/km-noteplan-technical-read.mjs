// Isolated reader: the parent can terminate a macOS consent/file-provider stall.
// No raw notes or private paths are written to disk or to diagnostic output.
import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {blocked,technicalSignal} from './km-technical-policy.mjs';
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.') || /^(@Archive|@Trash|@Templates)$/.test(e.name) || e.name.endsWith('_attachments'))continue;const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(e.isFile() && /\.(md|txt)$/i.test(e.name))out.push(p);}return out;}
const roots=process.env.NOTEPLAN_ROOT?[process.env.NOTEPLAN_ROOT]:[
 path.join(os.homedir(),'Library/Containers/co.noteplan.NotePlan-setapp/Data/Library/Application Support/co.noteplan.NotePlan-setapp'),
 path.join(os.homedir(),'Library/Containers/co.noteplan.NotePlan3/Data/Library/Application Support/co.noteplan.NotePlan3'),
 path.join(os.homedir(),'Library/Mobile Documents/iCloud~co~noteplan~NotePlan/Documents')];
let denied=false,found=false;const notes=[];let scanned=0,unreadable=0;
for(const root of roots){
 let files;
 try{files=await walk(path.join(root,'Notes'));try{files.push(...await walk(path.join(root,'Calendar')));}catch(e){if(e.code!=='ENOENT')throw e;}}
 catch(e){if(['EPERM','EACCES'].includes(e.code))denied=true;continue;}
 if(!files.length)continue;found=true;
 for(const file of files){
  const rel=path.relative(root,file);if(blocked(rel))continue;
  try{
   if((await stat(file)).size>512000)continue;
   const body=await readFile(file,'utf8');scanned++;
   const segments=body.split(/\n(?=#{1,6}\s)|\n\s*\n/).filter(s=>!blocked(s) && technicalSignal(s)).map(s=>s.slice(0,16000));
   const allowText=!blocked(body) && /(?:^|[/\\])[^/\\]*(?:technique|technical|informatique|développement|developpement|programmation|## KM|_Outils IA)[^/\\]*(?:[/\\])/i.test(rel);
   notes.push({id:hash(file),digest:hash(body),segments,allowText});
  }catch{unreadable++;}
 }
 break;
}
console.log(JSON.stringify({ok:found && unreadable===0,scanned,unreadable,reason:!found?(denied?'NOTEPLAN_PERMISSION_DENIED':'NOTEPLAN_NOT_FOUND'):unreadable?'NOTEPLAN_PARTIAL_READ':null,notes}));
