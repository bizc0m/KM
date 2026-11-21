import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {classifyFiche,classificationMarkdown,taxonomy,storedConcepts} from './km-ontology.mjs';
import {preciseTags,tagEvidence} from './km-tags.mjs';
const root=process.env.KM_ROOT||process.cwd(),base=process.env.KM_PIPELINE_DATA||path.join(os.homedir(),'Library/Application Support/KM/pipeline');
const backup=path.join(os.homedir(),'Library/Application Support/KM/backups','ontology-'+Date.now());
const report={version:taxonomy.data.version,at:new Date().toISOString(),classified:0,updated:0,withoutSubject:[],unmappedTags:{},subjects:{}};
async function walk(dir){let out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.name.startsWith('.'))continue;const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(e.name.endsWith('.md')&&e.name!=='index.md')out.push(p);}return out;}
for(const folder of ['watch','resources','books'])for(const file of await walk(path.join(root,folder))){
 const text=await fs.readFile(file,'utf8');if(!/^# /m.test(text))continue;
 const section=n=>text.match(new RegExp('## '+n+'[ \\t]*\\n([\\s\\S]*?)(?=\\n## |$)'))?.[1]||'';
 const tags=preciseTags({title:text.split('\n')[0],evidence:tagEvidence(text),existing:section('Tags').split(/[,\n]/).map(x=>x.trim()).filter(Boolean)});
 const status=section('Statut')||section('Classification')||(/#ROUGE/i.test(section('Tags'))?'#ROUGE':'');
 const classification=classifyFiche({tags,status,conceptIds:storedConcepts(text),title:text.split('\n')[0],evidence:tagEvidence(text),sources:section('Sources').match(/https?:\/\/\S+/g)||[],origin:text.match(/- Origine : (.+)/)?.[1]||''});
 const rel=path.relative(root,file);report.classified++;if(!classification.facets.domain.length||classification.facets.domain.includes('domain.unclassified'))report.withoutSubject.push(rel);for(const id of classification.facets.domain)report.subjects[id]=(report.subjects[id]||0)+1;for(const tag of classification.unmappedTags)report.unmappedTags[tag]=(report.unmappedTags[tag]||0)+1;
 const block=classificationMarkdown(classification);const updated=text.includes('## Ontologie\n')?text.replace(/## Ontologie\n[\s\S]*?(?=\n## |$)/,block.trimEnd()+'\n'):text.replace(/\n## Sources\b/,'\n'+block+'## Sources');
 if(updated!==text){await fs.mkdir(path.dirname(path.join(backup,rel)),{recursive:true,mode:0o700});await fs.writeFile(path.join(backup,rel),text,{mode:0o600});await fs.writeFile(file,updated,{mode:0o600});report.updated++;}
}
await fs.mkdir(base,{recursive:true,mode:0o700});await fs.writeFile(path.join(base,'ontology-report.json'),JSON.stringify(report),{mode:0o600});console.log(JSON.stringify({version:report.version,classified:report.classified,updated:report.updated,withoutSubject:report.withoutSubject.length,unmappedTags:Object.keys(report.unmappedTags).length}));
