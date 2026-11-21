import path from 'node:path';
export const DAY=86400000;
export function cutoff(lastSuccess){const t=Date.parse(lastSuccess||'');return Number.isFinite(t)?t-DAY:null;}
export function noteDay(file){const m=path.basename(file).match(/^(\d{4})-?(\d{2})-?(\d{2})\.(?:md|txt)$/);return m?Date.parse(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`):NaN;}
export function inWindow(file,mtime,lastSuccess,pending=false){const from=cutoff(lastSuccess);return pending||from===null||mtime>=from||noteDay(file)>=from;}
