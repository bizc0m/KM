import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {crawlSource,analyzeCrawl,crawlKey} from './km-source-crawl.mjs';
import {classify,addFiche} from './km-technical-pipeline.mjs';
import {publishTools,toolTargets} from './km-tool-fiches.mjs';
const tweet=process.argv[2];if(!tweet)throw Error('tweet required');
const data=path.join(os.homedir(),'Library/Application Support/KM/pipeline');
const reportFile=path.join(data,'tweet-tools-report.json'),targets=await toolTargets(process.cwd());
let created=0,updated=0;const published=new Set();
const save=async(stage,report)=>fs.writeFile(reportFile,JSON.stringify({tweet,stage,created,updated,tools:[...published],report,at:new Date().toISOString()}),{mode:0o600});
const crawl=await crawlSource(tweet,{onProgress:r=>save('reading',r)});
await analyzeCrawl(crawl,classify,{onProgress:async part=>{
 const details=Object.entries(part.decisions).filter(([url,v])=>v.decision.decision==='technical'&&!published.has(url)).map(([url,v])=>({url,...v.decision}));
 const result=await publishTools(details,{root:process.cwd(),targets,parent:crawlKey(tweet),origin:'X',addFiche});
 created+=result.created;updated+=result.updated;for(const r of result.files)published.add(r.repository);
 if(result.files.length){execFileSync(process.execPath,['scripts/build-search-v1.12-html.mjs'],{stdio:'ignore'});execFileSync(process.execPath,['scripts/km-verify-placement.mjs'],{stdio:'ignore'});}
 await save('analyzing',part.report);
}});
await save('complete',crawl.report);
console.log(JSON.stringify({created,updated,tools:published.size}));
