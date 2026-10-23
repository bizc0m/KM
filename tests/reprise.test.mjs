import {createHash} from 'node:crypto';
import test from 'node:test';import assert from 'node:assert/strict';
import {sourceRoles,sourceKey,safeSource} from '../scripts/km-source-roles.mjs';
import {correctedResource} from '../scripts/km-verified-resources.mjs';
import {ownedRepositories} from '../scripts/km-tool-fiches.mjs';
import {detailParts} from '../scripts/km-detail-content.mjs';
test('all source references survive beyond eight and raw files are never official sites',()=>{
 const urls=Array.from({length:30},(_,i)=>'https://example.org/Ref'+i);const content='# Tool\n\n## Sources\n\n'+urls.join('\n')+'\nhttps://raw.githubusercontent.com/a/b/main/README.md';const result=sourceRoles(content);assert.equal(result.sources.length,31);assert.equal(result.officialSite,'');assert.equal(result.sources.at(-1).role,'documentation');
 assert.notEqual(sourceKey(urls[0]),sourceKey(urls[0].toLowerCase()));assert.equal(sourceKey('https://example.org/Ref0?utm_source=x'),urls[0]);assert.equal(safeSource('http://10.0.0.1/'),null);assert.equal(safeSource('https://example.org/?token=secret'),null);
});
test('inventories do not inherit first linked repositories; primary identity is explicit or matched',()=>{
 assert.deepEqual(ownedRepositories('# AI Tools Inventory\n## Sources\nhttps://github.com/calcom/cal.diy'),[]);
 assert.deepEqual(ownedRepositories('# n8n Workflow Automation\n## Sources\nhttps://github.com/n8n-io/n8n'),['https://github.com/n8n-io/n8n']);
 const c='# Other title\n## Identité\n- Dépôt principal : https://github.com/a/project\n- Site officiel : https://project.example/\n## Sources\nhttps://github.com/b/reference';assert.equal(sourceRoles(c).github,'https://github.com/a/project');assert.equal(sourceRoles(c).officialSite,'https://project.example/');
});
test('verified corrections reset wrong classes without throwing away sources or technical records',()=>{
 const c='# Gestion d’émulateurs via MiniSim\n\n## Tags\n#identification-audio\n\n## Sources\nhttps://github.com/okwasniewski/MiniSim\nhttps://x.com/i/status/123\n\n## Traçabilité\n- Origine : NotePlan\n';const fixed=correctedResource(c);assert.match(fixed,/^# MiniSim/);assert.ok(!fixed.includes('#identification-audio'));assert.match(fixed,/domain.dev.testing/);assert.match(fixed,/https:\/\/x.com\/i\/status\/123/);assert.match(fixed,/Origine : NotePlan/);assert.equal(correctedResource(fixed),fixed);
});
test('detail has one identity and keeps technical information apart from the useful body',()=>{
 const r=detailParts('# Whisper\n\n## Tags\n#transcription\n\n## Intérêts\nTranscrire\n\n## Limites\nContrainte établie\n\n## Sources\nhttps://example.org\n\n## Traçabilité\nHash\n\n## Exploration des liens\nEnquête');assert.match(r.body,/Contrainte établie/);assert.ok(!r.body.includes('# Whisper'));assert.ok(!r.body.includes('Hash'));assert.match(r.technical,/Hash/);assert.match(r.technical,/Enquête/);
});

test('source identity hash binds an ambiguous title to the repository actually processed',()=>{
 const repo='https://github.com/owner/project',id=createHash('sha256').update(repo).digest('hex');
 const c='# Generic translated resource title\n\n## Sources\n'+repo+'\nhttps://github.com/other/dependency\n\n## Traçabilité\n- Identifiant source : '+id;
 assert.deepEqual(ownedRepositories(c),[repo]);
});
test('public subject catalog inherits membership once and machine index omits raw traces',async()=>{
 const fs=await import('node:fs/promises'),os=await import('node:os'),path=await import('node:path');const {buildCatalog}=await import('../scripts/km-public-catalog.mjs');const root=await fs.mkdtemp(path.join(os.tmpdir(),'km-catalog-'));
 try{const row={id:'one',title:'<Tool>',path:'watch/tool.md',cardInterest:'Analyser un document',raw:'private trace',detail:{technical:'private trace'},classification:{facets:{domain:['domain.ai.agents','domain.ai']}}};
 buildCatalog(root,[row],{concepts:[{id:'domain'},{id:'domain.ai',parent:'domain',label:'IA'},{id:'domain.ai.agents',parent:'domain.ai',label:'Agents'}]});
 const parent=await fs.readFile(path.join(root,'public/catalog/domain-ai.html'),'utf8');assert.match(parent,/1 fiches/);assert.equal((parent.match(/<article>/g)||[]).length,1);assert.match(parent,/&lt;Tool&gt;/);const index=JSON.parse(await fs.readFile(path.join(root,'public/index.json')));assert.equal(index.count,1);assert.equal(index.rows[0].raw,undefined);assert.equal(index.rows[0].detail,undefined);
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
