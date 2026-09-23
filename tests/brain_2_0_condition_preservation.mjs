import fs from "node:fs";
import {evaluateHypotheses} from "../src/knowledge/hypothesis_engine.js";

const load = p => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), "utf8")).items;
const rules = load("../data/knowledge/core/evidence_rules.json");
const relationships = load("../data/knowledge/core/relationships.json");
const checks = load("../data/knowledge/core/checks.json");
const discriminators = load("../data/knowledge/core/discriminators.json");
const ok=(v,m)=>{if(!v)throw new Error(m)};

const r=evaluateHypotheses({
  facts:["FACT_EVAP_SH_HIGH","FACT_EVAP_SH_MEASURED"],
  rules,relationships,checks,discriminators,
  application:"APP_WIC",operatingState:"UNKNOWN",
  configuration:["TXV"]
});
ok(r.stateGate.steadyInterpretationAllowed===false,"unknown state still gates steady-state diagnosis");
ok(r.conditions.some(x=>x.id==="COND_EVAP_STARVED"),"high SH condition survives unknown-state gate");
ok(!r.diagnoses.some(x=>["CAUSE_LOW_REFRIGERANT_CHARGE","CAUSE_LIQUID_LINE_RESTRICTION","CAUSE_TXV_UNDERFEED"].includes(x.candidate)),
   "high SH alone does not over-diagnose root cause");
ok(r.nextCheck==="CHECK_ESTABLISH_OPERATING_STATE","state confirmation remains next check");

const incoming=relationships.filter(x=>x.relation==="MAY_CAUSE"&&x.to==="COND_EVAP_STARVED").map(x=>x.from);
const set=new Set(incoming);
const subtype=new Set(relationships.filter(x=>x.relation==="SUBTYPE_OF"&&set.has(x.from)&&set.has(x.to)).map(x=>x.from));
const broad=[...new Set(incoming.filter(x=>!subtype.has(x)))];
ok(broad.includes("CAUSE_LOW_REFRIGERANT_CHARGE"),"low charge remains a possible branch");
ok(broad.includes("CAUSE_LIQUID_LINE_RESTRICTION"),"liquid-line restriction remains a possible branch");
ok(broad.includes("CAUSE_TXV_UNDERFEED"),"TXV underfeed remains a possible branch");

const app=fs.readFileSync(new URL("../src/app.js",import.meta.url),"utf8");
ok(app.includes('snapshot.context.operatingState === "UNKNOWN" && result.conditions?.length'),
   "UI preserves supported condition before generic unknown-state message");
ok(app.includes("provisionalConditionCauses"),"UI surfaces source-backed condition cause branches");
console.log("BRAIN 2.0 CONDITION PRESERVATION: 9 assertions PASS");
