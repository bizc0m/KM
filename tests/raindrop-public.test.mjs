import test from 'node:test';
import assert from 'node:assert/strict';
import {collectPublicRaindrops} from '../scripts/km-raindrop-public.mjs';
test('public pagination fills beyond the first 30 without losing IDs',async()=>{
 const seenIds=new Set(Array.from({length:30},(_,i)=>String(i))),received=[];
 const result=await collectPublicRaindrops({collectionId:123,expected:120,seenIds,addItem:i=>received.push(i),fetch:async url=>{const page=Number(new URL(url).searchParams.get('page'));return {text:JSON.stringify({result:true,count:120,items:Array.from({length:Math.min(50,120-page*50)},(_,i)=>({_id:page*50+i}))})};}});
 assert.equal(seenIds.size,120);assert.equal(result.complete,true);assert.equal(result.pagesRead,3);assert.equal(received.length,120);
});
test('repeated pages fail explicitly while preserving references already read',async()=>{
 const seenIds=new Set();await assert.rejects(collectPublicRaindrops({collectionId:123,expected:2,seenIds,addItem:()=>{},fetch:async()=>({text:JSON.stringify({result:true,count:2,items:[{_id:1}]})})}),/pagination_stalled/);assert.equal(seenIds.size,1);
});
test('page limit leaves coverage incomplete',async()=>{
 const result=await collectPublicRaindrops({collectionId:123,expected:2,seenIds:new Set(),addItem:()=>{},maxPages:1,fetch:async()=>({text:JSON.stringify({result:true,count:2,items:[{_id:1}]})})});assert.equal(result.complete,false);
});
