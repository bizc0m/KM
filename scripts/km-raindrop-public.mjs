import {publicFetch} from './km-technical-policy.mjs';
// Endpoint used by https://github.com/raindropio/pages/blob/master/src/api/raindrops/get.js.
// Only call with an ID discovered in an enabled, publicly readable collection page.
export async function collectPublicRaindrops({collectionId,expected,seenIds,addItem,fetch=publicFetch,maxPages=100}){
 if(!/^\d+$/.test(String(collectionId)))throw new Error('invalid_public_collection_id');
 let pagesRead=0,total=expected;
 for(let page=0;page<maxPages&&seenIds.size<total;page++){
  const url=new URL('https://api.raindrop.io/v2/raindrops/'+collectionId);
  for(const [k,v] of Object.entries({version:2,nested:true,perpage:50,page}))url.searchParams.set(k,String(v));
  const data=JSON.parse((await fetch(url.href)).text);
  if(data.result!==true||!Array.isArray(data.items))throw new Error('invalid_public_collection_page');
  total=Math.max(total,Number(data.count)||0);const before=seenIds.size;pagesRead++;
  for(const item of data.items){if(item._id==null)continue;seenIds.add(String(item._id));addItem(item);}
  if(seenIds.size===before&&seenIds.size<total)throw new Error('public_collection_pagination_stalled');
 }
 return {pagesRead,expected:total,complete:seenIds.size>=total};
}
