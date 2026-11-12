import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {planWriteback} from '../scripts/km-noteplan-writeback.mjs';
import {canonical} from '../scripts/km-technical-policy.mjs';
const key=u=>crypto.createHash('sha256').update(canonical(u)).digest('hex');
const done='https://example.org/sdk',pending='https://example.org/pending',file='watch/sdk.md';
const state={urls:{[key(done)]:{status:'done',fiche:file,crawl:{complete:true}},[key(pending)]:{status:'retry',fiche:file,crawl:{complete:false}}}};
const valid=new Set([file]);
test('mark only the completed item, preserving order, old markers, links and CRLF',()=>{
 const old='- [x] SDK précédent #km-fait [KM](https://bizc0m.github.io/KM/search-v2.html#fiche=watch-sdk)';
 const body=[old,'- [ ] API à reprendre '+pending,'- [ ] SDK terminé '+done,''].join('\r\n');
 const result=planWriteback(body,state,valid);
 assert.equal(result.content,[old,'- [ ] API à reprendre '+pending,'- [x] SDK terminé '+done+' #KM-OK',''].join('\r\n'));
 assert.equal(result.marked,1);assert.equal(result.moved,0);assert.equal(result.pending.length,1);
});
test('unfinished exploration never marks an item or rewrites unrelated content',()=>{
 const body='## SDK\n- [ ] API '+pending+'\n- [x] ancien #km-fait\n';
 assert.equal(planWriteback(body,state,valid).content,body);
});
test('parent task remains open while a child remains pending',()=>{
 const body='- [ ] SDK '+done+'\n  - [ ] API '+pending+'\n';
 const result=planWriteback(body,state,valid);assert.equal(result.content,body);assert.equal(result.marked,0);
});
