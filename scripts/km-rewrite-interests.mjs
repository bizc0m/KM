import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {INTEREST_PROMPT,validInterest} from './km-interest-text.mjs';
import {loadPublicPage} from './km-source-crawl.mjs';
import {blocked} from './km-technical-policy.mjs';
import {findProductImages} from './km-product-media.mjs';
import {ownedRepositories} from './km-tool-fiches.mjs';
const base=path.join(os.homedir(),'Library/Application Support/KM');
const backups=path.join(base,'backups');
const dest=path.join(backups,'rewrite-interests-'+Date.now());await fs.mkdir(dest,{recursive:true,mode:0o700});
const files=JSON.parse(await fs.readFile('public/index.json','utf8')).rows.map(r=>r.path).filter(p=>/^(watch|resources|books)\/[a-zA-Z0-9_./-]+\.md$/.test(p)&&!p.includes('..')); 
const reviewOnly=process.argv.includes('--review-only');
let done=0,review=0,selected=0;
const progress=()=>fs.writeFile(path.join(base,'pipeline/interests-progress.json'),JSON.stringify({version:'three-lines-v1',total:files.length,selected,done,review,at:new Date().toISOString()}),{mode:0o600});
await progress();
for(const name of files){
 const file=name;let current=await fs.readFile(file,'utf8'),source='';
 const existing=current.match(/## Intérêts\n\n([\s\S]*?)(?=\n## |$)/)?.[1]?.trim();if(validInterest(existing))continue;
 if(reviewOnly&&existing!=='Intérêt à vérifier')continue;selected++;
 source=current; // Current documented facts, never historical raw notes.

 // Only pre-existing filtered summaries and facts; no raw NotePlan text.
 let evidence=source.split('## Sources')[0];
 {const primary=ownedRepositories(current)[0];if(primary)try{const page=await loadPublicPage(primary);if(blocked(page.text)||!page.text.trim())continue;evidence=page.text.slice(0,12000);}catch{continue;}}
 let text='Intérêt à vérifier';
 if(!blocked(evidence))for(let attempt=0;attempt<2;attempt++)try{
  const r=await fetch('http://127.0.0.1:11434/api/generate',{method:'POST',headers:{'content-type':'application/json'},signal:AbortSignal.timeout(60000),body:JSON.stringify({model:'qwen3:8b',stream:false,think:false,system:INTEREST_PROMPT,prompt:JSON.stringify({source:evidence,correction:attempt?'Respecte exactement trois lignes Fonction · / Avantages · / Gain ·, 3 à 12 mots par ligne.':''}),options:{temperature:0,num_predict:260,num_ctx:4096}})});
  if(!r.ok)throw Error('model');const candidate=(await r.json()).response.trim();
  if(validInterest(candidate)&&!blocked(candidate)){text=candidate;break;}
 }catch{}
 if(!validInterest(text)){review++;await progress();continue;}
 await fs.mkdir(path.dirname(path.join(dest,name)),{recursive:true});await fs.writeFile(path.join(dest,name),current,{mode:0o600});
 const before=current;
 current=current.replace(/## Intérêts\n\n[\s\S]*?(?=\n## |$)/,'## Intérêts\n\n'+text+'\n');
 if(!/## Intérêts/.test(current))current+='\n## Intérêts\n\n'+text+'\n';
 if(!/## Aperçus/.test(current)){const url=ownedRepositories(current)[0]||current.match(/https:\/\/[^\s<>]+/)?.[0];if(url){const images=await findProductImages(url);if(images.length)current+='\n## Aperçus\n\n'+images.map(i=>'!['+i.alt.replace(/[\[\]]/g,'')+']('+i.url+')\n\n[Origine]('+i.source+')').join('\n\n')+'\n';}}
 if(await fs.readFile(file,'utf8')!==before){review++;continue;}
 await fs.writeFile(file,current,{mode:0o600});done++;if(text==='Intérêt à vérifier')review++;
 await fs.writeFile(path.join(base,'pipeline/interests-progress.json'),JSON.stringify({total:files.length,selected,done,review,at:new Date().toISOString()}),{mode:0o600});
 if(done===1||done%10===0)execFileSync(process.execPath,['scripts/build-search-v1.12-html.mjs'],{stdio:'ignore'});
}
execFileSync(process.execPath,['scripts/build-search-v1.12-html.mjs'],{stdio:'ignore'});
execFileSync(process.execPath,['scripts/km-verify-placement.mjs'],{stdio:'inherit'});
await progress();console.log(JSON.stringify({selected,done,review}));
