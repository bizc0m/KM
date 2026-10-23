#!/usr/bin/env node
// Run on the publishing Mac: pull only the filtered M2 viewer, never raw NotePlan.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile),base=path.join(os.homedir(),'Library/Application Support/KM/public-publisher'),checkout=path.join(base,'checkout'),branch='codex/km-technical-pipeline';
await fs.mkdir(base,{recursive:true});const lock=path.join(base,'lock');try{const p=JSON.parse(await fs.readFile(lock));try{process.kill(p.pid,0);process.exit(0);}catch(e){if(e.code!=='ESRCH')throw e;}}catch(e){if(e.code!=='ENOENT')throw e;}await fs.writeFile(lock,JSON.stringify({pid:process.pid}));
const status={startedAt:new Date().toISOString()};
const run=(cmd,args,cwd=checkout)=>exec(cmd,args,{cwd,maxBuffer:100*1024*1024,timeout:180000,env:{...process.env,GIT_TERMINAL_PROMPT:'0',KM_PIPELINE_DATA:path.join(base,'state')}});
try{
 try{await fs.access(path.join(checkout,'.git'));}catch{await run('git',['clone','--single-branch','--branch',branch,'https://github.com/bizc0m/KM.git',checkout],base);}
 const dirty=await run('git',['status','--porcelain']);if(dirty.stdout.trim())throw Error('Publisher checkout has changes; inspect before continuing');
 await run('git',['pull','--ff-only','origin',branch]);
 const {stdout}=await run('/usr/bin/ssh',['-o','BatchMode=yes','-o','ConnectTimeout=10','m2','cat "/Users/JOB/#DEV/06-km/KM/search-v2.html"']);
 const match=stdout.match(/const KM_INDEX=(.*);\n/);if(!match)throw Error('M2 public index unavailable');const rows=JSON.parse(match[1]);if(!rows.length)throw Error('Empty snapshot refused');
 const snapshot=path.join(base,'snapshot.json');await fs.writeFile(snapshot,JSON.stringify({at:new Date().toISOString(),rows}),{mode:0o600});
 for(const [script,args] of [['km-import-public-snapshot.mjs',[snapshot]],['km-merge-tool-fiches.mjs',[]],['build-search-v1.12-html.mjs',[]],['km-verify-placement.mjs',[]],['km-quality-report.mjs',[]]])await run(process.execPath,['scripts/'+script,...args]);
 // Explicit public allowlist; no pipeline caches, logs, credentials or NotePlan folders.
 await run('git',['add','index.md','watch','resources','books','public','search-v2.html','km.fiche-redirects.json']);
 const diff=await run('git',['diff','--cached','--name-only']);
 if(diff.stdout.trim()){await run('git',['commit','-m','Refresh filtered KM snapshot from M2']);await run('git',['push','origin',branch]);status.published=true;}else status.published=false;
 status.exported=rows.length;status.ok=true;
}catch(e){status.ok=false;status.error=e.message;process.exitCode=1;}finally{status.finishedAt=new Date().toISOString();await fs.writeFile(path.join(base,'status.json'),JSON.stringify(status,null,2));await fs.rm(lock,{force:true});console.log(JSON.stringify(status));}
