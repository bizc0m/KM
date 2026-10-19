import dns from 'node:dns/promises';
import net from 'node:net';
import http from 'node:http';
import https from 'node:https';

export const POLICY_VERSION = 'technical-only-2026-10-17';
const excluded = /\b(bdsm|bondage|fetish\w*|fétich\w*|porn\w*|nsfw|onlyfans|sexual\w*|sexuel\w*|sexe|eroti\w*|éroti\w*|nudes?|hentai|sadomaso\w*|dominatrix|orgasm\w*|masturb\w*|sodom\w*)\b/i;
const privateText = /\b(ma vie|vie privée|vie privee|journal intime|mes sentiments|ma relation|mon couple|mon adresse|mon téléphone|mon telephone|my diary|my relationship|mot de passe|password\s*[:=]|api[_ -]?key\s*[:=]|bearer\s+[a-z0-9_-]{12})\b/i;
const technical = /\b(github|gitlab|codeberg|huggingface|software|logiciel|développe\w*|developpe\w*|programm\w*|coding|code|api|sdk|cli|llm|mcp|agent\w*|framework|python|javascript|typescript|rust|golang|docker|kubernetes|linux|macos|swift|database|sql|postgres|sqlite|réseau|reseau|network|server|serveur|cybersecurity|sécurité informatique|securite informatique|machine learning|open.source|automation|automatisation|workflow|noteplan|obsidian|encryption|chiffrement|computer|react|svg|osint|qwen|deepseek|benchmarks|hister|algorithm\w*|benchmark|webassembly)\b/i;
export function blocked(text) { return excluded.test(String(text)) || privateText.test(String(text)) || /(?:^|[/\\])(?:perso|personnel|personnelle|private|intime)(?:[/\\]|$)/i.test(String(text)); }
export function technicalSignal(text) { return (technical.test(String(text)) || /\b(informatique|intelligence artificielle|mod[eè]les? de langage|apprentissage automatique)\b/i.test(String(text))) && !blocked(text); }
export function canonical(value) {
  const u = new URL(value);
  if (u.username || u.password || !['http:', 'https:'].includes(u.protocol)) throw new Error('url_rejected');
  u.hash = '';
  for (const k of [...u.searchParams.keys()]) if (/^utm_/i.test(k) || /^(fbclid|gclid|mc_cid|mc_eid)$/i.test(k)) u.searchParams.delete(k);
  u.searchParams.sort();
  u.hostname = u.hostname.toLowerCase().replace(/^www\./, '').replace(/^twitter\.com$/, 'x.com');
  if(u.hostname==='github.com'){
    const parts=u.pathname.split('/');
    if(parts[1])parts[1]=parts[1].toLowerCase();
    if(parts[2])parts[2]=parts[2].replace(/\.git$/i,'').toLowerCase();
    u.pathname=parts.join('/');
  }
  return u.toString().replace(/\/$/, '');
}
export function publicAddress(address) {
  if (net.isIP(address) === 4) {
    const [a,b] = address.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && [0,168].includes(b)) || (a === 100 && b >= 64 && b <= 127) || (a === 198 && [18,19,51].includes(b)) || (a === 203 && b === 0));
  }
  if (net.isIP(address) === 6) return /^2[0-9a-f]{3}:/i.test(address) && !/^2001:(db8|0:|10:|20:)/i.test(address);
  return false;
}
export function transportUrl(value) {
  canonical(value); // Validate credentials and scheme, without rewriting the actual request.
  const u=new URL(value);u.hash='';return u;
}
export async function safeUrl(value) {
  const u = transportUrl(value);
  if (u.port && !['80','443'].includes(u.port)) throw new Error('port_rejected');
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (/localhost|\.local$|\.lan$|\.ts\.net$/i.test(host)) throw new Error('host_rejected');
  const addresses = await dns.lookup(host, {all:true});
  if (!addresses.length || addresses.some(a => !publicAddress(a.address))) throw new Error('address_rejected');
  u.validatedAddresses=addresses.sort((a,b)=>a.family-b.family);
  return u;
}
export async function publicFetch(url) {
  for (let n=0; n<5; n++) {
    const u = await safeUrl(url);
    // Pin the vetted address for this request; do not resolve the host a second time.
    const r=await new Promise((resolve,reject)=>{
      const request=(u.protocol==='https:'?https:http).request(u,{method:'GET',autoSelectFamily:false,lookup:(_host,options,callback)=>{const a=u.validatedAddresses[0];if(options.all)callback(null,[a]);else callback(null,a.address,a.family);},signal:AbortSignal.timeout(20000),headers:{'User-Agent':'KM-Technical-Monitor/2.0',Accept:'text/html,application/json,application/xml,text/plain;q=0.9,*/*;q=0.1','Accept-Encoding':'identity'}},response=>{
        const status=response.statusCode;const type=response.headers['content-type'] || '';
        if([301,302,303,307,308].includes(status)){response.resume();resolve({status,location:response.headers.location});return;}
        if(status<200 || status>=300){response.resume();reject(new Error(`http_${status}`));return;}
        if(!/text\/|json|xml|html/.test(type)){response.resume();reject(new Error('content_type_unsupported'));return;}
        const chunks=[];let size=0;
        response.on('data',c=>{size+=c.length;if(size>1500000)request.destroy(new Error('response_too_large'));else chunks.push(c);});
        response.on('error',reject);response.on('end',()=>resolve({status,type,text:Buffer.concat(chunks).toString('utf8')}));
      });request.on('error',reject);request.end();
    });
    if([301,302,303,307,308].includes(r.status)){if(!r.location)throw new Error('redirect_invalid');url=new URL(r.location,u).href;continue;}
    return {url:u.href,text:r.text,type:r.type};
  }
  throw new Error('too_many_redirects');
}
export function validDecision(d, evidence) {
  if (!d || d.decision !== 'technical' || d.personal !== false || d.adult !== false) return false;
  if (typeof d.title !== 'string' || typeof d.summary !== 'string' || !Array.isArray(d.facts) || !d.facts.length) return false;
  if (d.utility !== undefined && (typeof d.utility !== 'string' || d.utility.length>1000)) return false;
  for(const key of ['usage','limitations']) if(d[key] !== undefined && (!Array.isArray(d[key]) || d[key].some(v=>typeof v!=='string' || v.length>600)))return false;
  const output=[d.title,d.summary,...d.facts,d.utility || '',...(d.usage || []),...(d.limitations || [])].join(' ');
  const privateOutput=/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\/Users\/|\b(?:\+?33[ .-]?[1-9]|0[1-9])(?:[ .-]?\d{2}){4}\b|\bsk-[a-z0-9_-]{12,}/i.test(output);
  return !privateOutput && ['ordinary','dual-use'].includes(d.risk) && !blocked(output) && technicalSignal(evidence) && !blocked(evidence) && d.title.length <= 160 && d.summary.length <= 1000 && d.facts.every(f=>typeof f==='string' && f.length<=600) && !/https?:\/\//.test(output);
}
