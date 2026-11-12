import test from 'node:test';
import assert from 'node:assert/strict';
import {cycleBudgetAllows} from '../scripts/km-technical-pipeline.mjs';
test('Calendar quota preserves capacity for public sources',()=>{
 const b={processed:4,phaseStartedAt:0,at:10,limit:8,noteplanLimit:4,phaseBudgetMs:100};
 assert.equal(cycleBudgetAllows({...b,origin:'NotePlan'}),false);
 assert.equal(cycleBudgetAllows({...b,origin:'Raindrop'}),true);
 assert.equal(cycleBudgetAllows({...b,processed:8,origin:'Raindrop'}),false);
});
test('elapsed Calendar budget stops backlog and a new phase gets its own time',()=>{
 const b={processed:1,phaseStartedAt:0,at:100,limit:8,noteplanLimit:4,phaseBudgetMs:100};
 assert.equal(cycleBudgetAllows({...b,origin:'NotePlan'}),false);
 assert.equal(cycleBudgetAllows({...b,origin:'Raindrop',phaseStartedAt:100}),true);
});
test('recovery can defer Calendar without disabling public ingestion',()=>{
 const b={processed:0,phaseStartedAt:0,at:1,limit:8,noteplanLimit:0,phaseBudgetMs:100};
 assert.equal(cycleBudgetAllows({...b,origin:'NotePlan'}),false);
 assert.equal(cycleBudgetAllows({...b,origin:'Raindrop'}),true);
});

import {crawlSource,analyzeCrawl} from '../scripts/km-source-crawl.mjs';
test('analysis deadline retains unread analysis as pending, never complete',async()=>{
 const crawl=await crawlSource('https://example.org',{fetchPage:async url=>({url,text:'Python SDK API documentation.',links:[]})});
 let calls=0;const result=await analyzeCrawl(crawl,async()=>{calls++;throw Error('unexpected');},{deadline:Date.now()-1});
 assert.equal(calls,0);assert.equal(result.report.analysisPending,1);assert.equal(result.report.complete,false);assert.equal(result.details.length,0);
});
