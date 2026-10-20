import {readFileSync} from 'node:fs';
export const resourceTaxonomy=JSON.parse(readFileSync(new URL('../km.resources.json',import.meta.url),'utf8'));
const section=(text,name)=>text.match(new RegExp('(?:^|\\n)## '+name+'[ \\t]*\\n([\\s\\S]*?)(?=\\n## |$)'))?.[1]?.trim()||'';
export function resourceMetadata(text,verified={}){
 const stored=section(text,'Métadonnées');const field=name=>stored.match(new RegExp('^- '+name+' : (.+)$','m'))?.[1]||'À vérifier';
 const title=text.match(/^# (.+)$/m)?.[1]||'';
 let nature=field('Nature');
 if(nature==='À vérifier'){
 const t=title.toLowerCase();
 for(const [pattern,label] of [[/\bskills\b|collection de compétences/,'Collection de skills'],[/\bskill\b/,'Skill individuel'],[/\bcli\b|ligne de commande/,'CLI'],[/serveur mcp|mcp server/,'Serveur MCP'],[/\bsdk\b/,'Bibliothèque / SDK'],[/extension|plugin/,'Extension / plugin'],[/application (de )?bureau|desktop app/,'Application bureau'],[/application mobile/,'Application mobile'],[/\bsaas\b|application web/,'Application web'],[/autonomous.*agent|agent autonome|agent spécialisé/,'Agent spécialisé']])if(pattern.test(t)){nature=label;break;}
 }
 const knownOS=[['macOS','macos'],['Windows','windows'],['Linux','linux'],['iOS / iPadOS','ios'],['Android','android']].filter(([label,id])=>new RegExp('compatibility\\.os\\.'+id+'\\b|#'+id+'\\b','i').test(section(text,'Ontologie')+' '+section(text,'Tags'))).map(([label])=>label);
 const result={nature,os:field('OS')==='À vérifier'&&knownOS.length?knownOS:field('OS').split(' · '),license:field('Licence'),pricing:field('Tarification'),access:field('Accès').split(' · '),evidence:field('Preuve')};
 if(verified.license){result.license=verified.license;result.evidence=verified.source||'Métadonnées du dépôt GitHub';}
 return result;
}
export function resourceMarkdown(m){return '## Métadonnées\n\n'+[['Nature',m.nature],['OS',m.os.join(' · ')],['Licence',m.license],['Tarification',m.pricing],['Accès',m.access.join(' · ')],['Preuve',m.evidence]].map(([k,v])=>'- '+k+' : '+v).join('\n')+'\n\n';}
