import test from 'node:test';
import assert from 'node:assert/strict';
import {crawlSource,sourceLinks,analyzeCrawl,crawlKey,loadPublicPage} from '../scripts/km-source-crawl.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const page=(url,links=[])=>({url,text:'Documentation technique Python SDK et API.',links});
test('all 30 direct tweet links are read, breadth first, up to depth three',async()=>{
 const root='https://x.com/i/status/123';const direct=Array.from({length:30},(_,i)=>`https://example.org/tool/${i}`);const called=[];
 const graph=new Map([[root,page(root,direct)],...direct.map(u=>[u,page(u)])]);
 graph.set(direct[0],page(direct[0],['https://example.org/depth2']));
 graph.set('https://example.org/depth2',page('https://example.org/depth2',['https://example.org/depth3']));
 graph.set('https://example.org/depth3',page('https://example.org/depth3',['https://example.org/depth4',root]));
 const c=await crawlSource(root,{fetchPage:async u=>{called.push(u);return graph.get(u);}});
 assert.equal(c.report.read,33);assert.equal(c.report.depthLimited,1);assert.equal(called.includes('https://example.org/depth4'),false);
 assert.deepEqual(called.slice(1,31),direct);assert.equal(new Set(called).size,called.length);
});
test('budgets, fetch errors and exclusions stay visible rather than counted as read',async()=>{
 const root='https://example.org/root';const c=await crawlSource(root,{maxPages:2,fetchPage:async u=>u===root?page(root,['https://example.org/a','https://example.org/b','https://example.org/nsfw']):Promise.reject(new Error('http_403'))});
 assert.equal(c.report.read,1);assert.equal(c.report.errors,1);assert.equal(c.report.pageLimited,1);assert.equal(c.report.excluded,1);assert.equal(c.report.complete,false);
 assert.equal(c.nodes.some(n=>n.url?.includes('nsfw')),false);
});
test('extract main-content links, markdown relatives and short URLs without navigation',()=>{
 assert.deepEqual(sourceLinks('<nav><a href="/login">login</a></nav><main><a href="/docs?a=1&amp;b=2">API</a><a href="https://t.co/xyz">next</a></main>','https://example.org',true),['https://example.org/docs?a=1&b=2','https://t.co/xyz']);
 assert.deepEqual(sourceLinks('[SDK](docs/sdk.md)','https://example.org/repo/'),['https://example.org/repo/docs/sdk.md']);
 assert.deepEqual(sourceLinks('![badge](https://img.shields.io/version) [SDK](docs/sdk.md)','https://example.org/repo/'),['https://example.org/repo/docs/sdk.md']);
 assert.equal(crawlKey('https://twitter.com/user/status/123?s=20'),'https://x.com/i/status/123');
});
test('GitHub rate limits fall back to the actual README without inventing content',async()=>{
 const called=[];const fetch=async u=>{called.push(u);if(u.startsWith('https://api.github.com/'))throw Error('http_403');return {url:u,type:'text/plain',text:'# Python SDK\nAPI documentation. [Guide](docs/guide.md)'};};
 const result=await loadPublicPage('https://github.com/example/sdk',{fetch});assert.ok(result.text.includes('API documentation'));assert.ok(result.links.includes('https://raw.githubusercontent.com/example/sdk/HEAD/docs/guide.md'));
 assert.equal(called.filter(u=>u.startsWith('https://api.github.com')).length,1);
 await assert.rejects(loadPublicPage('https://github.com/example/missing',{fetch:async()=>{throw Error('http_404');}}),/github_content_unavailable/);
});
test('every technical page is analyzed and cached without retaining source text',async()=>{
 const root='https://example.org';const c=await crawlSource(root,{fetchPage:async u=>page(u,u===root?['https://example.org/a']:[])});let calls=0;
 const classify=async()=>{calls++;return {decision:'technical',personal:false,adult:false,title:'SDK Python',summary:'API Python.',facts:['Le SDK expose une API.'],risk:'ordinary'};};
 const a=await analyzeCrawl(c,classify);assert.equal(calls,2);assert.equal(a.details.length,2);assert.equal(a.report.analysisPending,0);assert.equal(a.report.complete,true);
 assert.equal(JSON.stringify(a).includes('Documentation technique'),false);
 await analyzeCrawl(c,classify,{cache:a.decisions});assert.equal(calls,2);
});
test('model failures remain explicit and are not treated as successful analysis',async()=>{
 const c=await crawlSource('https://example.org',{fetchPage:async u=>page(u)});
 const a=await analyzeCrawl(c,async()=>{throw Error('model_timeout');});assert.equal(a.report.analysisErrors,1);assert.equal(a.report.complete,false);assert.equal(a.details.length,0);
});
test('rewriting an existing tweet fiche preserves both index paths',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'km-crawl-write-'));
 try{
  fs.mkdirSync(path.join(root,'watch'));fs.writeFileSync(path.join(root,'index.md'),'# Index\n| `watch:technical-old` | `watch/technical-old.md` |\n');fs.writeFileSync(path.join(root,'watch/index.md'),'# Watch\n| `watch:technical-old` | `technical-old.md` |\n');
  const module=new URL('../scripts/km-technical-pipeline.mjs',import.meta.url).href;
  const code=`const {addFiche}=await import(${JSON.stringify(module)});await addFiche('https://x.com/i/status/123',{title:'SDK',summary:'API Python.',facts:['SDK Python.'],risk:'ordinary'},['https://x.com/i/status/123'],'NotePlan',{target:'watch/technical-old.md'});`;
  const r=spawnSync(process.execPath,['--input-type=module','-e',code],{env:{...process.env,KM_ROOT:root},encoding:'utf8'});assert.equal(r.status,0,r.stderr);
  assert.deepEqual(fs.readdirSync(path.join(root,'watch')).sort(),['index.md','technical-old.md']);
  assert.equal(fs.readFileSync(path.join(root,'watch/index.md'),'utf8').split('\n').filter(l=>l.startsWith('|')).length,1);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('X article body and expanded facets expose all repository links',async()=>{
 const p=await loadPublicPage('https://x.com/i/status/42',{fetch:async()=>({text:JSON.stringify({tweet:{text:'GitHub tools',raw_text:{facets:[{replacement:'https://github.com/A/One'}]},article:{content:{blocks:[{text:'Second https://github.com/B/Two'}]}},quote:{id:'43',article:{content:{blocks:[{text:'Embedded https://github.com/C/Three'}]}}}}})})});
 assert.ok(p.links.includes('https://github.com/A/One'));assert.ok(p.links.includes('https://github.com/B/Two'));assert.ok(p.links.includes('https://x.com/i/status/43'));assert.match(p.text,/Second/);assert.ok(p.links.includes('https://github.com/C/Three'));assert.match(p.text,/Embedded/);
});
test('publish one fiche per canonical repository and enrich it on subsequent tweets',async()=>{
 const {publishTools,repositoryKey}=await import('../scripts/km-tool-fiches.mjs');const root=fs.mkdtempSync(path.join(os.tmpdir(),'km-tools-'));fs.mkdirSync(path.join(root,'watch'));
 try{const targets=new Map();let calls=[];const addFiche=async(key,d,sources,origin,a)=>{const file=a.target||'watch/technical-'+calls.length+'.md';fs.writeFileSync(path.join(root,file),'# Tool\n\n## Sources\n\n'+sources.join('\n'));calls.push({key,sources,a});return file;};
 const details=[{url:'https://github.com/Owner/Repo'},{url:'https://github.com/owner/repo/'},{url:'https://github.com/other/tool'},{url:'https://github.com/owner/repo/blob/main/README.md'}];
 const first=await publishTools(details,{root,targets,parent:'https://x.com/i/status/1',origin:'NotePlan',addFiche});assert.equal(first.created,2);assert.equal(first.duplicateReferences,1);
 const second=await publishTools(details.slice(0,1),{root,targets,parent:'https://x.com/i/status/2',origin:'NotePlan',addFiche});assert.equal(second.updated,1);assert.ok(calls[2].sources.includes('https://x.com/i/status/1'));assert.ok(calls[2].sources.includes('https://x.com/i/status/2'));assert.equal(repositoryKey('https://github.com/OWNER/Repo.git'),'https://github.com/owner/repo');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
