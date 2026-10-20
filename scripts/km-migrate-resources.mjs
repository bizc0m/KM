import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {resourceMetadata,resourceMarkdown} from './km-resource-metadata.mjs';
import {ownedRepositories} from './km-tool-fiches.mjs';
const root=process.env.KM_ROOT||process.cwd();
const verified=process.argv[2]?JSON.parse(await fs.readFile(process.argv[2],'utf8')):{};
const backup=path.join(os.homedir(),'Library/Application Support/KM/backups/resources-'+Date.now());let changed=0,licenses=0;
for(const folder of ['watch','resources','books'])for(const name of await fs.readdir(path.join(root,folder))){
 if(!name.endsWith('.md')||name==='index.md')continue;
 const file=path.join(folder,name),text=await fs.readFile(path.join(root,file),'utf8');
 const repo=ownedRepositories(text)[0],facts=verified[repo]||{};const metadata=resourceMetadata(text,facts);if(facts.license)licenses++;
 const base=text.replace(/\n## Métadonnées[\s\S]*?(?=\n## |$)/,'');
 const updated=base.includes('\n## Sources')?base.replace('\n## Sources','\n'+resourceMarkdown(metadata)+'## Sources'):base.trimEnd()+'\n\n'+resourceMarkdown(metadata);
 if(updated!==text){await fs.mkdir(path.dirname(path.join(backup,file)),{recursive:true});await fs.writeFile(path.join(backup,file),text,{mode:0o600});await fs.writeFile(path.join(root,file),updated);changed++;}
}
console.log(JSON.stringify({changed,licenses,backup}));
