export function validateKnowledge(k){
 const errors=[],ids=new Set(),add=x=>{if(!x?.id)errors.push("Missing ID");else if(ids.has(x.id))errors.push(`Duplicate ID: ${x.id}`);else ids.add(x.id);};
 for(const x of k.concepts?.items||[])add(x);for(const x of k.checks?.items||[])add(x);for(const x of k.sources?.items||[])add(x);
 const src=new Set((k.sources?.items||[]).map(x=>x.id));
 for(const r of k.rules?.items||[]){if(!ids.has(r.candidate))errors.push(`${r.id}: unknown candidate ${r.candidate}`);for(const e of r.evidence||[])if(!ids.has(e.fact))errors.push(`${r.id}: unknown fact ${e.fact}`);for(const s of r.sources||[])if(!src.has(s))errors.push(`${r.id}: unknown source ${s}`);}
 for(const r of k.relationships?.items||[]){if(!ids.has(r.from)||!ids.has(r.to))errors.push(`${r.id}: invalid relationship endpoint`);for(const s of r.sources||[])if(!src.has(s))errors.push(`${r.id}: unknown source ${s}`);}
 return {ok:errors.length===0,errors};
}