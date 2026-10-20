const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/^#/,'').trim();
const families={
 dev:['codebase-analysis','knowledge-graph','coding','code-review','code-quality','claude-code','codex','opencode','vibe-coding','react','python','rust','javascript','typescript','swift','tests','linting','package-manager','dependencies'],
 research:['recherche-documentaire','research-agent','autonomous-research','papers','citations','research','ai-search'],
 llm:['llm','api','free-tier','providers','openai-compatible','comparaison-modeles','inference-locale','openai','chatgpt','gemini'],
 agent:['agents-code','skills-agents','agent-skills','memoire-agents','memory','long-term-memory','orchestration-agents','multi-agent','orchestration','automatisation-navigateur','browser-automation','mcp'],
 media:['transcription','traduction-audio','synthese-vocale','clonage-vocal','identification-audio','dedoublonnage','compression-images','montage-video','generation-video','generation-images','generation-3d','animation-svg','audio','video','image','design'],
 security:['rouge','pentest','red-team','offensive-risk','offensive-security','analyse-malware','malware','securite-web','detection-bots','analyse-vulnerabilites','sast'],
 osint:['osint','recon','threat-intelligence','digital-footprint'],
 privacy:['anonymisation','chiffrement','sans-suivi','recherche-privee','privacy-risk'],
 finance:['backtesting','simulation','marches-predictifs','trading','finance','polymarket'],
 source:['rss','publication-sociale','capture-notes','metadonnees-notes','planification-taches','export-conversations'],
};
export function keywordColor(value){const key=normalize(value);for(const [family,tags]of Object.entries(families))if(tags.includes(key))return family;return 'tool';}
export function cardKeywords(item){
 const seen=new Set(),entries=[];
 for(const tag of item.tags || []){const key=normalize(tag);if(!key||seen.has(key)||['technique','informatique','github','raindrop','rouge'].includes(key))continue;seen.add(key);entries.push({label:'#'+key,color:keywordColor(key),tag:'#'+key});}
 if(entries.length)return entries.slice(0,4);
 // Only a final, specific term is used as fallback. Parents stay in the filters.
 const leaves=(item.classification?.facets.domain||[]).map(id=>(item.concepts||[]).find(c=>c.id===id)).filter(c=>c&&c.path?.length>1&&c.id!=='domain.unclassified').sort((a,b)=>b.path.length-a.path.length);
 for(const c of leaves.slice(0,2)){const tag=(c.aliases||[]).find(t=>!['#agents','#agent','#ai','#ia','#github'].includes(t));entries.push({label:tag||c.label,color:tag?keywordColor(tag):'tool',subjectId:c.id});}
 return entries;
}
