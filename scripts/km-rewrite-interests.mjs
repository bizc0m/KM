import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {INTEREST_PROMPT,validInterest} from './km-interest-text.mjs';
import {blocked} from './km-technical-policy.mjs';
const base=path.join(os.homedir(),'Library/Application Support/KM');
const backups=path.join(base,'backups');
const prior=(await fs.readdir(backups)).filter(n=>n.startsWith('interests-')).sort().reverse();
const dest=path.join(backups,'rewrite-interests-'+Date.now());await fs.mkdir(dest,{recursive:true,mode:0o700});
const files=(await fs.readdir('watch')).filter(n=>/^technical-.*\.md$/.test(n));
let done=0,review=0;
for(const name of files){
 const file='watch/'+name;let current=await fs.readFile(file,'utf8'),source='';
 for(const dir of prior){try{source=await fs.readFile(path.join(backups,dir,name),'utf8');break}catch{}}
 source=source||current;
 // Only pre-existing filtered summaries and facts; no raw NotePlan text.
 const evidence=source.split('## Sources')[0];let text='Intérêt à vérifier';
 if(!blocked(evidence))for(let attempt=0;attempt<2;attempt++)try{
  const r=await fetch('http://127.0.0.1:11434/api/generate',{method:'POST',headers:{'content-type':'application/json'},signal:AbortSignal.timeout(60000),body:JSON.stringify({model:'qwen3:8b',stream:false,think:false,system:INTEREST_PROMPT,prompt:JSON.stringify({source:evidence,correction:attempt?'Respecte strictement 6 à 15 mots.':''}),options:{temperature:0,num_predict:100,num_ctx:4096}})});
  if(!r.ok)throw Error('model');const candidate=(await r.json()).response.trim();
  if(validInterest(candidate)&&!blocked(candidate)){text=candidate;break;}
 }catch{}
 await fs.writeFile(path.join(dest,name),current,{mode:0o600});
 current=current.replace(/## Intérêts\n\n[\s\S]*?(?=\n## |$)/,'## Intérêts\n\n'+text+'\n');
 await fs.writeFile(file,current,{mode:0o600});done++;if(text==='Intérêt à vérifier')review++;
 await fs.writeFile(path.join(base,'pipeline/interests-progress.json'),JSON.stringify({total:files.length,done,review,at:new Date().toISOString()}),{mode:0o600});
 if(done===1||done%10===0)execFileSync(process.execPath,['scripts/build-search-v1.12-html.mjs'],{stdio:'ignore'});
}
execFileSync(process.execPath,['scripts/build-search-v1.12-html.mjs'],{stdio:'ignore'});
execFileSync(process.execPath,['scripts/km-verify-placement.mjs'],{stdio:'inherit'});
console.log(JSON.stringify({done,review}));
