#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
const exec=promisify(execFile),root=process.env.KM_ROOT || fileURLToPath(new URL('..',import.meta.url));
const data=process.env.KM_PIPELINE_DATA || path.join(os.homedir(),'Library/Application Support/KM/pipeline');
await fs.mkdir(data,{recursive:true,mode:0o700});const lock=path.join(data,'automation.lock');
try{const old=JSON.parse(await fs.readFile(lock,'utf8'));try{process.kill(old.pid,0);console.log('automation_already_running');process.exit(0);}catch(e){if(e.code!=='ESRCH')throw e;}await fs.rm(lock);}catch(e){if(e.code!=='ENOENT')throw e;}
const handle=await fs.open(lock,'wx',0o600);await handle.writeFile(JSON.stringify({pid:process.pid,at:new Date().toISOString()}));await handle.close();
const report={startedAt:new Date().toISOString(),stages:[],tagsPolicy:'precise-functions-v1'};
const save=()=>fs.writeFile(path.join(data,'automation-status.json'),JSON.stringify(report),{mode:0o600});
try{
 // The manual tweet backfill must finish before any migration writes files.
 for(;;){let running=false;try{const p=await exec('/usr/bin/pgrep',['-f','(^|/)node .*km-process-tweet[.]mjs']);running=Boolean(p.stdout.trim());}catch(e){if(e.code!==1)throw e;}
  if(!running)break;report.stage='waiting_existing_tweet';await save();await new Promise(resolve=>setTimeout(resolve,5000));}
 try{const old=JSON.parse(await fs.readFile(path.join(data,'run.lock'),'utf8'));try{process.kill(old.pid,0);report.stage='existing_pipeline_active';await save();process.exitCode=0;}catch(e){if(e.code!=='ESRCH')throw e;}}catch(e){if(e.code!=='ENOENT')throw e;}
 if(report.stage!=='existing_pipeline_active'){
  for(const script of ['km-merge-tool-fiches.mjs','km-retag.mjs','km-migrate-resources.mjs','km-requalify-primary.mjs','km-apply-verified.mjs','km-classify-fiches.mjs','build-search-v1.12-html.mjs','km-verify-placement.mjs','km-quality-report.mjs','km-rewrite-interests.mjs','km-reconcile-note-links.mjs','km-noteplan-writeback.mjs','km-technical-pipeline.mjs','km-requalify-primary.mjs','km-apply-verified.mjs','build-search-v1.12-html.mjs','km-quality-report.mjs','km-noteplan-writeback.mjs','km-coverage.mjs']){
   report.stage=script;await save();let result;try{result=await exec(process.execPath,[path.join(root,'scripts',script),...(script==='km-technical-pipeline.mjs'?['--backfill']:script==='km-rewrite-interests.mjs'?['--review-only']:script==='km-noteplan-writeback.mjs'?['--apply']:[])],{cwd:root,env:process.env,maxBuffer:10_000_000});}catch(e){if(script!=='km-technical-pipeline.mjs')throw e;const status=JSON.parse(await fs.readFile(path.join(data,'status.json'),'utf8'));if(status.health!=='attention'||Date.parse(status.finishedAt)<Date.parse(report.startedAt))throw e;report.collectionHealth='attention';result={stdout:''};}report.stages.push({script,ok:true,at:new Date().toISOString()});if(script==='km-coverage.mjs')report.coverage=JSON.parse(result.stdout);await save();
  }report.stage='complete';report.finishedAt=new Date().toISOString();await save();
 }
}catch(e){report.stage='failed';report.error=e.code || e.name;await save();throw e;}finally{await fs.rm(lock,{force:true});}
