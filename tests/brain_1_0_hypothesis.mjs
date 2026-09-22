import fs from"fs";import{evaluateHypotheses}from"../src/knowledge/hypothesis_engine.js";import{interpretMeasurement}from"../src/knowledge/measurement_state.js";
const J=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),"utf8")),rules=J("../data/knowledge/core/evidence_rules.json").items,relationships=J("../data/knowledge/core/relationships.json").items,checks=J("../data/knowledge/core/checks.json").items,discriminators=J("../data/knowledge/core/discriminators.json").items;
const run=f=>evaluateHypotheses({facts:f,rules,relationships,checks,discriminators});let n=0;const ok=(v,m)=>{if(!v)throw Error(m);n++};
// measurement truth independent from classification
let m=interpretMeasurement({id:"sc",value:2.2,unit:"delta_degF",reference:null});ok(m.value===2.2&&m.classification==="UNCLASSIFIED","2.2 SC must be preserved without invented classification");
m=interpretMeasurement({id:"sc",value:2.2,unit:"delta_degF",reference:{low:8,high:15}});ok(m.classification==="LOW","explicit target may classify SC low");
// high SH alone: condition, no cause
let r=run(["FACT_EVAP_SH_HIGH"]);ok(r.conditions.some(x=>x.id==="COND_EVAP_STARVED"),"high SH -> starvation condition");ok(r.diagnoses.length===0,"high SH alone no diagnosis");
// measured-but-unclassified SC must satisfy measurement check but not become low-charge evidence
r=run(["FACT_EVAP_SH_HIGH","FACT_SUBCOOLING_MEASURED"]);ok(r.diagnoses.length===0,"unclassified SC cannot diagnose charge");ok(r.nextCheck!=="CHECK_MEASURE_SC","must not remeasure SC");
// localized drier evidence
r=run(["FACT_EVAP_SH_HIGH","FACT_SUBCOOLING_MEASURED","FACT_DRIER_TEMP_DROP"]);ok(r.diagnoses.some(x=>x.candidate==="CAUSE_FILTER_DRIER_RESTRICTION"),"localized drier evidence diagnoses drier");
// bulb evidence localizes child
r=run(["FACT_EVAP_SH_HIGH","FACT_TXV_BULB_BAD_CONTACT"]);ok(r.diagnoses.some(x=>x.candidate==="CAUSE_TXV_BULB_INSTALLATION"),"bulb evidence localizes bulb installation");
// conflicting simultaneous localized faults remain multiple, not arbitrarily collapsed
r=run(["FACT_EVAP_SH_HIGH","FACT_DRIER_TEMP_DROP","FACT_TXV_BULB_BAD_CONTACT"]);ok(r.diagnoses.length>=2&&r.resolution==="MULTIPLE_SUPPORTED_CAUSES","two localized faults remain multiple");
console.log(`BRAIN 1.0 HYPOTHESIS: ${n} assertions PASS`);