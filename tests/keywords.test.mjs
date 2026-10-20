import test from 'node:test';
import assert from 'node:assert/strict';
import {cardKeywords,keywordColor} from '../scripts/km-keywords.mjs';
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
