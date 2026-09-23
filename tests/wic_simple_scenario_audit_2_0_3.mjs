import fs from "node:fs";
import {buildWicKnowledgeFacts} from "../src/knowledge/wic_fact_adapter.js";
import {evaluateHypotheses} from "../src/knowledge/hypothesis_engine.js";
const load=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),"utf8")).items;
const rules=load("../data/knowledge/core/evidence_rules.json"), relationships=load("../data/knowledge/core/relationships.json"), checks=load("../data/knowledge/core/checks.json"), discriminators=load("../data/knowledge/core/discriminators.json");
const shRef={low:8,high:12,unit:"delta_degF"}, scRef={low:8,high:15,unit:"delta_degF"};
const base=(state="STABLE_COOLING")=>({measurements:{},calculated:{},references:{evaporatorSuperheat:shRef,condenserSubcooling:null},observations:{},configuration:["TXV"],context:{operatingState:state},derived:{}});
const run=s=>{const a=buildWicKnowledgeFacts(s);const r=evaluateHypotheses({facts:a.facts,factRecords:a.factRecords||[],rules,relationships,checks,discriminators,application:"APP_WIC",operatingState:s.context.operatingState,configuration:s.configuration||[]});return{a,r,dx:r.diagnoses.map(x=>x.candidate),hyp:r.hypotheses.map(x=>x.candidate)}};
let n=0,scenarios=0;const ok=(v,m)=>{if(!v)throw Error(m);n++};const scenario=()=>scenarios++;

