// WIC Diagnostic Brain 2.0 — causal evidence / hypothesis engine.
// Pure logic: no DOM, no refrigerant tables, no invented HVAC thresholds.
// Adds scope/state gating, suspect/invalid evidence handling, explicit completed checks,
// contradiction surfacing, and discrimination-first next-check selection.
// Backward compatible with Brain 1.0 callers that pass only string fact IDs.
export const HYPOTHESIS_ENGINE_VERSION="2.0.0";

const DEFAULT_WEIGHTS={STRONG_SUPPORT:5,SUPPORT:2,CONTRADICT:-3,STRONG_CONTRADICT:-6,EXCLUDE:-1000};
const STEADY_STATES=new Set(["STABLE_COOLING","PULLDOWN"]);

function normalizeFacts(facts=[],factRecords=[]){
  const records=new Map();
  for(const f of facts){
    if(typeof f==="string") records.set(f,{id:f,quality:"VALID"});
    else if(f?.id) records.set(f.id,{quality:"VALID",...f});
  }
  for(const r of factRecords||[]) if(r?.id) records.set(r.id,{quality:"VALID",...r});
  const valid=new Set(), suspect=new Set(), invalid=new Set();
  for(const [id,r] of records){
    if(r.quality==="INVALID") invalid.add(id);
    else if(r.quality==="SUSPECT") suspect.add(id);
    else valid.add(id);
  }
  return {records,valid,suspect,invalid};
}

function scopeApplies(rule,context={}){
  const s=rule.scope||{};
  if(s.applications?.length && context.application && !s.applications.includes(context.application))
    return {ok:false,reason:"APPLICATION_SCOPE"};
  if(s.operating_states?.length && context.operatingState && !s.operating_states.includes(context.operatingState))
    return {ok:false,reason:"OPERATING_STATE_SCOPE"};
  if(s.requires_configuration?.length){
    const cfg=new Set(context.configuration||[]);
    if(!s.requires_configuration.every(x=>cfg.has(x))) return {ok:false,reason:"CONFIGURATION_SCOPE"};
  }
  return {ok:true,reason:null};
}

function evidenceFor(rule,factState,context,weights=DEFAULT_WEIGHTS){
  const scoped=scopeApplies(rule,context);
  if(!scoped.ok) return {candidate:rule.candidate,ruleId:rule.id,score:0,state:"OUT_OF_SCOPE",direct:false,evidence:[],scopeReason:scoped.reason};
  let score=0,support=0,direct=false,excluded=false,requiredMissing=false,contradictions=0;
  const trace=[];
  for(const e of rule.evidence||[]){
    const invalid=factState.invalid.has(e.fact);
    const suspect=factState.suspect.has(e.fact);
    const present=factState.valid.has(e.fact) || suspect;
    trace.push({...e,state:invalid?"INVALID":suspect?"SUSPECT":present?"PRESENT":"UNKNOWN"});
    if(invalid || !present){if(e.role==="REQUIRED")requiredMissing=true;continue;}
    if(e.role==="EXCLUDE"){excluded=true;score+=weights.EXCLUDE;continue;}
    let w=weights[e.role]||0;
    if(suspect) w*=0.25; // suspect evidence can guide a check, never confidently establish a cause
    if(e.role==="CONTRADICT"||e.role==="STRONG_CONTRADICT") contradictions++;
    if(e.role==="SUPPORT"||e.role==="STRONG_SUPPORT"){
      support++;
      if(e.direct && !suspect) direct=true;
    }
    score+=w;
  }
  let state="UNRESOLVED";
  if(excluded) state="EXCLUDED";
  else if(score<0) state="DISFAVORED";
  else if(!requiredMissing&&support>0) state=direct?"SUPPORTED":"PLAUSIBLE";
  return {candidate:rule.candidate,ruleId:rule.id,score,state,direct,contradictions,evidence:trace};
}

