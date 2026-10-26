import fs from 'node:fs';
import assert from 'node:assert/strict';
import {buildWicKnowledgeFacts} from '../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
const J=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8')).items;
const rules=J('../data/knowledge/core/evidence_rules.json');
const relationships=J('../data/knowledge/core/relationships.json');
const checks=J('../data/knowledge/core/checks.json');
const discriminators=J('../data/knowledge/core/discriminators.json');
const ref={evaporatorSuperheat:{low:8,high:12},condenserSubcooling:{low:8,high:15}};
function run(snapshot){
 const a=buildWicKnowledgeFacts(snapshot);
 const r=evaluateHypotheses({facts:a.facts,rules,relationships,checks,discriminators,
   application:'APP_WIC',operatingState:'STABLE_COOLING',configuration:['TXV','RECEIVER','FILTER_DRIER']});
 return {a,r,dx:r.diagnoses.map(x=>x.candidate),hyp:r.hypotheses.map(x=>x.candidate)};
}
let n=0;
function ok(v,msg){assert.ok(v,msg);n++;}
let x=run({calculated:{evaporatorSuperheat:25},references:ref,measurements:{},observations:{},derived:{}});
ok(x.r.conditions.some(c=>c.id==='COND_EVAP_STARVED'),'high SH must establish starvation');
ok(x.dx.length===0,'high SH alone must not force root cause');
ok(['CHECK_MEASURE_SC','CHECK_DRIER_DROP'].includes(x.r.nextCheck),'ambiguous starvation must request a relevant discriminating check');
x=run({calculated:{evaporatorSuperheat:25,condenserSubcooling:3},references:ref,measurements:{},observations:{},derived:{}});
ok(x.hyp.includes('CAUSE_LOW_REFRIGERANT_CHARGE'),'high SH + low SC should retain low-charge hypothesis');
ok(!x.dx.includes('CAUSE_FILTER_DRIER_RESTRICTION'),'low SC must not invent drier restriction');
x=run({calculated:{evaporatorSuperheat:25,condenserSubcooling:10},references:ref,measurements:{filterDrierInletTemperature:82,filterDrierOutletTemperature:82},observations:{},derived:{}});
ok(x.a.facts.includes('FACT_DRIER_TEMPERATURES_MEASURED'),'equal drier temperatures must record completed check');
ok(!x.a.facts.includes('FACT_DRIER_TEMP_DROP'),'equal drier temperatures must not create restriction evidence');
ok(x.r.nextCheck!=='CHECK_DRIER_DROP','completed no-drop drier check must not repeat');
x=run({calculated:{evaporatorSuperheat:25,condenserSubcooling:10},references:ref,measurements:{filterDrierInletTemperature:82,filterDrierOutletTemperature:72},observations:{},derived:{}});
ok(x.dx.includes('CAUSE_FILTER_DRIER_RESTRICTION'),'drier delta-T must localize drier restriction');
ok(!x.dx.includes('CAUSE_LOW_REFRIGERANT_CHARGE'),'localized drier evidence must discriminate against low charge');
x=run({calculated:{evaporatorSuperheat:25,condenserSubcooling:10},references:ref,measurements:{filterDrierInletTemperature:82,filterDrierOutletTemperature:82},observations:{txv:{bulb_contact:'poor'}},derived:{}});
ok(x.dx.includes('CAUSE_TXV_BULB_INSTALLATION'),'bad bulb contact + high SH must localize TXV bulb installation');
ok(!x.dx.includes('CAUSE_LOW_REFRIGERANT_CHARGE'),'retained SC + localized TXV evidence should not diagnose low charge');
x=run({calculated:{evaporatorSuperheat:25,condenserSubcooling:10},references:ref,measurements:{filterDrierInletTemperature:82,filterDrierOutletTemperature:82},observations:{txv:{equalizer_condition:'issue_observed'}},derived:{}});
ok(x.dx.includes('CAUSE_TXV_EQUALIZER_FAULT'),'equalizer evidence must localize TXV equalizer fault');
x=run({calculated:{evaporatorSuperheat:25,condenserSubcooling:10},references:ref,measurements:{filterDrierInletTemperature:82,filterDrierOutletTemperature:82},observations:{txv:{inlet_condition:'restriction_observed'}},derived:{}});
ok(x.dx.includes('CAUSE_TXV_INLET_RESTRICTION'),'TXV inlet evidence must localize inlet restriction');
x=run({calculated:{evaporatorSuperheat:25,condenserSubcooling:10},references:ref,measurements:{filterDrierInletTemperature:82,filterDrierOutletTemperature:82},observations:{txv:{response_to_load:'does_not_respond'}},derived:{}});
ok(x.dx.includes('CAUSE_TXV_POWER_ELEMENT_OR_BULB_CHARGE_FAULT'),'no TXV response must localize power element/valve fault');
console.log(`WIC STARVATION DIFFERENTIAL: ${n} assertions PASS (production hypothesis engine, WIC scope)`);
