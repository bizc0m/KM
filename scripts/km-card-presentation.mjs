const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const generic=/^(agent de |outil[s]? (de |pour |d')|bibliotheque de |collection de |gestion de |utilisation de |depot github |archive |configuration de )/i;
export function cardTitle(item){
 const title=String(item.title||'').trim();
 const prefix=title.split(/\s*[:：]\s*|\s+[—–-]\s+/)[0].trim();
 if(prefix&&prefix.split(/\s+/).length<=5&&!generic.test(norm(prefix)))return prefix;
 try{const u=new URL(item.github);const repo=u.pathname.split('/').filter(Boolean)[1];if(repo)return repo.replace(/\.git$/,'');}catch{}
 return title;
}
export function cardInterest(item){
 const text=String(item.summary||'').replace(/\s+/g,' ').trim();
 if(!text||norm(text)===norm(item.title)||norm(text)===norm(cardTitle(item)))return '';
 if(/veille raindrop|base technique reutil?isable|archive km|interet a verifier|competences (operationnelles|necessaires|structurees)|workflows de securite professionnels|conseils specialises|taches specifiques|ameliorer la productivite|sans intervention humaine|professionnels rapidement/i.test(norm(text)))return '';
 // One documented sentence; do not cut a sentence in the middle to meet a length cap.
 const sentence=text.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim()||text;
 return sentence.split(/\s+/).length<=22?sentence:'';
}
