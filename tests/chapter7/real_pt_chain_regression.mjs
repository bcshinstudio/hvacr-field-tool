import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../../src/knowledge/hypothesis_engine.js';
const readJson=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const kb=p=>readJson(`../../data/knowledge/core/${p}.json`).items;
const reference=fs.readFileSync(new URL('../../data/reference_values.csv',import.meta.url),'utf8');
function tableFor(refrigerant){
 const path=refrigerant==='R404A'?'R404A.csv':refrigerant==='R134a'?'R134a.csv':null;
 assert(path,`unsupported test refrigerant ${refrigerant}`);
 const lines=fs.readFileSync(new URL(`../../data/refrigerants/${path}`,import.meta.url),'utf8').trim().split(/\r?\n/);
 const headers=lines.shift().split(',');
 return lines.map(line=>Object.fromEntries(line.split(',').map((v,i)=>[headers[i],Number(v)])));
}
function temperatureAtPressure(pressure,side,table){
 const key=side==='bubble'&&table[0].bubble_psig!==undefined?'bubble_psig':side==='dew'&&table[0].dew_psig!==undefined?'dew_psig':'pressure_psig';
 const rows=[...table].sort((a,b)=>a[key]-b[key]);
 for(let i=1;i<rows.length;i++)if(pressure<=rows[i][key]){
  const l=rows[i-1],h=rows[i];
  return l.temperature_f+(h.temperature_f-l.temperature_f)*(pressure-l[key])/(h[key]-l[key]);
 }
 throw Error(`pressure out of range: ${pressure}`);
}
const cases=readJson('inputs.json').cases;
const apps={walk_in_cooler:'APP_WIC',walk_in_freezer:'APP_WIF',reach_in_refrigerator:'APP_RIC',reach_in_freezer:'APP_RIF'};
const results=[];
for(const c of cases){
 const pt=tableFor(c.refrigerant);
 const evap=temperatureAtPressure(c.suction_psig,'dew',pt);
 const cond=temperatureAtPressure(c.discharge_psig,'bubble',pt);
 const sh=c.suction_line_f-evap, sc=cond-c.liquid_line_f;
 const application=apps[c.equipment];
 assert(application,`unsupported exercise application ${c.equipment}`);
 // Same screening TD and tolerance for systems that have an application
 // reference in data/reference_values.csv; otherwise withhold classification.
 const tdRows=reference.split(/\r?\n/).filter(row=>row.includes(`,${application},PAR_EVAP_TD,`)&&row.includes(',SCREENING_REFERENCE,'));
 let ref=null;
 if(tdRows.length===1){const td=Number(tdRows[0].split(',')[3]);ref={center:c.box_f-td,low:c.box_f-td-10,high:c.box_f-td+10}}
 const snapshot={
  calculated:{evaporatorSat:evap,evaporatorReferenceSat:ref?.center,evaporatorReferenceLow:ref?.low,evaporatorReferenceHigh:ref?.high,
  condenserSat:cond,condenserReferenceLow:c.ambient_f+20,condenserReferenceHigh:c.ambient_f+40,
  evaporatorSuperheat:sh,...(sc>=0?{condenserSubcooling:sc}:{})},
  references:{evaporatorSuperheat:{low:5,high:20},lowAmbientThresholdF:['APP_WIC','APP_WIF'].includes(application)?50:null},
  measurements:{outdoorAmbientF:c.ambient_f,...(Number.isFinite(c.filter_drier_inlet_f)&&Number.isFinite(c.filter_drier_outlet_f)?{filterDrierInletTemperature:c.filter_drier_inlet_f,filterDrierOutletTemperature:c.filter_drier_outlet_f}:{})},
  context:{operatingState:'STABLE_COOLING',evaporatorPressureQuality:'valid',condenserPressureQuality:'valid'},
  configuration:c.metering==='TEV'?['TXV','RECEIVER']:[]
 };
 const adapted=buildWicKnowledgeFacts(snapshot);
 const r=evaluateHypotheses({facts:adapted.facts,factRecords:adapted.factRecords||[],rules:kb('evidence_rules'),relationships:kb('relationships'),discriminators:kb('discriminators'),checks:kb('checks'),application,operatingState:'STABLE_COOLING',configuration:snapshot.configuration});
 results.push({problem:c.book_problem,application,pressureBased:{evaporatorSatF:+evap.toFixed(2),condenserSatF:+cond.toFixed(2),superheatF:+sh.toFixed(2),estimatedSubcoolF:+sc.toFixed(2),referenceEvapSatF:ref?.center??null},facts:adapted.facts,conditions:r.conditions.map(x=>x.id),causalAlternatives:r.conditionCauses.map(x=>x.candidate),diagnoses:r.diagnoses.map(x=>x.candidate),possible:r.hypotheses.map(x=>x.candidate),nextCheck:r.nextCheck});
}
assert.equal(results.length,15);
assert(results.every(x=>x.pressureBased.evaporatorSatF!==null&&x.pressureBased.condenserSatF!==null));
assert(results.find(x=>x.problem==='7-5').facts.includes('FACT_LOW_EVAP_SAT_WITH_NORMAL_SH'),'7-5 low evap SAT + normal SH must be recognized');
assert(results.find(x=>x.problem==='7-5').conditions.includes('COND_EVAP_REDUCED_HEAT_TRANSFER'),'7-5 low-transfer condition must be considered');
assert(results.find(x=>x.problem==='7-5').causalAlternatives.includes('CAUSE_EVAP_AIRFLOW_RESTRICTION'),'7-5 airflow restriction remains a plausible causal alternative');
const caseAt=id=>results.find(x=>x.problem===id);
const hasFact=(id,fact)=>caseAt(id).facts.includes(fact);
const hasCondition=(id,condition)=>caseAt(id).conditions.includes(condition);
const hasCause=(id,cause)=>[...caseAt(id).diagnoses,...caseAt(id).possible,...caseAt(id).causalAlternatives].includes(cause);
assert(hasFact('7-1','FACT_COND_SAT_HIGH'),'7-1 high condensing SAT evidence');
assert(caseAt('7-2').pressureBased.estimatedSubcoolF>25,'7-2 high estimated subcooling measured');
assert(hasCondition('7-3','COND_EVAP_STARVED')&&hasCause('7-3','CAUSE_LOW_REFRIGERANT_CHARGE'),'7-3 starvation with low charge as possible cause');
assert(hasFact('7-4','FACT_EVAP_SAT_HIGH')&&hasFact('7-4','FACT_EVAP_SH_HIGH'),'7-4 high suction SAT and high SH are both available');
assert(!hasFact('7-4','FACT_SUBCOOLING_LOW'),'7-4 negative estimated subcooling not treated as valid charged-system subcooling');
assert(hasFact('7-6','FACT_DRIER_TEMP_DROP')&&caseAt('7-6').diagnoses.includes('CAUSE_FILTER_DRIER_RESTRICTION'),'7-6 direct drier differential localizes restriction');
assert(hasCondition('7-7','COND_EVAP_STARVED'),'7-7 high-SH capillary system underfeeding consideration');
assert(hasCondition('7-8','COND_EVAP_OVERFED'),'7-8 low SH overfeed condition');
assert(hasFact('7-9','FACT_HIGH_SUCTION_LOW_HEAD_PATTERN')&&hasCause('7-9','CAUSE_COMPRESSOR_INEFFICIENCY'),'7-9 weak compressor pumping remains a suspect');
assert.equal(caseAt('7-9').nextCheck,'CHECK_COMPRESSOR_CONTEXT','7-9 prioritizes compressor differential context');
assert(hasCondition('7-10','COND_EVAP_STARVED')&&hasCause('7-10','CAUSE_LOW_REFRIGERANT_CHARGE'),'7-10 low-charge possibility retained for reach-in freezer');
assert(hasCondition('7-11','COND_EVAP_OVERFED'),'7-11 low-SH overfeed condition');
assert(hasFact('7-12','FACT_EVAP_SH_LOW'),'7-12 low SH with high estimated subcooling noted');
assert(hasCondition('7-13','COND_EVAP_OVERFED'),'7-13 low SH overfeed');
assert(hasFact('7-14','FACT_LOW_AMBIENT_LOW_HEAD_PATTERN')&&caseAt('7-14').nextCheck==='CHECK_HEAD_PRESSURE_CONTROL','7-14 low ambient low head calls for head pressure check');
assert(caseAt('7-15').pressureBased.evaporatorSatF>30,'7-15 pressure-to-SAT calculations valid without forcing a diagnosis');

fs.writeFileSync(new URL('real_pt_chain_results.json',import.meta.url),JSON.stringify({status:'ACTUAL_PT_AND_PRODUCTION_HYPOTHESIS_ENGINE_TEST_NOT_TEXTBOOK_ANSWER_KEY',cases:results},null,2)+'\n');
for(const x of results){ console.log(x.problem,JSON.stringify(x.pressureBased), 'conditions', x.conditions.join(';')||'-','next',x.nextCheck||'-'); }
console.log('PASS: 15 real R-404A PT inputs through production adapter and hypothesis engine');
