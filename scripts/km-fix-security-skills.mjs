import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
for(const name of await fs.readdir('watch')){
 if(!/^technical-.*\.md$/.test(name))continue;
 const file=path.join(root,'watch',name);let text=await fs.readFile(file,'utf8');
 if(!text.includes('https://github.com/mukul975/anthropic-cybersecurity-skills'))continue;
 text=text.replace(/^# .*/,'# Anthropic Cybersecurity Skills — bibliothèque communautaire');
 text=text.replace(/## Intérêts[\s\S]*?(?=\n## |$)/,'## Intérêts\n\nGuider les investigations de sécurité des agents avec des procédures MITRE et NIST.\n');
 await fs.writeFile(file,text);
 console.log(JSON.stringify({updated:'watch/'+name}));
}
