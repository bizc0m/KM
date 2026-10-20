import test from 'node:test';
import assert from 'node:assert/strict';
import {cardKeywords,keywordColor,conceptColor,colorPalette} from '../scripts/km-keywords.mjs';
test('cards preserve precise keywords without hierarchy paths',()=>{
 const tags=['#codebase-analysis','#knowledge-graph','#coding'];
 assert.deepEqual(cardKeywords({tags}).map(k=>k.label),tags);
 assert.equal(cardKeywords({tags:['#technique','#informatique']}).length,0);
});
test('research and API keywords have stable family colors',()=>{
 for(const t of ['recherche-documentaire','research-agent','autonomous-research','papers'])assert.equal(keywordColor(t),'research');
 for(const t of ['llm','api','free-tier','providers'])assert.equal(keywordColor(t),'llm');
 assert.equal(keywordColor('#CODEBASE-ANALYSIS'),'dev');
});
test('fallback shows final specific term, never generic parents',()=>{
 const concepts=[{id:'domain.ai',label:'Intelligence artificielle',path:['IA']},{id:'domain.ai.agents',label:'Agents IA',path:['IA','Agents IA'],aliases:['#agents','#research-agent']}];
 const result=cardKeywords({classification:{facets:{domain:['domain.ai','domain.ai.agents']}},concepts});
 assert.deepEqual(result.map(k=>k.label),['#research-agent']);
 assert.equal(result[0].subjectId,'domain.ai.agents');
});

test('verified GitHub forks resolve to one upstream project',async()=>{
 const {repositoryKey}=await import('../scripts/km-tool-fiches.mjs');
 assert.equal(repositoryKey('https://github.com/a14c773b/anthropic-cybersecurity-skills'),'https://github.com/mukul975/anthropic-cybersecurity-skills');
 assert.equal(repositoryKey('https://github.com/abdullakala/anthropic-cybersecurity-skills'),'https://github.com/mukul975/anthropic-cybersecurity-skills');
 assert.equal(repositoryKey('https://github.com/other/independent-project'),'https://github.com/other/independent-project');
});
test('resource axes preserve evidence and never equate GitHub with free or open source',async()=>{
 const {resourceMetadata,resourceMarkdown}=await import('../scripts/km-resource-metadata.mjs');
 const unknown=resourceMetadata('# Free LLM API\n\n## Sources\n\nhttps://github.com/example/tool');
 assert.equal(unknown.license,'À vérifier');assert.equal(unknown.pricing,'À vérifier');assert.deepEqual(unknown.os,['À vérifier']);
 const saved=resourceMetadata('# Toolkit\n'+resourceMarkdown({nature:'CLI',os:['macOS','Linux'],license:'MIT',pricing:'Payant',access:['Terminal'],evidence:'https://github.com/example/tool'}));
 assert.equal(saved.license,'MIT');assert.equal(saved.pricing,'Payant');assert.deepEqual(saved.os,['macOS','Linux']);
 assert.deepEqual(resourceMetadata('# Python SDK\n## Tags\n#python').os,['À vérifier']);
 assert.deepEqual(resourceMetadata('# App\n## Tags\n#macos').os,['macOS']);
});

test('historical domains keep their palette and technical metadata remains neutral',()=>{
 const expected={llm:'#4d348f',agent:'#145f52',dev:'#245f8f',research:'#244678',media:'#8a2557',osint:'#7a3f00',security:'#8f0000',privacy:'#225522',finance:'#6a4a08',source:'#6f5100',watchlist:'#573273',tool:'#333333'};
 for(const [id,color]of Object.entries(expected))assert.equal(colorPalette[id].foreground,color);
 for(const t of ['#macos','#windows','MIT','Apache-2.0','Payant'])assert.equal(keywordColor(t),'tool');
 assert.equal(conceptColor('domain.ai.agents.skills'),'agent');assert.equal(conceptColor('domain.osint'),'osint');assert.equal(conceptColor('domain.privacy'),'privacy');
 assert.equal(keywordColor('#directory'),'watchlist');assert.equal(keywordColor('#transcription'),'media');assert.equal(keywordColor('unmapped-topic'),'tool');
});

test('search cards use project names and no generic fallback descriptions',async()=>{
 const {cardTitle,cardInterest}=await import('../scripts/km-card-presentation.mjs');
 assert.equal(cardTitle({title:"agency-agents : Bibliothèque de rôles d’agents"}),'agency-agents');
 assert.equal(cardTitle({title:'Agent de conception AI open-source',github:'https://github.com/example/design-agent'}),'design-agent');
 assert.equal(cardInterest({title:'X',summary:'Ajouter des rôles pour des conseils spécialisés.'}),'');
 assert.equal(cardInterest({title:'X',type:'outil'}),'');assert.equal(cardInterest({summary:'fournit une base technique reusable'}),'');assert.equal(cardTitle({title:'Archive NotePlan Captures 2026',github:'https://github.com/example/Calyx'}),'Archive NotePlan Captures 2026');
 assert.equal(cardInterest({title:'Whisper',summary:'Transcrire des entretiens et distinguer les intervenants.'}),'Transcrire des entretiens et distinguer les intervenants.');
});