function parentMap(relationships){
  return new Map((relationships||[]).filter(r=>r.relation==="SUBTYPE_OF").map(r=>[r.from,r.to]));
}
function suppressParents(items,relationships){
  const parents=parentMap(relationships), ids=new Set(items.map(x=>x.candidate)), hidden=new Set();
  for(const child of ids){let p=parents.get(child),seen=new Set();while(p&&!seen.has(p)){seen.add(p);if(ids.has(p))hidden.add(p);p=parents.get(p);}}
  return items.filter(x=>!hidden.has(x.candidate));
}
// For unresolved/plausible hypotheses, prefer the broad parent until localized/direct
// evidence supports a subtype.
function generalizePlausible(items,relationships){
  const parents=parentMap(relationships), ids=new Set(items.map(x=>x.candidate)), hide=new Set();
  for(const item of items){
    if(item.direct) continue;
    let p=parents.get(item.candidate),seen=new Set();
    while(p&&!seen.has(p)){seen.add(p);if(ids.has(p)){hide.add(item.candidate);break;}p=parents.get(p);}
  }
  return items.filter(x=>!hide.has(x.candidate));
}
function inferConditions(validFacts,relationships){
  const out=new Map();
  for(const r of relationships||[]){
    if(r.relation!=="INDICATES"||!validFacts.has(r.from))continue;
    const x=out.get(r.to)||{id:r.to,evidence:[],sources:new Set()};
    x.evidence.push(r.from);for(const s of r.sources||[])x.sources.add(s);out.set(r.to,x);
  }
  return [...out.values()].map(x=>({...x,sources:[...x.sources]}));
}

function checkComplete(c,validFacts,completedChecks,context={}){
  if(c.id==="CHECK_ESTABLISH_OPERATING_STATE" && context.operatingState && context.operatingState!=="UNKNOWN") return true;
  if(completedChecks.has(c.id)) return true;
  if((c.satisfied_if_any||[]).some(x=>validFacts.has(x))) return true;
  return (c.produces||[]).length>0 && (c.produces||[]).every(x=>validFacts.has(x));
}
function checkAllowed(c,context){
  if(c.operating_states?.length && context.operatingState && !c.operating_states.includes(context.operatingState)) return false;
  if(c.requires_configuration?.length){
    const cfg=new Set(context.configuration||[]);
    if(!c.requires_configuration.every(x=>cfg.has(x))) return false;
  }
  return true;
}
function unresolvedCheckValue(check,hypotheses,validFacts,completedChecks,context){
  if(!checkAllowed(check,context)||checkComplete(check,validFacts,completedChecks,context)) return -1;
  const produced=new Set(check.produces||[]);
  let candidates=0,direct=0,coverage=0,conflict=0;
  for(const h of hypotheses){
    let touches=false;
    for(const e of h.evidence||[]){
      if(produced.has(e.fact)){touches=true;coverage++;if(e.direct)direct++;if(e.role==="CONTRADICT"||e.role==="STRONG_CONTRADICT")conflict++;}
    }
    if(touches)candidates++;
  }
  // Reward checks that touch several live hypotheses and can localize/contradict them.
  return candidates*12+direct*5+conflict*4+coverage;
}
function preferredCheck(checks,discriminators,validFacts,hypotheses,conditions,completedChecks,context){
  const active=new Set(hypotheses.map(x=>x.candidate)),cond=new Set(conditions.map(x=>x.id));
  const preferred=[];
  for(const d of discriminators||[]){
    const relevant=(d.trigger_conditions||[]).some(x=>cond.has(x)) ||
      (d.trigger_facts||[]).some(x=>validFacts.has(x)) ||
      (d.candidates||[]).filter(x=>active.has(x)).length>=2;
    if(relevant){
      for(const id of d.preferred_checks||[])if(!preferred.includes(id))preferred.push(id);
      if(d.priority==="MANDATORY"){
        const c=(checks||[]).find(x=>x.id===(d.preferred_checks||[])[0]);
        if(c && checkAllowed(c,context) && !checkComplete(c,validFacts,completedChecks,context)) return c.id;
      }
    }
  }
  let best=null,bestScore=-1;
  for(const c of checks||[]){
    const base=unresolvedCheckValue(c,hypotheses,validFacts,completedChecks,context);
    if(base<0)continue;
    const pref=preferred.indexOf(c.id);
    const score=base+(pref>=0?Math.max(0,8-pref*.5):0)+(c.practicality==="HIGH"?2:0);
    if(score>bestScore){best=c;bestScore=score;}
  }
  return best?.id||null;
}

