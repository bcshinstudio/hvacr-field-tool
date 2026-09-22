import fs from "fs";
import {evaluateHypotheses,HYPOTHESIS_ENGINE_VERSION} from "../src/knowledge/hypothesis_engine.js";
const J=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
const rules=J("../data/knowledge/core/evidence_rules.json").items;
const rel=J("../data/knowledge/core/relationships.json").items;
const disc=J("../data/knowledge/core/discriminators.json").items;
const checks=J("../data/knowledge/core/checks.json").items;
let n=0; const ok=(x,m)=>{if(!x)throw new Error(m);n++};
const run=(facts,opt={})=>evaluateHypotheses({facts,rules,relationships:rel,discriminators:disc,checks,application:"APP_WIC",...opt});

ok(HYPOTHESIS_ENGINE_VERSION==="2.0.0","engine version");
let r=run(["FACT_EVAP_SH_HIGH","FACT_EVAP_SH_MEASURED"]);
ok(r.conditions.some(x=>x.id==="COND_EVAP_STARVED"),"high SH -> starvation");
ok(r.nextCheck!=="CHECK_MEASURE_SH","measured SH must not be re-requested");

r=run(["FACT_EVAP_SH_HIGH","FACT_EVAP_SH_MEASURED","FACT_SUBCOOLING_MEASURED","FACT_DRIER_TEMPERATURES_MEASURED"]);
ok(r.nextCheck!=="CHECK_MEASURE_SH"&&r.nextCheck!=="CHECK_MEASURE_SC"&&r.nextCheck!=="CHECK_DRIER_DROP","completed measurements excluded");

r=run(["FACT_EVAP_SH_HIGH","FACT_DRIER_TEMP_DROP"],{operatingState:"STABLE_COOLING"});
ok(r.diagnoses.some(x=>x.candidate==="CAUSE_FILTER_DRIER_RESTRICTION"),"localized drier evidence diagnoses restriction");

r=run(["FACT_EVAP_SH_HIGH","FACT_DRIER_TEMP_DROP","FACT_TXV_BULB_BAD_CONTACT"],{operatingState:"STABLE_COOLING"});
ok(r.resolution==="MULTIPLE_SUPPORTED_CAUSES","multiple localized faults preserved");

r=run(["FACT_EVAP_SH_HIGH"],{operatingState:"PUMP_DOWN"});
ok(!r.diagnoses.some(x=>x.candidate==="CAUSE_LOW_REFRIGERANT_CHARGE"),"steady-state low-charge rule gated during pump-down");
ok(r.outOfScope.some(x=>x.ruleId==="RULE_LOW_CHARGE"),"scope exclusion visible");

r=run([],{operatingState:"DEFROST"});
ok(r.stateGate.steadyInterpretationAllowed===false,"defrost state gate");

r=evaluateHypotheses({facts:[],factRecords:[{id:"FACT_EVAP_SH_HIGH",quality:"SUSPECT"}],rules,relationships:rel,discriminators:disc,checks,application:"APP_WIC",operatingState:"STABLE_COOLING"});
ok(r.suspectFacts.includes("FACT_EVAP_SH_HIGH"),"suspect measurement surfaced");
ok(!r.conditions.some(x=>x.id==="COND_EVAP_STARVED"),"suspect fact cannot establish condition");

r=evaluateHypotheses({facts:[],factRecords:[{id:"FACT_EVAP_SH_HIGH",quality:"INVALID"}],rules,relationships:rel,discriminators:disc,checks,application:"APP_WIC",operatingState:"STABLE_COOLING"});
ok(r.invalidFacts.includes("FACT_EVAP_SH_HIGH"),"invalid measurement surfaced");
ok(!r.hypotheses.some(x=>x.candidate==="CAUSE_LOW_REFRIGERANT_CHARGE"),"invalid fact excluded from hypotheses");

r=run(["FACT_EVAP_SH_HIGH","FACT_EVAP_SH_MEASURED"],{completedChecks:["CHECK_MEASURE_SC","CHECK_DRIER_DROP"]});
ok(r.nextCheck!=="CHECK_MEASURE_SC"&&r.nextCheck!=="CHECK_DRIER_DROP","explicit completed checks excluded");

r=run(["FACT_EVAP_SH_HIGH","FACT_SUBCOOLING_LOW","FACT_DRIER_TEMP_DROP"],{operatingState:"STABLE_COOLING"});
ok(r.conflicts.some(x=>x.candidate==="CAUSE_LOW_REFRIGERANT_CHARGE"),"contradictory evidence surfaced");

console.log(`BRAIN 2.0 INTEGRATION: ${n} assertions PASS`);
