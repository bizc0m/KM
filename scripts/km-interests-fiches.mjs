import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const backup=path.join(os.homedir(),'Library/Application Support/KM/backups','interests-'+Date.now());
await fs.mkdir(backup,{recursive:true,mode:0o700});let changed=0;
for(const n of await fs.readdir('watch')){
 if(!/^technical-.*\.md$/.test(n))continue;
 const p='watch/'+n,t=await fs.readFile(p,'utf8');
 const m=t.match(/## Résumé\n\n([\s\S]*?)(?=\n## |$)/);if(!m)continue;
 const first=m[1].split('\n')[0];
 let interest=first.split(/permettant de |permet de |conçu pour |conçue pour |pour /i).slice(1).join(' pour ');
 if(!interest)interest=first.replace(/^.*?\b(?:est|sont)\s+(?:un|une|des)\s+/i,'');
 interest=interest.replace(/\b(?:un outil|une plateforme|un logiciel|un projet|open source|open-source|gratuit|avancé|avancées)\b/gi,'').replace(/\s+/g,' ').trim();
 interest=interest.split(/[.!?]\s/)[0];
 const words=interest.split(' ');if(words.length>18)interest=words.slice(0,18).join(' ').replace(/[,;:]$/,'')+'…';
 interest=interest.charAt(0).toUpperCase()+interest.slice(1);
 await fs.writeFile(path.join(backup,n),t,{mode:0o600});
 await fs.writeFile(p,t.replace(m[0],'## Intérêts\n\n'+interest+'\n'),{mode:0o600});changed++;
}console.log(JSON.stringify({changed,backup}));
