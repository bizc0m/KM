import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/^#/,'').trim();
export function createOntology(data){
 const byId=new Map();for(const c of data.concepts){if(byId.has(c.id))throw Error('duplicate_concept:'+c.id);byId.set(c.id,c);}
 for(const c of data.concepts){const seen=new Set([c.id]);let p=c.parent;while(p){if(!byId.has(p))throw Error('unknown_parent:'+p);if(seen.has(p))throw Error('ontology_cycle:'+p);seen.add(p);p=byId.get(p).parent;}}
 const ancestors=id=>{const out=[];for(let c=byId.get(id);c;c=byId.get(c.parent))out.push(c.id);return out;};
 const aliases=new Map();for(const c of data.concepts)for(const alias of c.aliases||[]){const k=normalize(alias);if(!aliases.has(k))aliases.set(k,new Set());aliases.get(k).add(c.id);}
 const path=id=>ancestors(id).reverse().slice(1).map(k=>byId.get(k).label);
 function classify({tags=[],status='',sources=[],origin='',title='',evidence='',conceptIds=[]}={}){
  const direct=new Set(conceptIds.filter(id=>byId.has(id)&&/^(domain|capability|compatibility)\./.test(id)&&id!=='domain.unclassified'));const text=normalize(title+'\n'+evidence);for(const c of data.concepts)if((c.patterns||[]).some(pattern=>new RegExp(pattern,'i').test(text)))direct.add(c.id);for(const t of tags)for(const id of aliases.get(normalize(t))||[])direct.add(id);
  if(/#?rouge/i.test(status))direct.add('risk.offensive');
  if(/sensible|sensitive/i.test(status))direct.add('risk.sensitive');
  if(/a verifier|à vérifier|to-verify/i.test(status))direct.add('lifecycle.review');else if(/actif|active/i.test(status))direct.add('lifecycle.active');
  if(/NotePlan/i.test(origin))direct.add('source.noteplan');if(/Raindrop/i.test(origin))direct.add('source.raindrop');if(/^X$/i.test(origin))direct.add('source.x');
  for(const value of sources)try{const h=new URL(value).hostname;if(/^(?:www\.)?github.com$|^raw.githubusercontent.com$/.test(h))direct.add('source.github');if(/^(?:www\.)?(?:x|twitter).com$/.test(h))direct.add('source.x');}catch{}
  const facets=Object.fromEntries(data.roots.map(r=>[r,[]]));const all=new Set();for(const id of direct)for(const a of ancestors(id))all.add(a);
  for(const root of data.roots)facets[root]=[...direct].filter(id=>ancestors(id).at(-1)===root && ![...direct].some(other=>other!==id&&ancestors(other).slice(1).includes(id)));
  if(!facets.domain?.length&&byId.has('domain.unclassified')){facets.domain=['domain.unclassified'];all.add('domain.unclassified');all.add('domain');}
  return {version:data.version,facets,concepts:[...all].map(id=>({...byId.get(id),facet:ancestors(id).at(-1),path:path(id)})),unmappedTags:tags.filter(t=>!aliases.has(normalize(t)))};
 }
 return {data,byId,aliases,ancestors,path,classify};
}
export const taxonomy=createOntology(JSON.parse(readFileSync(fileURLToPath(new URL('../km.ontology.json',import.meta.url)),'utf8')));
export function classifyFiche(input){return taxonomy.classify(input);}
export function classificationMarkdown(classification){return '## Ontologie\n\n- Version : '+classification.version+'\n- Identifiants : '+Object.values(classification.facets).flat().join(' ')+'\n'+Object.entries(classification.facets).filter(([,ids])=>ids.length).map(([facet,ids])=>'- '+taxonomy.byId.get(facet).label+' : '+ids.map(id=>taxonomy.path(id).join(' > ')).join(' ; ')).join('\n')+'\n\n';}

export function storedConcepts(content){const section=content.match(/## Ontologie\n([\s\S]*?)(?=\n## |$)/)?.[1]||'';return (section.match(/- Identifiants : ([^\n]+)/)?.[1]||'').split(/\s+/).filter(Boolean);}
