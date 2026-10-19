import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {preciseTags,tagEvidence} from './km-tags.mjs';
const root=process.env.KM_ROOT || process.cwd();
const base=path.join(os.homedir(),'Library/Application Support/KM'),backups=path.join(base,'backups');
const backup=path.join(backups,'retag-'+Date.now());await fs.mkdir(backup,{recursive:true,mode:0o700});
const old=(await fs.readdir(backups)).filter(n=>/^(interests-|two-lines-|fiche-utility-)/.test(n)).sort().reverse();
let changed=0,insufficient=0;const tagSets=new Map(),examples=[];
async function walk(dir){let out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.')||e.name==='node_modules')continue;const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(e.name.endsWith('.md')&&e.name!=='index.md')out.push(p);}return out;}
for(const folder of ['watch','resources','books'])for(const file of await walk(path.join(root,folder))){
 const text=await fs.readFile(file,'utf8'),match=text.match(/## Tags[ \t]*\r?\n([\s\S]*?)(?=\n## |$)/);if(!match)continue;
 let evidence=tagEvidence(text);if(/^technical-/.test(path.basename(file)))for(const dir of old){try{const prior=await fs.readFile(path.join(backups,dir,path.basename(file)),'utf8');evidence+='\n'+tagEvidence(prior);break}catch{}}
 const title=text.split('\n')[0].replace(/^#\s*/,''),before=match[1].split(/[,\n]/).map(t=>t.trim()).filter(Boolean);
 const tags=preciseTags({title,evidence,existing:before});if(tags.length<2)insufficient++;
 const after=[...tags,...(before.some(t=>/^#rouge$/i.test(t))?['#ROUGE']:[])];const rel=path.relative(root,file);tagSets.set(rel,tags);
 const updated=text.replace(match[0],'## Tags\n\n'+after.join(', ')+'\n');if(updated===text)continue;
 await fs.mkdir(path.dirname(path.join(backup,rel)),{recursive:true,mode:0o700});await fs.writeFile(path.join(backup,rel),text,{mode:0o600});
 await fs.writeFile(file,updated,{mode:0o600});changed++;if(examples.length<10)examples.push({title,before,after});
}
const ip=path.join(root,'index.md');let index=await fs.readFile(ip,'utf8');await fs.writeFile(path.join(backup,'index.md'),index,{mode:0o600});index=index.split('\n').map(line=>{for(const [rel,tags] of tagSets)if(line.includes('`'+rel+'`')){const cells=line.split('|');if(cells.length>=7){cells[4]=' '+tags.join(', ')+' ';return cells.join('|');}}return line;}).join('\n');await fs.writeFile(ip,index);
const report={at:new Date().toISOString(),changed,insufficient,backup,examples};await fs.writeFile(path.join(base,'pipeline/retag-report.json'),JSON.stringify(report),{mode:0o600});console.log(JSON.stringify(report));
