#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {classify} from './km-technical-pipeline.mjs';
import {validDecision} from './km-technical-policy.mjs';
const root=process.env.KM_ROOT || process.cwd();
const backup=path.join(os.homedir(),'Library/Application Support/KM/backups','fiche-utility-'+Date.now());
await fs.mkdir(backup,{recursive:true,mode:0o700});
const files=(await fs.readdir(path.join(root,'watch'))).filter(n=>/^technical-.*\.md$/.test(n));
const preferred=process.env.KM_PRIORITY_FICHE;
files.sort((a,b)=>(a===preferred?-1:b===preferred?1:0));
let changed=0,errors=0;
for(const name of files){
 const p=path.join(root,'watch',name);let text=await fs.readFile(p,'utf8');
 await fs.writeFile(path.join(backup,name),text,{mode:0o600});
 text=text.replace(/## Type\n\nVeille technique informatique\n\n/g,'').replace('## Résumé','## Ce que ça fait');
 await fs.writeFile(p,text,{mode:0o600});
}
// Work from existing, already filtered source summaries. Never invent install instructions.
for(const name of files){
 const p=path.join(root,'watch',name);let text=await fs.readFile(p,'utf8');
 if(text.includes('## À quoi ça sert'))continue;
 const evidence=text.split('## Sources')[0];
 try{
  const d=await classify(evidence);
  if(!validDecision(d,evidence))throw new Error('unvalidated');
  const clean=v=>v.replace(/[<>]/g,'').replace(/^#/gm,'').trim();
  const section=`## À quoi ça sert\n\n${clean(d.utility)}\n\n## Comment l’utiliser\n\n${d.usage.length?d.usage.map(v=>'- '+clean(v)).join('\n'):'Procédure non précisée dans les sources analysées.'}\n\n## Limites et prérequis\n\n${d.limitations.length?d.limitations.map(v=>'- '+clean(v)).join('\n'):'Compatibilité et prérequis non établis par les sources analysées.'}\n\n`;
  text=text.replace('## Faits relevés dans la source',section+'## Faits relevés dans la source');
  await fs.writeFile(p,text,{mode:0o600});changed++;
 }catch{errors++;}
 await fs.writeFile(path.join(backup,'progress.json'),JSON.stringify({total:files.length,changed,errors,at:new Date().toISOString()}),{mode:0o600});
 if(changed===1 || changed%10===0){const {execFileSync}=await import('node:child_process');execFileSync(process.execPath,['scripts/build-search-v1.12-html.mjs'],{cwd:root,stdio:'ignore'});}
}
const {execFileSync}=await import('node:child_process');
execFileSync(process.execPath,['scripts/build-search-v1.12-html.mjs'],{cwd:root,stdio:'ignore'});
execFileSync(process.execPath,['scripts/km-verify-placement.mjs'],{cwd:root,stdio:'inherit'});
console.log(JSON.stringify({total:files.length,changed,errors,backup}));
