import {readFileSync} from 'node:fs';
import {ownedRepositories,repositoryKey} from './km-tool-fiches.mjs';
import {resourceMetadata,resourceMarkdown} from './km-resource-metadata.mjs';
import {classifyFiche,classificationMarkdown} from './km-ontology.mjs';
export const verifiedResources=JSON.parse(readFileSync(new URL('../km.verified-resources.json',import.meta.url),'utf8'));
export function correctedResource(text,key){
 const repo=repositoryKey(key)||ownedRepositories(text)[0],fix=verifiedResources[repo];if(!fix)return text;
 const replace=(s,name,body)=>{const re=new RegExp('\\n## '+name+'[ \\t]*\\n[\\s\\S]*?(?=\\n## |$)');const section='\n## '+name+'\n\n'+body+'\n';return re.test(s)?s.replace(re,section):s.trimEnd()+'\n'+section;};
 let out=text.replace(/^# [^\n]+/,'# '+fix.title);
 out=replace(out,'Identité','- Dépôt principal : '+repo+(fix.officialSite?'\n- Site officiel : '+fix.officialSite:'')+'\n- Preuve de correction : '+fix.evidence);
 out=replace(out,'Tags',fix.tags.join(', '));out=replace(out,'Intérêts',fix.utility);
 const classification=classifyFiche({tags:fix.tags,title:fix.title,conceptIds:fix.conceptIds,status:text.match(/## Statut\n\s*([^\n]+)/)?.[1]||'actif',sources:[repo]});
 out=replace(out,'Ontologie',classificationMarkdown(classification).replace(/^## Ontologie\n+/,'').trim());
 const m=resourceMetadata(out);if(fix.nature)m.nature=fix.nature;if(fix.os)m.os=fix.os;
 out=replace(out,'Métadonnées',resourceMarkdown(m).replace(/^## Métadonnées\n+/,'').trim());return out;
}