function stateGate(context){
  const s=context.operatingState;
  if(!s) return {status:"UNKNOWN_NOT_PROVIDED",steadyInterpretationAllowed:true};
  if(STEADY_STATES.has(s)) return {status:"STEADY_OR_INTERPRETABLE",steadyInterpretationAllowed:true};
  if(["DEFROST","POST_DEFROST","PUMP_DOWN","SATISFIED","STARTUP","OFF","UNKNOWN"].includes(s))
    return {status:"TRANSIENT_OR_NONCOOLING",steadyInterpretationAllowed:false};
  return {status:"UNKNOWN_STATE",steadyInterpretationAllowed:false};
}

export function evaluateHypotheses({
  facts=[],factRecords=[],rules=[],relationships=[],discriminators=[],checks=[],
  application=null,operatingState=null,configuration=[],completedChecks=[]
}){
  const context={application,operatingState,configuration};
  const gate=stateGate(context);
  const factState=normalizeFacts(facts,factRecords);
  const completed=new Set(completedChecks||[]);
  let all=rules.map(r=>evidenceFor(r,factState,context)).sort((a,b)=>b.score-a.score);
  const dedupeBest=items=>{
    const m=new Map();
    for(const x of items){const prev=m.get(x.candidate);if(!prev||x.score>prev.score)m.set(x.candidate,x);}
    return [...m.values()];
  };
  const supported=dedupeBest(suppressParents(all.filter(x=>x.state==="SUPPORTED"),relationships));
  const plausible=dedupeBest(generalizePlausible(all.filter(x=>x.state==="PLAUSIBLE"),relationships));
  const disfavored=all.filter(x=>x.state==="DISFAVORED");
  const outOfScope=all.filter(x=>x.state==="OUT_OF_SCOPE");
  const conditions=inferConditions(factState.valid,relationships);
  const diagnoses=supported;
  const hypotheses=[...supported,...plausible].filter((x,i,a)=>a.findIndex(y=>y.candidate===x.candidate)===i);
  const conflicts=all.filter(x=>x.contradictions>0)
    .map(x=>({candidate:x.candidate,ruleId:x.ruleId,score:x.score,state:x.state,contradictions:x.evidence.filter(e=>(e.role==="CONTRADICT"||e.role==="STRONG_CONTRADICT")&&(e.state==="PRESENT"||e.state==="SUSPECT")).map(e=>e.fact)}));
  const suspectFacts=[...factState.suspect],invalidFacts=[...factState.invalid];

  let resolution=diagnoses.length===1?"SINGLE_SUPPORTED_CAUSE":diagnoses.length>1?"MULTIPLE_SUPPORTED_CAUSES":conditions.length?"SUPPORTED_SYSTEM_CONDITION":"INSUFFICIENT_EVIDENCE";
  // State gating is explicit metadata. Scoped rules are already excluded; callers can use this
  // to request state establishment before interpreting unscoped steady-state measurements.
  if(!gate.steadyInterpretationAllowed && diagnoses.length===0 && conditions.length===0) resolution="STATE_CONTEXT_REQUIRED";

  const mandatoryNext=preferredCheck(checks,(discriminators||[]).filter(d=>d.priority==="MANDATORY"),factState.valid,hypotheses,conditions,completed,context);
  const nextCheck=mandatoryNext || (diagnoses.length===1?null:preferredCheck(checks,discriminators,factState.valid,hypotheses,conditions,completed,context));
  return{
    engineVersion:HYPOTHESIS_ENGINE_VERSION,resolution,stateGate:gate,conditions,diagnoses,hypotheses,
    disfavored,outOfScope,conflicts,suspectFacts,invalidFacts,nextCheck,candidates:all
  };
}
