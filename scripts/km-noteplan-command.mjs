import os from 'node:os';
import path from 'node:path';
export function noteplanCommand(script,args,{root,data,env=process.env,node=process.execPath}={}){
 const file=path.join(root,'scripts',script);
 if(env.KM_NOTEPLAN_SSH!=='1')return {command:node,args:[file,...args]};
 const quote=s=>"'"+String(s).replaceAll("'","'\\''")+"'";
 const remote=['env',`KM_ROOT=${root}`,`KM_PIPELINE_DATA=${data}`,...(env.NOTEPLAN_ROOT?[`NOTEPLAN_ROOT=${env.NOTEPLAN_ROOT}`]:[]),node,file,...args].map(quote).join(' ');
 return {command:'/usr/bin/ssh',args:['-o','BatchMode=yes','-o','IdentitiesOnly=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=5','-i',path.join(os.homedir(),'.ssh/id_ed25519_atn_core'),`${os.userInfo().username}@127.0.0.1`,remote]};
}
