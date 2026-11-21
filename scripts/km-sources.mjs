import {readFile} from 'node:fs/promises';
import {publicFetch,blocked,canonical} from './km-technical-policy.mjs';
import {safeSource} from './km-source-roles.mjs';
export function parseSources(markdown){
 const parts=String(markdown).replace(/<!--[\s\S]*?-->/g,'').split(/^## /m).slice(1),rows=[],seen=new Set(),names=new Set();
 for(const part of parts){const lines=part.split('\n'),name=lines.shift().trim();const f={};for(const line of lines){const m=line.match(/^- ([^:]+)\s*:\s*(.*?)\s*$/);if(m){const k=m[1].trim().toLowerCase();if(!['type','url','actif','thèmes','périmètre'].includes(k))throw Error('Champ inconnu : '+k);if(k in f)throw Error('Champ répété : '+k);f[k]=m[2];}}
  const type=({rss:'rss',raindrop:'raindrop',noteplan:'noteplan'})[(f.type||'').toLowerCase()];if(!name||name.length>100||!type)throw Error('Chaque source doit avoir un nom et un type RSS, Raindrop ou NotePlan.');
  if(!['oui','non'].includes((f.actif||'').toLowerCase()))throw Error('Actif doit être oui ou non : '+name);
  if(names.has(name.toLowerCase()))throw Error('Nom de source dupliqué : '+name);names.add(name.toLowerCase());
  let url='';if(type!=='noteplan'){url=safeSource(f.url);if(!url)throw Error('URL publique HTTP(S) sans secret nécessaire : '+name);url=canonical(url);if(blocked(name+' '+url))throw Error('Source exclue par la politique technique.');}
  if(type==='noteplan'&&f.url)throw Error('NotePlan ne prend pas de champ URL.');
  if(type==='noteplan'&&f['périmètre']!=='Calendar')throw Error('NotePlan : seul Calendar est autorisé.');
  const key=type==='noteplan'?'noteplan':url;if(seen.has(key))throw Error('Source dupliquée : '+name);seen.add(key);
  rows.push({name,type,url,enabled:f.actif.toLowerCase()==='oui',themes:(f['thèmes']||'').split(',').map(s=>s.trim()).filter(Boolean)});
 }if(!rows.length)throw Error('Le fichier doit contenir au moins une source.');return rows;
}
export const loadSources=root=>readFile(root+'/sources.md','utf8').then(parseSources);
const decode=s=>String(s||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'");
const tag=(s,k)=>decode(s.match(new RegExp('<'+k+'(?:\\s[^>]*)?>([\\s\\S]*?)</'+k+'>','i'))?.[1]||'').trim();
export function parseFeed(xml,base){
 if(!/<(?:rss|feed|rdf:RDF)\b/i.test(xml)||/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('Flux RSS/Atom invalide ou déclaration XML non autorisée.');
 const nodes=[...xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)];const result=new Map();
 for(const [,kind,body] of nodes){let link=tag(body,'link');if(kind.toLowerCase()==='entry'){const links=[...body.matchAll(/<link\b([^>]*)\/?\s*>/gi)];const found=links.find(([,attrs])=>! /\brel\s*=/.test(attrs)||/\brel\s*=\s*["']alternate["']/i.test(attrs));link=decode(found?.[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1]||'');}
  try{const url=safeSource(new URL(link,base).href);if(!link||!url)continue;const title=tag(body,'title').replace(/<[^>]*>/g,'');if(blocked(title+' '+url))continue;result.set(canonical(url),{url,title});}catch{}
 }return [...result.values()];
}
export async function fetchFeed(url){const safe=safeSource(url);if(!safe)throw Error('URL publique requise');const r=await publicFetch(safe);const items=parseFeed(r.text,r.url||safe);return {items,count:items.length};}
