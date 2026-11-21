import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import {readFileSync} from 'node:fs';
const repositoryAliases=JSON.parse(readFileSync(new URL('../km.repository-aliases.json',import.meta.url),'utf8'));
export const originalRepository=repo=>repositoryAliases[repo]||repo;
import path from 'node:path';
export function repositoryKey(value){try{const u=new URL(String(value).replace(/[`\])}.,;]+$/g,''));if(u.hostname.toLowerCase()!=='github.com')return null;const m=u.pathname.match(/^\/([^/]+)\/([^/]+)\/?$/);return m?originalRepository('https://github.com/'+m[1].toLowerCase()+'/'+m[2].replace(/\.git$/,'').toLowerCase()):null;}catch{return null;}}
export function ownedRepositories(text){
 const identity=text.match(/## Identité\n([\s\S]*?)(?=\n## |$)/)?.[1]||'';
 const explicit=repositoryKey(identity.match(/- Dépôt principal : (\S+)/)?.[1]);if(explicit)return [explicit];
 const sources=text.match(/https?:\/\/[^\s`<>\"']+/g)||[];
 const repos=[...new Set(sources.map(repositoryKey).filter(Boolean))];
 const sourceId=text.match(/- Identifiant source : ([a-f0-9]{64})/)?.[1];
 const bound=repos.filter(repo=>createHash('sha256').update(repo).digest('hex')===sourceId);if(bound.length===1)return bound;
 const title=(text.split('\n')[0]||'').toLowerCase().replace(/[^a-z0-9]/g,'');
 const owned=repos.filter(repo=>{const name=repo.split('/').pop().replace(/[^a-z0-9]/g,'');return name.length>=3&&title.includes(name);});
 return owned.length===1?owned:[];
}
export async function toolTargets(root){
 const targets=new Map();
 for(const name of await fs.readdir(path.join(root,'watch'))){if(!name.endsWith('.md')||name==='index.md')continue;const text=await fs.readFile(path.join(root,'watch',name),'utf8');for(const repo of ownedRepositories(text))if(!targets.has(repo))targets.set(repo,'watch/'+name);}
 return targets;
}
export async function publishTools(details,{root,origin,parent,addFiche,targets}){
 targets??=await toolTargets(root);const seen=new Set();const report={created:0,updated:0,duplicateReferences:0,files:[]};
 for(const d of details){const repo=repositoryKey(d.url);if(!repo)continue;if(seen.has(repo)){report.duplicateReferences++;continue;}seen.add(repo);
 const target=targets.get(repo);let prior=[],effectiveOrigin=origin;if(target){const t=await fs.readFile(path.join(root,target),'utf8');effectiveOrigin=t.match(/- Origine : (.+)/)?.[1] || origin;prior=(t.split('## Sources')[1]?.split('\n## ')[0]||'').match(/https?:\/\/\S+/g)||[];}
 const sources=[...new Set([repo,...prior,...(parent?[parent]:[])])];
 const file=await addFiche(repo,d,sources,effectiveOrigin,{target});targets.set(repo,file);report[target?'updated':'created']++;report.files.push({repository:repo,file});
 }return report;
}
