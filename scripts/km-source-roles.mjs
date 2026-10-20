import {repositoryKey,ownedRepositories} from './km-tool-fiches.mjs';
export function sourceKey(value){try{const u=new URL(value);u.hash='';u.username='';u.password='';u.hostname=u.hostname.toLowerCase().replace(/^www\./,'').replace(/^twitter.com$/,'x.com');for(const k of [...u.searchParams.keys()])if(/^(utm_.*|fbclid|gclid|yclid|mc_.*|mcp_token|token|auth|signature|expires)$/i.test(k))u.searchParams.delete(k);if(u.hostname==='github.com')u.pathname=u.pathname.toLowerCase();return u.href.replace(/\/$/,'');}catch{return String(value)}}
export function safeSource(value){try{const u=new URL(String(value).replace(/[)\].,;:]+$/,''));if(!['https:','http:'].includes(u.protocol)||u.username||u.password||/^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|\[|.*\.local$)/i.test(u.hostname)||/^172\.(1[6-9]|2\d|3[01])\./.test(u.hostname))return null;if([...u.searchParams.keys()].some(k=>/^(token|api[_-]?key|access[_-]?token|auth|signature|secret|password)$/i.test(k)))return null;return u.href;}catch{return null}}
export function sourceRoles(content){
 const identity=content.match(/\n## Identité\n([\s\S]*?)(?=\n## |$)/)?.[1]||'';
 const explicit=identity.match(/- Dépôt principal : (\S+)/)?.[1];
 const github=(explicit&&repositoryKey(explicit))||ownedRepositories(content)[0]||'';
 const official=safeSource(identity.match(/- Site officiel : (\S+)/)?.[1]||'');
 const sections=[...(content.match(/\n## Sources?\n([\s\S]*?)(?=\n## |$)/)?.[1]||'').matchAll(/https?:\/\/[^\s`<>"']+/g)].map(m=>m[0]);
 const remaining=[...content.matchAll(/https?:\/\/[^\s`<>"']+/g)].map(m=>m[0]);
 const seen=new Set(),sources=[];
 for(const value of [github,official,...sections,...remaining]){const url=safeSource(value);if(!url||/github\.com\/bizc0m\//i.test(url))continue;const key=sourceKey(url);if(seen.has(key))continue;seen.add(key);const u=new URL(url);const social=/^(x|twitter)\.com$/.test(u.hostname);const repo=repositoryKey(url);const kind=social?'social':repo||u.hostname==='github.com'?'github':'source';const role=repo&&repo===github?'primaryRepository':official&&sourceKey(official)===key?'officialSite':social?'originPost':/raw\.githubusercontent\.com|\/docs?\b|readme|model-card|arxiv\.org/i.test(url)?'documentation':'secondaryReference';sources.push({url,kind,role,label:role==='primaryRepository'?'GitHub':role==='officialSite'?'Site officiel':role==='originPost'?'Publication d’origine':role==='documentation'?'Documentation':'Référence'});}
 return {github,officialSite:official||'',sources};
}
