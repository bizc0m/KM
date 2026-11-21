import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function buildCatalog(root,rows,ontology){
 const dir=join(root,'public/catalog');mkdirSync(dir,{recursive:true});
 const concepts=ontology.concepts||[],byId=new Map(concepts.map(c=>[c.id,c]));
 const within=(id,parent)=>{let c=byId.get(id);const seen=new Set();while(c&&!seen.has(c.id)){if(c.id===parent)return true;seen.add(c.id);c=byId.get(c.parent);}return false;};
 const domains=concepts.filter(c=>c.id.startsWith('domain.')&&c.id!=='domain.unclassified');
 const groups=domains.map(c=>({...c,rows:rows.filter(r=>(r.classification?.facets?.domain||[]).some(id=>within(id,c.id)))})).filter(c=>c.rows.length);
 const url=c=>c.id.replaceAll('.','-')+'.html';
 const style='<style>body{font:16px system-ui;margin:24px auto;padding:0 20px;max-width:1000px;background:#fbfaf6;color:#151515}a{color:#145c92}li{margin:12px 0}input{font:inherit;padding:10px;width:90%}article{background:white;border:1px solid #d8d3c8;padding:14px;margin:12px 0}h2{font-size:20px}small{color:#64615b}</style>';
 const shell=(title,body)=>'<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title>'+style+'<nav><a href="../../search-v2.html">Recherche</a> · <a href="index.html">Index des sujets</a> · <a href="index.md">Index Markdown</a></nav><h1>'+esc(title)+'</h1>'+body+'</html>';
 const links=groups.map(c=>'<li><a href="'+url(c)+'">'+esc(c.label)+'</a> · '+c.rows.length+'</li>');
 const roots=groups.filter(c=>c.parent==='domain');
 writeFileSync(join(dir,'index.html'),shell('Sujets KM','<ul>'+roots.map(c=>'<li><a href="'+url(c)+'">'+esc(c.label)+'</a> · '+c.rows.length+'<ul>'+groups.filter(x=>x.parent===c.id).map(x=>'<li><a href="'+url(x)+'">'+esc(x.label)+'</a> · '+x.rows.length+'</li>').join('')+'</ul></li>').join('')+'</ul>'));
 writeFileSync(join(dir,'index.md'),'# Index des sujets KM\n\n'+groups.map(c=>'- ['+c.label+']('+url(c).replace('.html','.md')+') — '+c.rows.length+' fiches').join('\n')+'\n');
 for(const c of groups){const children=groups.filter(x=>x.parent===c.id);writeFileSync(join(dir,url(c)),shell(c.label,'<p>'+c.rows.length+' fiches · <a href="'+url(c).replace('.html','.md')+'">Version Markdown</a></p><ul>'+children.map(x=>'<li><a href="'+url(x)+'">'+esc(x.label)+'</a> · '+x.rows.length+'</li>').join('')+'</ul><input aria-label="Filtrer les fiches" placeholder="Filtrer ces fiches" oninput="for(const a of document.querySelectorAll(\'article\'))a.hidden=!a.textContent.toLocaleLowerCase().includes(this.value.toLocaleLowerCase())">'+c.rows.map(r=>'<article><h2><a href="../../search-v2.html#fiche='+encodeURIComponent(r.id)+'">'+esc(r.cardTitle||r.title)+'</a></h2><p>'+esc(r.cardInterest||'')+'</p></article>').join('')));writeFileSync(join(dir,url(c).replace('.html','.md')),'# '+c.label+'\n\n'+c.rows.map(r=>'- ['+(r.cardTitle||r.title)+'](../../'+r.path+')'+(r.cardInterest?' — '+r.cardInterest:'')).join('\n')+'\n');}
 writeFileSync(join(root,'public/index.json'),JSON.stringify({at:new Date().toISOString(),count:rows.length,rows:rows.map(({raw,detail,...r})=>r)},null,2)+'\n');
 return groups.length;
}
