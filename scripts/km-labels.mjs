import {readFileSync} from 'node:fs';
export const labelRules=JSON.parse(readFileSync(new URL('../km.labels.json',import.meta.url),'utf8'));
const key=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/^#/,'').replace(/’/g,"'").trim();
const labels=new Map(labelRules.flatMap(r=>r.keys.map(k=>[key(k),r])));
export function labelInfo(value){const rule=labels.get(key(value));return rule?{short:rule.short,full:rule.full}:{short:String(value||''),full:String(value||'')};}
export function keywordIdentity(value){const k=key(value);return ({stt:'transcription',tts:'synthese-vocale',images:'generation-images',cyber:'cybersecurity'})[k]||k;}
