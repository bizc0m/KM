import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {blocked,technicalSignal,canonical,publicAddress,safeUrl,validDecision} from '../scripts/km-technical-policy.mjs';
test('exclude adult and private content even when technical',()=>{
 for(const value of ['BDSM API software','NSFW github','sexual content Python','mon couple et mon serveur','mot de passe : secret'])assert.equal(blocked(value),true);
 assert.equal(technicalSignal('restaurant vacances'),false);
 assert.equal(technicalSignal('Documentation du SDK Python'),true);
 assert.equal(technicalSignal('Veille technique informatique : modèles de langage'),true);
});
test('dedup keeps meaningful URL parameters',()=>{
 assert.notEqual(canonical('https://example.com/watch?v=1'),canonical('https://example.com/watch?v=2'));
 assert.equal(canonical('https://example.com/a?utm_source=x&v=1#part'),'https://example.com/a?v=1');
 assert.equal(canonical('https://twitter.com/name/status/123'),'https://x.com/name/status/123');
 assert.equal(canonical('https://github.com/Owner/REPO.git'),'https://github.com/owner/repo');
 assert.equal(canonical('https://github.com/Owner/REPO/blob/Branch/README.md'),'https://github.com/owner/repo/blob/Branch/README.md');
 assert.throws(()=>canonical('https://user:password@example.com'));
});
test('deny internal network and metadata destinations',async()=>{
 for(const ip of ['127.0.0.1','10.0.0.1','169.254.169.254','192.168.1.2','100.90.189.76','::1','::ffff:127.0.0.1','fd00::1'])assert.equal(publicAddress(ip),false);
 for(const u of ['http://localhost','http://127.0.0.1','http://169.254.169.254','http://example.com:8767'])await assert.rejects(safeUrl(u));
});
test('model responses fail closed',()=>{
 const good={decision:'technical',personal:false,adult:false,title:'SDK Python',summary:'Un SDK fournit une API.',facts:['Le SDK utilise Python.'],risk:'ordinary'};
 assert.equal(validDecision(good,'Documentation SDK Python'),true);
 for(const bad of [{...good,personal:true},{...good,adult:true},{...good,decision:'review'},{...good,facts:[]},{...good,summary:'BDSM software'},{...good,summary:'Voir https://invented.example'},{...good,summary:'Contact user@example.org'},{...good,summary:'Appeler 06 12 34 56 78'},{...good,risk:'unknown'}])assert.equal(validDecision(bad,'Documentation SDK Python'),false);
 assert.equal(validDecision(good,'Vacances en famille'),false);
 assert.equal(validDecision(good,'BDSM API Python'),false);
});
test('NotePlan reader excludes private folders and exports no raw notes or filenames',()=>{
 const root=mkdtempSync(path.join(tmpdir(),'km-technical-reader-'));
 try{
  mkdirSync(path.join(root,'Notes','Technique'),{recursive:true});mkdirSync(path.join(root,'Notes','Perso'),{recursive:true});
  writeFileSync(path.join(root,'Notes','Technique','database.md'),'# SQLite Python\n\nLe logiciel SQLite expose une API Python pour les transactions.');
  writeFileSync(path.join(root,'Notes','Perso','intime.md'),'# Journal intime\n\nBDSM sexe Python API.');
  const r=spawnSync(process.execPath,[fileURLToPath(new URL('../scripts/km-noteplan-technical-read.mjs',import.meta.url))],{env:{...process.env,NOTEPLAN_ROOT:root},encoding:'utf8',timeout:10000});
  assert.equal(r.status,0,r.stderr);const d=JSON.parse(r.stdout);assert.equal(d.ok,true);assert.equal(d.notes.length,1);assert.equal(d.notes[0].allowText,true);
  assert.equal(/BDSM|intime\.md|database\.md|"body"|"path"/.test(r.stdout),false);
 }finally{rmSync(root,{recursive:true,force:true});}
});
