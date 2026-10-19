import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {toolTargets} from './km-tool-fiches.mjs';
const root=process.env.KM_ROOT || process.cwd(),base=process.env.KM_PIPELINE_DATA || path.join(os.homedir(),'Library/Application Support/KM/pipeline');
const read=async n=>{try{return JSON.parse(await fs.readFile(path.join(base,n),'utf8'))}catch{return {}}};
const state=await read('state.json'),progress=await read('progress.json');
let total=0,noteplan=0,review=0;for(const n of await fs.readdir(path.join(root,'watch'))){if(!/^technical-.*\.md$/.test(n))continue;total++;const t=await fs.readFile(path.join(root,'watch',n),'utf8');if(t.includes('Origine : NotePlan'))noteplan++;if(/## Intérêts\n\nIntérêt à vérifier/.test(t))review++;}
const urls=Object.values(state.urls || {}),notes=Object.values(state.notes || {}),counts={};for(const v of urls)counts[v.status]=(counts[v.status] || 0)+1;
console.log(JSON.stringify({at:new Date().toISOString(),calendarNotesRead:progress.noteplan?.scanned ?? null,scanStartedAt:progress.startedAt,generatedFiches:total,noteplanFiches:noteplan,uniqueIdentifiedRepositories:(await toolTargets(root)).size,interestsToReview:review,urlStates:counts,notesWithRecordedFiches:notes.filter(n=>n.fiches?.length || n.fiche?.endsWith?.('.md')).length,noteAttributionCoverage:'partial: historical URL-derived fiches were not attributed to individual Calendar notes',noteLinkReconciliation:state.noteLinkReconciliation || null,currentBatch:{created:progress.created,updated:progress.updated,failures:progress.failures},targetedTweet:await read('tweet-tools-report.json')}));