// 1 — Exact manual Test 1: high SH, unknown state.
{scenario();let s=base("UNKNOWN");s.calculated.evaporatorSuperheat=24.7;let x=run(s);ok(x.r.conditions.some(c=>c.id==="COND_EVAP_STARVED"),"1 starvation preserved");ok(x.dx.length===0,"1 no root-cause diagnosis");ok(x.r.nextCheck==="CHECK_ESTABLISH_OPERATING_STATE","1 state confirmation first");}
// 2 — Same high SH after stable cooling is confirmed.
{scenario();let s=base();s.calculated.evaporatorSuperheat=24.7;let x=run(s);ok(x.r.conditions.some(c=>c.id==="COND_EVAP_STARVED"),"2 starvation");ok(!x.dx.includes("CAUSE_LOW_REFRIGERANT_CHARGE"),"2 high SH alone not low charge");ok(x.hyp.includes("CAUSE_LOW_REFRIGERANT_CHARGE")&&x.hyp.includes("CAUSE_LIQUID_LINE_RESTRICTION")&&x.hyp.includes("CAUSE_TXV_UNDERFEED"),"2 three broad branches remain");}
// 3 — Exact manual Test 2: 24.7 SH + 2.2 SC, receiver, no SC target.
{scenario();let s=base();s.configuration.push("RECEIVER");s.calculated={evaporatorSuperheat:24.7,condenserSubcooling:2.2};let x=run(s);ok(x.a.facts.includes("FACT_SUBCOOLING_MEASURED"),"3 SC preserved");ok(x.a.facts.includes("FACT_RECEIVER_PRESENT"),"3 receiver captured");ok(x.a.facts.includes("FACT_SC_REFERENCE_NOT_APPLICABLE"),"3 receiver SC caveat captured");ok(!x.a.facts.includes("FACT_SUBCOOLING_LOW"),"3 no invented low-SC threshold");ok(!x.dx.includes("CAUSE_LOW_REFRIGERANT_CHARGE"),"3 no low-charge overdiagnosis");ok(x.r.conditions.some(c=>c.id==="COND_EVAP_STARVED"),"3 starvation remains");ok(x.r.nextCheck!=="CHECK_MEASURE_SC","3 do not ask to remeasure completed SC");}
// 4 — Exact Test 2 but operating state unknown: preserve condition, still confirm state first.
{scenario();let s=base("UNKNOWN");s.configuration.push("RECEIVER");s.calculated={evaporatorSuperheat:24.7,condenserSubcooling:2.2};let x=run(s);ok(x.r.conditions.some(c=>c.id==="COND_EVAP_STARVED"),"4 condition survives state gate");ok(x.dx.length===0,"4 no steady-state diagnosis");ok(x.r.nextCheck==="CHECK_ESTABLISH_OPERATING_STATE","4 state first");}
// 5 — Applicable explicit SC target changes the evidence legitimately.
{scenario();let s=base();s.references.condenserSubcooling=scRef;s.calculated={evaporatorSuperheat:24.7,condenserSubcooling:2.2};let x=run(s);ok(x.a.facts.includes("FACT_SUBCOOLING_LOW"),"5 explicit target classifies low SC");ok(x.dx.includes("CAUSE_LOW_REFRIGERANT_CHARGE"),"5 high SH + applicable low SC supports low-charge pattern");}
// 6 — Receiver does not cancel an explicitly applicable target supplied by equipment/model context.
{scenario();let s=base();s.configuration.push("RECEIVER");s.references.condenserSubcooling=scRef;s.calculated={evaporatorSuperheat:24.7,condenserSubcooling:2.2};let x=run(s);ok(x.a.facts.includes("FACT_SUBCOOLING_LOW"),"6 applicable target still usable");ok(!x.a.facts.includes("FACT_SC_REFERENCE_NOT_APPLICABLE"),"6 no false caveat when target supplied");}
// 7 — Retained SC + localized drier drop localizes restriction rather than charge.
{scenario();let s=base();s.references.condenserSubcooling=scRef;s.calculated={evaporatorSuperheat:24.7,condenserSubcooling:10};s.measurements={filterDrierInletTemperature:82,filterDrierOutletTemperature:72};let x=run(s);ok(x.dx.includes("CAUSE_FILTER_DRIER_RESTRICTION"),"7 drier localized");ok(!x.dx.includes("CAUSE_LOW_REFRIGERANT_CHARGE"),"7 low charge not diagnosed");}
// 8 — Equal drier temperatures complete the check but do not create a restriction.
{scenario();let s=base();s.calculated.evaporatorSuperheat=24.7;s.measurements={filterDrierInletTemperature:82,filterDrierOutletTemperature:82};let x=run(s);ok(x.a.facts.includes("FACT_DRIER_TEMPERATURES_MEASURED"),"8 drier check completed");ok(!x.a.facts.includes("FACT_DRIER_TEMP_DROP"),"8 no false drop");ok(x.r.nextCheck!=="CHECK_DRIER_DROP","8 no repeat check");}
// 9 — TXV bulb evidence localizes a TXV installation cause.
{scenario();let s=base();s.calculated.evaporatorSuperheat=24.7;s.observations={txv:{bulb_contact:"poor"}};let x=run(s);ok(x.dx.includes("CAUSE_TXV_BULB_INSTALLATION"),"9 bulb diagnosis");ok(!x.dx.includes("CAUSE_LOW_REFRIGERANT_CHARGE"),"9 no low-charge takeover");}
// 10 — TXV equalizer evidence localizes equalizer fault.
{scenario();let s=base();s.calculated.evaporatorSuperheat=24.7;s.observations={txv:{equalizer_condition:"issue_observed"}};let x=run(s);ok(x.dx.includes("CAUSE_TXV_EQUALIZER_FAULT"),"10 equalizer diagnosis");}
// 11 — TXV inlet restriction evidence localizes inlet restriction.
{scenario();let s=base();s.calculated.evaporatorSuperheat=24.7;s.observations={txv:{inlet_condition:"restriction_observed"}};let x=run(s);ok(x.dx.includes("CAUSE_TXV_INLET_RESTRICTION"),"11 inlet restriction diagnosis");}
// 12 — TXV no-response evidence localizes power element / valve fault.
{scenario();let s=base();s.calculated.evaporatorSuperheat=24.7;s.observations={txv:{response_to_load:"does_not_respond"}};let x=run(s);ok(x.dx.includes("CAUSE_TXV_POWER_ELEMENT_OR_BULB_CHARGE_FAULT"),"12 TXV response diagnosis");}
// 13 — Condenser fan directly observed failed.
{scenario();let s=base();s.observations={condenser:{fan_operation:"not_running"}};let x=run(s);ok(x.a.facts.includes("FACT_COND_FAN_NOT_RUNNING"),"13 fan fact");ok(x.dx.includes("CAUSE_COND_FAN_FAILURE"),"13 fan diagnosis");}
// 14 — Dirty condenser directly observed.
{scenario();let s=base();s.observations={condenser:{coil_condition:"dirty"}};let x=run(s);ok(x.dx.includes("CAUSE_COND_COIL_DIRTY"),"14 dirty condenser diagnosis");}
// 15 — Evaporator fan directly observed failed.
{scenario();let s=base();s.observations={evaporator:{fan_operation:"not_running"}};let x=run(s);ok(x.dx.includes("CAUSE_EVAP_FAN_FAILURE"),"15 evap fan diagnosis");}
// 16 — Iced evaporator is a real condition but not automatically a defrost-heater diagnosis.
{scenario();let s=base();s.observations={evaporator:{coil_condition:"fully_iced"}};let x=run(s);ok(x.a.facts.includes("FACT_EVAP_COIL_ICED"),"16 ice fact");ok(!x.dx.includes("CAUSE_DEFROST_HEATER_FAILURE"),"16 no heater guess");}
// 17 — Pump-down gates high-SH steady-cooling root causes.
{scenario();let s=base("PUMP_DOWN");s.calculated.evaporatorSuperheat=24.7;let x=run(s);ok(x.r.stateGate.steadyInterpretationAllowed===false,"17 pumpdown gate");ok(!x.dx.includes("CAUSE_LOW_REFRIGERANT_CHARGE"),"17 no low charge in pumpdown");}
// 18 — Defrost gates steady-cooling root causes.
{scenario();let s=base("DEFROST");s.calculated.evaporatorSuperheat=24.7;let x=run(s);ok(x.r.stateGate.steadyInterpretationAllowed===false,"18 defrost gate");ok(!x.dx.includes("CAUSE_TXV_UNDERFEED"),"18 no TXV underfeed from SH in defrost");}
// 19 — Missing SC stays neutral; high SH remains condition not diagnosis.
{scenario();let s=base();s.calculated.evaporatorSuperheat=24.7;let x=run(s);ok(!x.a.facts.includes("FACT_SUBCOOLING_MEASURED"),"19 missing SC neutral");ok(x.r.conditions.some(c=>c.id==="COND_EVAP_STARVED"),"19 starvation still supported");}
// 20 — SC alone with receiver/no target must not manufacture a charge diagnosis.
{scenario();let s=base();s.configuration.push("RECEIVER");s.calculated.condenserSubcooling=2.2;let x=run(s);ok(x.a.facts.includes("FACT_SUBCOOLING_MEASURED"),"20 SC measured");ok(!x.a.facts.includes("FACT_SUBCOOLING_LOW"),"20 not classified low");ok(!x.dx.includes("CAUSE_LOW_REFRIGERANT_CHARGE"),"20 no charge diagnosis");}

console.log(`WIC SIMPLE SCENARIO AUDIT 2.0.3: ${scenarios} scenarios / ${n} assertions PASS`);
