import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFile} from 'node:child_process';
const data=path.join(os.homedir(),'Library/Application Support/KM/pipeline');
let s;try{s=JSON.parse(await readFile(path.join(data,'status.json'),'utf8'));}catch{s={};}
let state;try{state=JSON.parse(await readFile(path.join(data,'state.json'),'utf8'));}catch{state={};}
const reference=state.lastSuccess || state.firstRun || s.startedAt;
const stale=!reference || Date.now()-Date.parse(reference)>24*3600000;
if(stale){
  const file=path.join(data,'stale-alert.txt');let previous='';try{previous=await readFile(file,'utf8');}catch{}
  if(Date.now()-Date.parse(previous || '1970-01-01')>24*3600000){
    execFile('/usr/bin/osascript',['-e','display notification "Aucun passage de la veille depuis plus de 24 heures. Consulter le statut KM." with title "KM technique"'],()=>{});
    await writeFile(file,new Date().toISOString(),{mode:0o600});
  }
  process.exitCode=1;
}
console.log(JSON.stringify({health:s.health || 'unknown',stale,finishedAt:s.finishedAt || null,errors:s.errors || []}));
