import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import os from 'node:os';
const root=process.env.KM_ROOT || fileURLToPath(new URL('..',import.meta.url));
http.createServer(async(req,res)=>{
  try{
    let url=new URL(req.url,'http://localhost').pathname;
    if(url==='/status'){
      const data=path.join(os.homedir(),'Library/Application Support/KM/pipeline');
      const read=async n=>{try{return JSON.parse(await readFile(path.join(data,n),'utf8'));}catch{return {};}};
      let s=await read('status.json');const p=await read('progress.json');const lock=await read('run.lock');
      let running=false;try{if(lock.pid){process.kill(lock.pid,0);running=true;}}catch{}
      if(running && p.updatedAt>s.finishedAt)s=p;
      const esc=x=>String(x??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const when=s.finishedAt || s.updatedAt || s.startedAt;
      const date=when?new Date(when).toLocaleString('fr-FR',{timeZone:'Europe/Paris'}):'Premier passage en préparation';
      const c=s.currentExploration;
      const crawlSummary=c?`<h2>Exploration du tweet en cours</h2><p>Profondeur : ${esc(c.maxDepth)} niveaux ; maximum ${esc(c.maxPages)} pages.</p><p>${esc(c.found)} liens recensés ; ${esc(c.read)} pages lues ; ${esc(c.technical)} sources techniques analysées ; ${esc(c.analysisPending)} analyses à terminer ; ${esc(c.unread)} liens non lus ou hors limites.</p>`:'';
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
      return res.end(`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="refresh" content="30"><title>État de la veille KM</title><style>body{font:16px/1.6 system-ui;max-width:760px;margin:50px auto;padding:0 24px;color:#242424;background:#faf9f6}h1{font-size:26px}a{color:inherit}li{margin:12px 0}small{color:#666}</style><h1>Veille KM technique</h1><p>${running?'Traitement en cours':s.health==='ok'?'Dernier passage terminé':'Une vérification est nécessaire'}</p><ul><li>Raindrop : ${esc(s.raindrop?.publicItems)} éléments publics lus sur ${esc(s.raindrop?.expectedPublicItems)}.</li><li>NotePlan : ${s.noteplan?.ok?'accessible':esc(s.noteplan?.reason || 'en attente du premier scan')}.</li><li>Ce passage : ${esc(s.created || 0)} fiches créées, ${esc(s.updated || 0)} actualisées, ${esc(s.review || 0)} sources à vérifier.</li><li>Dashboard : ${s.dashboard?.ok?'reconstruit':'le dernier résultat disponible reste affiché'}.</li></ul>${crawlSummary}<p>Prochains passages à 2 h 30, 8 h 30, 14 h 30 et 20 h 30. Contenu technique uniquement ; les sources ambiguës ne produisent pas de fiche.</p><p><a href="/search-v2.html">Ouvrir KM Search v2</a></p><small>État au ${esc(date)}, heure de Paris. Actualisation toutes les 30 secondes.</small></html>`);
    }
    if(['/','/index.html','/search-v1.12.html'].includes(url)){res.writeHead(302,{Location:'/search-v2.html'});return res.end();}
    if(!(/^\/search-v2\.html$/.test(url) || /^\/public\/(folders|themes)\/[a-z0-9_-]+\.html$/.test(url))){res.writeHead(404);return res.end();}
    const file=path.join(root,url);if(!(await stat(file)).isFile())throw new Error();
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(await readFile(file));
  }catch{res.writeHead(404);res.end();}
}).listen(Number(process.env.KM_DASHBOARD_PORT || 8766),'127.0.0.1',()=>console.log('KM Search v2: http://127.0.0.1:8766/search-v2.html'));
