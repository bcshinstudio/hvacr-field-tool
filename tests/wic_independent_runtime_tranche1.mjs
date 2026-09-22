import fs from "fs";
import {evaluateHypotheses} from "../src/knowledge/hypothesis_engine.js";
import {selectApplicableReference} from "../src/knowledge/measurement_state.js";
const J=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
const cat=J("../data/knowledge/validation/wic_executable_scenarios_tranche1.json");
const rules=J("../data/knowledge/core/evidence_rules.json").items;
const relationships=J("../data/knowledge/core/relationships.json").items;
const discriminators=J("../data/knowledge/core/discriminators.json").items;
const checks=J("../data/knowledge/core/checks.json").items;
let pass=0,fail=0; const failures=[];
for(const c of cat.cases){
 const r=evaluateHypotheses({facts:c.facts||[],factRecords:c.factRecords||[],rules,relationships,discriminators,checks,application:"APP_WIC",operatingState:c.state});
 const dx=new Set(r.diagnoses.map(x=>x.candidate)), cond=new Set(r.conditions.map(x=>x.id));
 const errs=[];
 for(const x of c.must_diagnose||[])if(!dx.has(x))errs.push(`missing diagnosis ${x}`);
 for(const x of c.must_not_diagnose||[])if(dx.has(x))errs.push(`forbidden diagnosis ${x}`);
 for(const x of c.must_conditions||[])if(!cond.has(x))errs.push(`missing condition ${x}`);
 for(const x of c.must_not_conditions||[])if(cond.has(x))errs.push(`forbidden condition ${x}`);
 if(c.reference_test==="MODEL_WINS"){
   const ref=selectApplicableReference([
     {id:"generic",level:"GENERIC_FIELD",low:8,high:15,applicable:true},
     {id:"model",level:"MODEL_SPECIFIC",low:4,high:6,applicable:true}
   ]);
   if(ref?.id!=="model")errs.push("model-specific reference did not win");
 }
 for(const x of c.forbid_next_checks||[])if(r.nextCheck===x)errs.push(`repeated next check ${x}`);
 if(c.require_next_check && r.nextCheck!==c.require_next_check)errs.push(`expected next check ${c.require_next_check}, got ${r.nextCheck}`);
 if(c.must_gate_steady===false && r.stateGate.steadyInterpretationAllowed!==false)errs.push("state gate failed");
 if(errs.length){fail++;failures.push(`${c.id}: ${errs.join("; ")}`)} else pass++;
}
console.log(`INDEPENDENT RUNTIME ALL MAPPED: ${pass} passed / ${fail} failed / ${cat.cases.length} mapped`);
if(fail){console.error(failures.join("\n"));process.exit(1);}
