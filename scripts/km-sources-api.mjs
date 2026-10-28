import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';import path from 'node:path';import os from 'node:os';import {createHash} from 'node:crypto';import {parseSources,fetchFeed} from './km-sources.mjs';
let saving=false;
const digest=s=>createHash('sha256').update(s).digest('hex');
export async function sourcesApi(req,res,{root,data=path.join(os.homedir(),'Library/Application Support/KM/pipeline')}){
 const pathname=new URL(req.url,'http://localhost').pathname;if(!['/sources','/sources.md','/api/sources','/api/sources/test'].includes(pathname))return false;
 const send=(code,value)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));};
 try{if(req.method==='GET'){
  if(pathname==='/sources'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"});res.end(await readFile(path.join(root,'sources.html'),'utf8'));return true;}
  const markdown=await readFile(path.join(root,'sources.md'),'utf8');if(pathname==='/sources.md'){res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});res.end(markdown);return true;}
  let sources=[],error='';try{sources=parseSources(markdown);}catch(e){error=e.message;}let status={};try{status=JSON.parse(await readFile(path.join(data,'source-status.json'),'utf8'));}catch{}send(200,{markdown,version:digest(markdown),sources,error,status});return true;
 }
 if(req.method!=='POST'){send(405,{error:'Méthode non autorisée'});return true;}
 const host=req.headers.host||'';if(!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)||req.headers['x-km-config']!=='1'||!/^application\/json\b/i.test(req.headers['content-type']||'')||(req.headers.origin&&req.headers.origin!=='http://'+host)){send(403,{error:'Modification autorisée uniquement depuis la page locale'});return true;}
 let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>65536)throw Error('Configuration limitée à 64 Ko');}const input=JSON.parse(body);
 if(pathname==='/api/sources/test'){const feed=await fetchFeed(input.url);send(200,{ok:true,count:feed.count,preview:feed.items.slice(0,5)});return true;}
 if(pathname!=='/api/sources'){send(405,{error:'Méthode non autorisée'});return true;}
 if(saving){send(409,{error:'Enregistrement déjà en cours'});return true;}saving=true;try{
 if(typeof input.markdown!=='string')throw Error('Markdown requis');const sources=parseSources(input.markdown);const file=path.join(root,'sources.md'),before=await readFile(file,'utf8');if(input.version!==digest(before)){send(409,{error:'Le fichier a changé. Recharge avant de réessayer.'});return true;}
 const backup=path.join(os.homedir(),'Library/Application Support/KM/backups/sources');await mkdir(backup,{recursive:true,mode:0o700});await writeFile(path.join(backup,Date.now()+'.md'),before,{mode:0o600,flag:'wx'});
 const tmp=file+'.'+process.pid+'.tmp';await writeFile(tmp,input.markdown,{mode:0o600});if(await readFile(file,'utf8')!==before){send(409,{error:'Modification concurrente détectée'});return true;}await rename(tmp,file);send(200,{ok:true,version:digest(input.markdown),sources});}finally{saving=false;}
 }catch(e){send(400,{error:e.message||'Opération impossible'});}return true;
}
