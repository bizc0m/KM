import {canonical,publicFetch,blocked,technicalSignal,validDecision} from './km-technical-policy.mjs';
import crypto from 'node:crypto';
export const CRAWL_VERSION='depth3-per-tool-v2';
export const CRAWL_DEFAULTS={maxDepth:3,maxPages:120,maxElapsedMs:180000};
let githubApiAvailable=true;
export function crawlKey(value){const u=new URL(canonical(value));const id=/^(x\.com)$/.test(u.hostname)&&u.pathname.match(/\/status\/(\d+)/)?.[1];if(id)return `https://x.com/i/status/${id}`;return u.href.replace(/\/$/,'');}
export function sourceLinks(text,base,html=false){
 const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
 let body=html?text:text.replace(/!\[[^\]]*\]\([^)]*\)/g,'');
 if(html){body=body.replace(/<(script|style|nav|header|footer|aside)\b[^>]*>[\s\S]*?<\/\1>/gi,' ');body=body.match(/<(?:main|article)\b[^>]*>([\s\S]*?)<\/(?:main|article)>/i)?.[1] || body;}
 const raw=html?[...body.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]):[...body.matchAll(/https?:\/\/[^\s<>"'\[\]]+|\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map(m=>m[1]||m[0]);
 const found=new Map();for(let value of raw){value=decode(value).replace(/[.,;!}`]+$/g,'');if(value.startsWith('#'))continue;try{const u=new URL(value,base);if(!['http:','https:'].includes(u.protocol))continue;const k=crawlKey(u.href);if(!found.has(k))found.set(k,u.href);}catch{}}
 return [...found.values()];
}
function plain(s){return s.replace(/<(script|style|nav|header|footer|aside)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();}
export async function loadPublicPage(url,{fetch=publicFetch}={}){
 const u=new URL(url);const tweet=/^(x\.com|twitter\.com)$/.test(u.hostname)&&u.pathname.match(/\/status\/(\d+)/)?.[1];
 if(tweet){
  const j=JSON.parse((await fetch(`https://api.fxtwitter.com/status/${tweet}`)).text);const t=j.tweet;if(!t || !(t.text || t.article))throw new Error('x_content_unavailable');
  const links=[...sourceLinks(t.text || '',url),...(t.urls||[]).map(x=>x.expanded_url||x.url),...(t.raw_text?.facets||[]).flatMap(x=>[x.replacement,...(x.features||[]).map(f=>f.url)])].filter(Boolean);
  const quote=t.quote || t.quoted_tweet;if(quote?.id)links.push(`https://x.com/i/status/${quote.id}`);
  const articles=[t.article,quote?.article].filter(Boolean);
  const blocks=articles.flatMap(a=>a.content?.blocks || a.content_state?.blocks || a.blocks || []);
  const article=blocks.map(b=>b.text||'').join('\n');
  links.push(...sourceLinks(article,url));
  return {url:crawlKey(url),text:[t.text,article].filter(Boolean).join('\n\n'),links:[...new Set(links)]};
 }
 if(u.hostname==='github.com'&&/^\/[^/]+\/[^/]+\/?$/.test(u.pathname)){
  const repo=u.pathname.replace(/^\/|\/$/g,'');let meta={full_name:repo,default_branch:'HEAD'},metadataOk=false,readme='';
  if(githubApiAvailable){try{meta=JSON.parse((await fetch(`https://api.github.com/repos/${repo}`)).text);metadataOk=true;}catch(e){if(/^http_(403|429)$/.test(e.message))githubApiAvailable=false;}}
  const base=`https://raw.githubusercontent.com/${meta.full_name || repo}/${meta.default_branch || 'HEAD'}/`;
  for(const filename of ['README.md','readme.md','README.rst']){try{readme=(await fetch(base+filename)).text;if(readme)break;}catch{}}
  if(!readme&&githubApiAvailable){try{const r=JSON.parse((await fetch(`https://api.github.com/repos/${repo}/readme`)).text);readme=Buffer.from(r.content||'','base64').toString('utf8');}catch(e){if(/^http_(403|429)$/.test(e.message))githubApiAvailable=false;}}
  if(!metadataOk&&!readme)throw new Error('github_content_unavailable');
  return {url:u.href,text:`Dépôt GitHub ${meta.full_name || repo}. ${meta.description||''}\n${readme}`,links:sourceLinks(readme,base),partial:!readme};
 }
 const r=await fetch(url);const final=new URL(r.url);
 if(crawlKey(r.url)!==crawlKey(url) && (/^(x\.com|twitter\.com)$/.test(final.hostname)&&final.pathname.includes('/status/') || final.hostname==='github.com'&&/^\/[^/]+\/[^/]+\/?$/.test(final.pathname)))return loadPublicPage(r.url,{fetch});
 const html=/html/i.test(r.type);return {url:r.url,text:html?plain(r.text):r.text,links:sourceLinks(r.text,r.url,html)};
}
function rejectUrl(url){try{const u=new URL(url);if(blocked(u.href))return 'excluded';if([...u.searchParams.keys()].some(k=>/^(access_token|api_key|password|secret|token)$/i.test(k)))return 'excluded';if(/\.(png|jpe?g|gif|webp|svg|ico|mp4|mov|mp3|zip|exe|dmg|pkg)(?:$|\?)/i.test(u.pathname))return 'unsupported';if(/^(x\.com|twitter\.com)$/.test(u.hostname)&&!u.pathname.includes('/status/'))return 'navigation';if(/\/(?:login|signin|signup|logout|privacy|terms|contact)(?:\/|$)/i.test(u.pathname))return 'navigation';}catch{return 'invalid';}return null;}
export async function crawlSource(start,{fetchPage=loadPublicPage,onProgress=async()=>{},...options}={}){
 const limits={...CRAWL_DEFAULTS,...options};const began=Date.now(),nodes=new Map(),aliases=new Set(),queue=[];let fetched=0;
 function enqueue(url,depth,parent){let key;try{key=crawlKey(url);}catch{return;}if(nodes.has(key))return;const rejection=rejectUrl(url);const node={url:key,depth,parent,status:rejection || (depth>limits.maxDepth?'depth_limit':'queued')};if(rejection==='excluded'){node.url=undefined;node.excluded=true;}nodes.set(key,node);if(node.status==='queued')queue.push({key,url});}
 enqueue(start,0,null);
 while(queue.length){const {key,url}=queue.shift(),node=nodes.get(key);
  if(fetched>=limits.maxPages){node.status='page_limit';continue;}
  if(Date.now()-began>=limits.maxElapsedMs){node.status='time_limit';continue;}
  try{
   fetched++;const page=await fetchPage(url);let finalKey;try{finalKey=crawlKey(page.url || url);}catch{finalKey=key;}
   if(aliases.has(finalKey)){node.status='duplicate';continue;}aliases.add(finalKey);node.url=finalKey;
   if(blocked(page.text)){node.status='excluded';node.url=undefined;if(node.depth===0)queue.length=0;continue;}
   if(node.depth>0&&!technicalSignal(page.text)&&!(page.links||[]).some(u=>technicalSignal(u))){node.status='nontechnical';continue;}
   node.status='read';node.text=page.text;node.partial=Boolean(page.partial);node.analysis='pending';
   for(const link of page.links || [])enqueue(link,node.depth+1,key);
  }catch(e){node.status='error';node.reason=/^(http_\d+|x_content_unavailable|address_rejected|host_rejected|port_rejected|content_type_unsupported|response_too_large)$/.test(e.message)?e.message:'unavailable';}
  await onProgress(summarizeCrawl([...nodes.values()],limits));
 }
 const rows=[...nodes.values()];const report=summarizeCrawl(rows,limits);
 return {version:CRAWL_VERSION,limits,nodes:rows,report,blocked:rows[0]?.status==='excluded'};
}
export function summarizeCrawl(nodes,limits=CRAWL_DEFAULTS){
 const count=s=>nodes.filter(n=>n.status===s).length;
 const pending=nodes.filter(n=>['depth_limit','page_limit','time_limit','error'].includes(n.status)).length;
 return {version:CRAWL_VERSION,maxDepth:limits.maxDepth,maxPages:limits.maxPages,found:Math.max(0,nodes.length-1),read:count('read'),technical:nodes.filter(n=>n.analysis==='technical').length,review:nodes.filter(n=>n.analysis==='review').length,analysisErrors:nodes.filter(n=>n.analysis==='error').length,analysisPending:nodes.filter(n=>n.status==='read'&&n.analysis==='pending').length,excerpted:nodes.filter(n=>n.excerpted).length,unread:pending,excluded:count('excluded')+count('nontechnical')+count('navigation')+count('unsupported')+count('invalid')+nodes.filter(n=>n.analysis==='ignored').length,duplicates:count('duplicate'),depthLimited:count('depth_limit'),pageLimited:count('page_limit'),timeLimited:count('time_limit'),errors:count('error'),complete:pending===0&&!nodes.some(n=>n.partial||n.status==='read'&&['pending','review','error'].includes(n.analysis))};
}
export async function analyzeCrawl(crawl,classify,{cache={},onProgress=async()=>{}}={}){
 const decisions={};
 for(const node of crawl.nodes){
  if(node.status!=='read')continue;
  const digest=crypto.createHash('sha256').update(node.text).digest('hex');
  const evidence=node.text.slice(0,18000);node.excerpted=node.text.length>18000;
  try{
   const previous=cache[node.url];const d=previous?.digest===digest&&previous?.decision?.decision!=='review'?previous.decision:await classify(evidence);
   if(d.decision==='ignore')node.analysis='ignored';
   else if(validDecision(d,evidence))node.analysis='technical';
   else node.analysis='review';
   // Persist only validated technical summaries, or a content-free rejected decision.
   decisions[node.url]={digest,decision:node.analysis==='technical'?d:{decision:node.analysis==='ignored'?'ignore':'review'}};
  }catch{node.analysis='error';}
  crawl.report=summarizeCrawl(crawl.nodes,crawl.limits);
  await onProgress({decisions,nodes:crawl.nodes.map(({text,...n})=>n),report:crawl.report});
 }
 crawl.report=summarizeCrawl(crawl.nodes,crawl.limits);
 const details=crawl.nodes.filter(n=>n.analysis==='technical').map(n=>({url:n.url,depth:n.depth,...decisions[n.url].decision}));
 return {details,decisions,report:crawl.report,nodes:crawl.nodes.map(({text,...n})=>n)};
}
