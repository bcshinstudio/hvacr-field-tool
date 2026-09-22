// WIC Diagnostic Brain 1.0 — causal evidence / hypothesis engine.
// Pure logic: no DOM, no refrigerant tables, no invented HVAC thresholds.
// Numeric classifications must be supplied by the fact adapter using an applicable reference.
export const HYPOTHESIS_ENGINE_VERSION="1.0.0";

const DEFAULT_WEIGHTS={STRONG_SUPPORT:5,SUPPORT:2,CONTRADICT:-3,STRONG_CONTRADICT:-6,EXCLUDE:-1000};

function evidenceFor(rule,facts,weights=DEFAULT_WEIGHTS){
  let score=0,support=0,direct=false,excluded=false,requiredMissing=false;
  const trace=[];
  for(const e of rule.evidence||[]){
    const present=facts.has(e.fact);
    trace.push({...e,state:present?"PRESENT":"UNKNOWN"});
    if(!present){if(e.role==="REQUIRED")requiredMissing=true;continue;}
    if(e.role==="EXCLUDE"){excluded=true;score+=weights.EXCLUDE;continue;}
    if(e.role==="SUPPORT"||e.role==="STRONG_SUPPORT"){support++;if(e.direct)direct=true;}
    score+=weights[e.role]||0;
  }
  let state="UNRESOLVED";
  if(excluded)state="EXCLUDED";
  else if(score<0)state="DISFAVORED";
  else if(!requiredMissing&&support>0)state=direct?"SUPPORTED":"PLAUSIBLE";
  return{candidate:rule.candidate,ruleId:rule.id,score,state,direct,evidence:trace};
}

function parentMap(relationships){
  return new Map((relationships||[]).filter(r=>r.relation==="SUBTYPE_OF").map(r=>[r.from,r.to]));
}
function suppressParents(items,relationships){
  const parents=parentMap(relationships), ids=new Set(items.map(x=>x.candidate)), hidden=new Set();
  for(const child of ids){let p=parents.get(child),seen=new Set();while(p&&!seen.has(p)){seen.add(p);if(ids.has(p))hidden.add(p);p=parents.get(p);}}
  return items.filter(x=>!hidden.has(x.candidate));
}
function inferConditions(facts,relationships){
  const out=new Map();
  for(const r of relationships||[]){
    if(r.relation!=="INDICATES"||!facts.has(r.from))continue;
    const x=out.get(r.to)||{id:r.to,evidence:[],sources:new Set()};
    x.evidence.push(r.from);for(const s of r.sources||[])x.sources.add(s);out.set(r.to,x);
  }
  return [...out.values()].map(x=>({...x,sources:[...x.sources]}));
}
function checkComplete(c,facts){return (c.satisfied_if_any||[]).some(x=>facts.has(x)) || ((c.produces||[]).length>0&&(c.produces||[]).every(x=>facts.has(x)));}
function unresolvedCheckValue(check,hypotheses,facts){
  if(checkComplete(check,facts))return -1;
  const produced=new Set(check.produces||[]);
  let partitions=0,direct=0,coverage=0;
  for(const h of hypotheses){
    let touches=false;
    for(const e of h.evidence||[])if(produced.has(e.fact)){touches=true;coverage++;if(e.direct)direct++;}
    if(touches)partitions++;
  }
  // Prefer checks capable of affecting several competing hypotheses; direct localization is valuable.
  return partitions*10+direct*4+coverage;
}
function preferredCheck(checks,discriminators,facts,hypotheses,conditions){
  const active=new Set(hypotheses.map(x=>x.candidate)),cond=new Set(conditions.map(x=>x.id));
  const preferred=[];
  for(const d of discriminators||[]){
    const relevant=(d.trigger_conditions||[]).some(x=>cond.has(x)) || (d.candidates||[]).filter(x=>active.has(x)).length>=2;
    if(relevant)for(const id of d.preferred_checks||[])if(!preferred.includes(id))preferred.push(id);
  }
  let best=null,bestScore=-1;
  for(const c of checks||[]){
    const base=unresolvedCheckValue(c,hypotheses,facts);
    if(base<0)continue;
    const pref=preferred.indexOf(c.id);
    // Evidence value dominates; manufacturer-curated preferred order breaks close ties.
    const score=base+(pref>=0?Math.max(0,6-pref*.5):0);
    if(score>bestScore){best=c;bestScore=score;}
  }
  return best?.id||null;
}
export function evaluateHypotheses({facts=[],rules=[],relationships=[],discriminators=[],checks=[]}){
  const fs=new Set(facts);
  let all=rules.map(r=>evidenceFor(r,fs)).sort((a,b)=>b.score-a.score);
  const supported=suppressParents(all.filter(x=>x.state==="SUPPORTED"),relationships);
  const plausible=suppressParents(all.filter(x=>x.state==="PLAUSIBLE"),relationships);
  const disfavored=all.filter(x=>x.state==="DISFAVORED");
  const conditions=inferConditions(fs,relationships);
  // A specific cause requires localized/direct evidence. Pattern-only evidence stays a hypothesis.
  let diagnoses=supported;
  // If one localized child is supported, do not surface generic alternatives as co-equal diagnoses.
  if(diagnoses.length===1){ /* intentionally retain one */ }
  let resolution=diagnoses.length===1?"SINGLE_SUPPORTED_CAUSE":diagnoses.length>1?"MULTIPLE_SUPPORTED_CAUSES":conditions.length?"SUPPORTED_SYSTEM_CONDITION":"INSUFFICIENT_EVIDENCE";
  const hypotheses=[...supported,...plausible].filter((x,i,a)=>a.findIndex(y=>y.candidate===x.candidate)===i);
  const nextCheck=diagnoses.length===1?null:preferredCheck(checks,discriminators,fs,hypotheses,conditions);
  return{resolution,conditions,diagnoses,hypotheses,disfavored,nextCheck,candidates:all};
}
