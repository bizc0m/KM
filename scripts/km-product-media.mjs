import {canonical,blocked,publicFetch} from './km-technical-policy.mjs';
export function productImages(text,base){
 const candidates=[...text.matchAll(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+"[^"]*")?\)|<img\b[^>]*>/gi)],out=[];
 for(const m of candidates){const tag=m[0],alt=m[1]||tag.match(/alt=["']([^"']*)/i)?.[1]||'Aperçu du produit';let url=m[2]||tag.match(/src=["']([^"']*)/i)?.[1];if(!url||/badge|shield|logo|avatar|icon|sponsor|stars|license|visitor|github-contribution/i.test(alt+' '+url))continue;
 try{const u=new URL(url,base);if(u.hostname==='github.com')u.pathname=u.pathname.replace('/blob/','/raw/');url=canonical(u.href);if(!url||blocked(alt+' '+url)||!/^https:\/\//.test(url)||!(/screenshot|screen-shot|preview|demo|interface|capture/i.test(alt+' '+url)))continue;if(!out.some(x=>x.url===url))out.push({url,alt,source:base});}catch{}if(out.length===2)break;}
 return out;
}
export async function findProductImages(url){let target=url;try{const u=new URL(url);if(u.hostname==='github.com'){const bits=u.pathname.split('/').filter(Boolean);if(bits.length===2)target='https://raw.githubusercontent.com/'+bits.join('/')+'/HEAD/README.md';}const page=await publicFetch(target);return productImages(page.text,page.url);}catch{return [];}}
