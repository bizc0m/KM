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
