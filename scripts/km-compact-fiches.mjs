import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const backup=path.join(os.homedir(),'Library/Application Support/KM/backups','two-lines-'+Date.now());
await fs.mkdir(backup,{recursive:true,mode:0o700});let changed=0;
const section=(t,name)=>t.match(new RegExp('## '+name+'\\n\\n([\\s\\S]*?)(?=\\n## |$)'))?.[1].trim();
for(const n of await fs.readdir('watch')){
 if(!/^technical-.*\.md$/.test(n))continue;
 const p='watch/'+n,t=await fs.readFile(p,'utf8');
 const first=section(t,'Ce que ça fait') || section(t,'Résumé');
 const second=section(t,'À quoi ça sert') || (section(t,'Faits relevés dans la source') || section(t,'Faits vérifiés dans la source'))?.split('\n').find(x=>x.startsWith('- '))?.slice(2);
 if(!first || !second)continue;
 await fs.writeFile(path.join(backup,n),t,{mode:0o600});
 const start=t.search(/## (?:Ce que ça fait|Résumé)\n/),end=t.indexOf('## Sources',start);
 if(end<0)continue;
 const one=x=>x.replace(/\s+/g,' ').trim();
 await fs.writeFile(p,t.slice(0,start)+'## Résumé\n\n'+one(first)+'  \n'+one(second)+'\n\n'+t.slice(end),{mode:0o600});changed++;
}
console.log(JSON.stringify({changed,backup}));
