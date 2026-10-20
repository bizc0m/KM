export function detailParts(raw){
 const text=String(raw||'').replace(/^# [^\n]+\n*/,'');
 const parts=text.split(/(?=^## )/m),visible=[],technical=[];
 for(const part of parts){const heading=part.match(/^## ([^\n]+)/)?.[1]?.trim();if(!heading){if(part.trim())visible.push(part);continue;}
 if(['Sources','Source','Tags','Statut','Intérêts','Métadonnées','Type','Identité','Ontologie'].includes(heading))continue;
 if(['Traçabilité','Exploration des liens','Origines associées','Références fusionnées','Qualification'].includes(heading))technical.push(part);else visible.push(part);
 }
 return {body:visible.join('\n').trim(),technical:technical.join('\n').trim()};
}
