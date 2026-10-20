import fs from 'node:fs/promises';
import path from 'node:path';
import {blocked,technicalSignal} from './km-technical-policy.mjs';
import {classificationMarkdown} from './km-ontology.mjs';
const snapshot=JSON.parse(await fs.readFile(process.argv[2],'utf8'));let imported=0,excluded=0;const rows=[];
for(const row of snapshot.rows){
 if(!/^(watch|resources|books)\/[a-zA-Z0-9_./ -]+\.md$/.test(row.path)||row.path.split('/').includes('..'))throw Error('invalid_public_path');
 let text=row.raw || '';if(blocked(text)||/\bsex[ -]?work\b/i.test(text)||!technicalSignal(text)){excluded++;continue;}
 // Contact details and local paths are not needed in a public technical fiche.
 text=text.split('\n').filter(line=>!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\/Users\/|\bsk-[a-z0-9_-]{12,}/i.test(line)).join('\n');
 if(row.classification)text=text.replace(/\n## Sources\b/,'\n\n'+classificationMarkdown(row.classification)+'## Sources');
 await fs.mkdir(path.dirname(row.path),{recursive:true});await fs.writeFile(row.path,text.trim()+'\n');rows.push(row);imported++;
}
const header='# KM — fiches publiables\n\n| Identifiant | Fichier | Type | Tags | Statut |\n| --- | --- | --- | --- | --- |\n';
await fs.writeFile('index.md',header+rows.map(r=>`| \`${r.id}\` | \`${r.path}\` | outil | ${r.tags.join(', ')} | ${r.status} |`).join('\n')+'\n');
for(const folder of ['watch','resources','books'])await fs.writeFile(folder+'/index.md','# '+folder+'\n\n| Identifiant | Fichier | Type | Statut |\n| --- | --- | --- | --- |\n'+rows.filter(r=>r.path.startsWith(folder+'/')).map(r=>`| \`${r.id}\` | \`${path.basename(r.path)}\` | outil | ${r.status} |`).join('\n')+'\n');
await fs.writeFile('public/snapshot.json',JSON.stringify({at:snapshot.at,imported,excluded,policy:'filtered-public-view-no-raw-noteplan-notes'},null,2)+'\n');
for(const p of ['index.md','watch/index.md','resources/index.md','books/index.md'])await fs.writeFile(p,(await fs.readFile(p,'utf8')).trimEnd()+'\n');
console.log(JSON.stringify({at:snapshot.at,imported,excluded}));
