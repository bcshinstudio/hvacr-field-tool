import fs from "fs";
import {buildWicKnowledgeFacts} from "../src/knowledge/wic_fact_adapter.js";
import {evaluateHypotheses} from "../src/knowledge/hypothesis_engine.js";
const J=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
const rules=J("../data/knowledge/core/evidence_rules.json").items,relationships=J("../data/knowledge/core/relationships.json").items;
const discriminators=J("../data/knowledge/core/discriminators.json").items,checks=J("../data/knowledge/core/checks.json").items;
const run=s=>{
 const a=buildWicKnowledgeFacts(s);
 const r=evaluateHypotheses({facts:a.facts,factRecords:a.factRecords||[],rules,relationships,discriminators,checks,application:"APP_WIC",operatingState:s.context?.operatingState});
 return {a,r};
};
const base=()=>({measurements:{},calculated:{},references:{evaporatorSuperheat:{low:8,high:12}},observations:{},context:{operatingState:"STABLE_COOLING",evaporatorPressureQuality:"valid",condenserPressureQuality:"valid"},derived:{}});
let n=0;const ok=(x,m)=>{if(!x)throw Error(m);n++};

let s=base();s.calculated.evaporatorSuperheat=25;s.observations.filter_drier={};s.measurements.filterDrierInletTemperature=80;s.measurements.filterDrierOutletTemperature=70;
let x=run(s);ok(x.r.diagnoses.some(d=>d.candidate==="CAUSE_FILTER_DRIER_RESTRICTION"),"UI snapshot high SH+drier drop -> drier diagnosis");

s=base();s.calculated.evaporatorSuperheat=25;s.observations.txv={bulb_contact:"poor"};
x=run(s);ok(x.r.diagnoses.some(d=>d.candidate==="CAUSE_TXV_BULB_INSTALLATION"),"UI snapshot bulb fault -> TXV bulb diagnosis");

s=base();s.observations.room={sensor_reference:"disagrees"};x=run(s);
ok(x.r.diagnoses.some(d=>d.candidate==="CAUSE_SENSOR_LOCATION_OR_CALIBRATION"),"UI sensor disagreement -> sensor diagnosis");

s=base();s.observations.controls={solenoid_command:"closed",solenoid_flow:"flowing"};s.context.operatingState="PUMP_DOWN";x=run(s);
ok(x.r.diagnoses.some(d=>d.candidate==="CAUSE_SOLENOID_LEAKING_OR_NOT_CLOSING"),"UI pumpdown solenoid evidence -> leaking/nonclosing diagnosis");

s=base();s.calculated.evaporatorSuperheat=25;s.context.evaporatorPressureQuality="suspect";x=run(s);
ok(x.r.suspectFacts.includes("FACT_EVAP_SH_HIGH"),"suspect UI pressure degrades high-SH evidence");
ok(!x.r.conditions.some(c=>c.id==="COND_EVAP_STARVED"),"suspect high SH cannot establish starvation");

s=base();s.calculated.evaporatorSuperheat=25;s.context.operatingState="PUMP_DOWN";x=run(s);
ok(x.r.stateGate.steadyInterpretationAllowed===false,"pumpdown state gate");
ok(!x.r.diagnoses.some(d=>d.candidate==="CAUSE_LOW_REFRIGERANT_CHARGE"),"pumpdown does not become low-charge diagnosis");

s=base();s.observations.controls={contactor_coil:"energized",contactor_output:"not_passing_voltage"};x=run(s);
ok(x.r.diagnoses.some(d=>d.candidate==="CAUSE_CONTACTOR_FAILURE"),"UI contactor evidence -> contactor diagnosis");

s=base();s.observations.room={door_infiltration:"confirmed_infiltration",warm_product_load:"large_warm_load"};s.context.operatingState="PULLDOWN";x=run(s);
ok(x.r.diagnoses.some(d=>d.candidate==="CAUSE_AIR_INFILTRATION"),"UI infiltration -> infiltration diagnosis");
ok(x.r.diagnoses.some(d=>d.candidate==="CAUSE_PRODUCT_LOAD_PULLDOWN"),"UI warm load -> pull-down diagnosis");

console.log(`BRAIN 2.0 UI->BRAIN WORKFLOWS: ${n} assertions PASS`);
