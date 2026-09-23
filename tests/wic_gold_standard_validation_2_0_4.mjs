import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
const j=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const items=p=>j(p).items;
const rules=items('../data/knowledge/core/evidence_rules.json'), rel=items('../data/knowledge/core/relationships.json'), checks=items('../data/knowledge/core/checks.json'), disc=items('../data/knowledge/core/discriminators.json');
const SH={low:8,high:12,unit:'delta_degF',provenance:'APP_WIC_SPORLAN_FALLBACK'};
const base=(state='STABLE_COOLING')=>({measurements:{},calculated:{},references:{evaporatorSuperheat:SH,condenserSubcooling:null},observations:{},configuration:['TXV'],context:{operatingState:state},derived:{}});
const run=s=>{const a=buildWicKnowledgeFacts(s);const r=evaluateHypotheses({facts:a.facts,factRecords:a.factRecords||[],rules,relationships:rel,checks,discriminators:disc,application:'APP_WIC',operatingState:s.context.operatingState,configuration:s.configuration});return {a,r,dx:r.diagnoses.map(x=>x.candidate),hyp:r.hypotheses.map(x=>x.candidate)} };
let A=0,S=0; const ok=(v,m)=>{if(!v)throw Error(m);A++}; const sc=()=>S++;
// Expectations below are source-derived before comparison with Brain output.
// 1 Parker/Danfoss: high SH = starved/underfed evaporator; cause not identified by SH alone.
{sc();let s=base();s.calculated.evaporatorSuperheat=24.7;let x=run(s);ok(x.r.conditions.some(c=>c.id==='COND_EVAP_STARVED'),'1 condition');ok(x.dx.length===0,'1 no specific cause');ok(['CAUSE_LOW_REFRIGERANT_CHARGE','CAUSE_LIQUID_LINE_RESTRICTION','CAUSE_TXV_UNDERFEED'].every(v=>x.hyp.includes(v)),'1 differential');}
// 2 Same physics, state unknown: preserve physical condition but gate steady-state root cause.
{sc();let s=base('UNKNOWN');s.calculated.evaporatorSuperheat=24.7;let x=run(s);ok(x.r.conditions.some(c=>c.id==='COND_EVAP_STARVED'),'2 condition preserved');ok(x.dx.length===0,'2 cause gated');ok(x.r.nextCheck==='CHECK_ESTABLISH_OPERATING_STATE','2 state check');}
// 3 Sporlan Form 10-135 + Copeland AE17-1212: receiver can erase/reduce condenser-produced SC; 2.2F w/o applicable target cannot prove undercharge.
{sc();let s=base();s.configuration.push('RECEIVER');s.calculated={evaporatorSuperheat:24.7,condenserSubcooling:2.2};let x=run(s);ok(x.a.facts.includes('FACT_SUBCOOLING_MEASURED'),'3 SC retained');ok(x.a.facts.includes('FACT_SC_REFERENCE_NOT_APPLICABLE'),'3 receiver caveat');ok(!x.a.facts.includes('FACT_SUBCOOLING_LOW'),'3 no invented low label');ok(!x.dx.includes('CAUSE_LOW_REFRIGERANT_CHARGE'),'3 no undercharge verdict');}
// 4 Danfoss: do not add charge merely because subcooling appears insufficient; SC alone no charge diagnosis.
{sc();let s=base();s.configuration.push('RECEIVER');s.calculated.condenserSubcooling=2.2;let x=run(s);ok(!x.dx.includes('CAUSE_LOW_REFRIGERANT_CHARGE'),'4 no charge from SC alone');}
// 5 Danfoss: filter outlet colder than inlet / excessive drop supports clogged/restricted drier. High SH links it to starvation.
{sc();let s=base();s.calculated.evaporatorSuperheat=24.7;s.measurements={filterDrierInletTemperature:82,filterDrierOutletTemperature:72};let x=run(s);ok(x.a.facts.includes('FACT_DRIER_TEMP_DROP'),'5 localized evidence');ok(x.dx.includes('CAUSE_FILTER_DRIER_RESTRICTION'),'5 drier restriction');ok(!x.dx.includes('CAUSE_LOW_REFRIGERANT_CHARGE'),'5 no competing charge diagnosis');}
// 6 Parker/Danfoss: poor TXV bulb contact/location can cause high SH/underfeed.
{sc();let s=base();s.calculated.evaporatorSuperheat=24.7;s.observations={txv:{bulb_contact:'poor'}};let x=run(s);ok(x.dx.includes('CAUSE_TXV_BULB_INSTALLATION'),'6 bulb');}
// 7 Parker: restricted/capped equalizer can cause high operating SH.
{sc();let s=base();s.calculated.evaporatorSuperheat=24.7;s.observations={txv:{equalizer_condition:'issue_observed'}};let x=run(s);ok(x.dx.includes('CAUSE_TXV_EQUALIZER_FAULT'),'7 equalizer');}
// 8 Parker/Danfoss: contamination/blocked strainer at TXV inlet can starve evaporator.
{sc();let s=base();s.calculated.evaporatorSuperheat=24.7;s.observations={txv:{inlet_condition:'restriction_observed'}};let x=run(s);ok(x.dx.includes('CAUSE_TXV_INLET_RESTRICTION'),'8 inlet restriction');}
// 9 Danfoss: dirty condenser / failed condenser fan are direct heat-rejection faults.
{sc();let s=base();s.observations={condenser:{fan_operation:'not_running'}};let x=run(s);ok(x.dx.includes('CAUSE_COND_FAN_FAILURE'),'9 fan');}
{sc();let s=base();s.observations={condenser:{coil_condition:'dirty'}};let x=run(s);ok(x.dx.includes('CAUSE_COND_COIL_DIRTY'),'10 dirty coil');}
// 11 Danfoss: iced evaporator has multiple possible causes; icing alone must not assert heater failure.
{sc();let s=base();s.observations={evaporator:{coil_condition:'fully_iced'}};let x=run(s);ok(x.a.facts.includes('FACT_EVAP_COIL_ICED'),'11 icing condition');ok(!x.dx.includes('CAUSE_DEFROST_HEATER_FAILURE'),'11 no heater leap');}
// 12 State validity: defrost is not steady cooling; steady-state SH differential must be gated.
{sc();let s=base('DEFROST');s.calculated.evaporatorSuperheat=24.7;let x=run(s);ok(x.r.stateGate.steadyInterpretationAllowed===false,'12 gate');ok(!x.dx.includes('CAUSE_LOW_REFRIGERANT_CHARGE')&&!x.dx.includes('CAUSE_TXV_UNDERFEED'),'12 no steady diagnosis');}

// 13 Direct localized filter-drier evidence remains actionable even if case-wide operating state is still UNKNOWN.
{sc();let s=base('UNKNOWN');s.calculated.evaporatorSuperheat=24.7;s.measurements={filterDrierInletTemperature:90,filterDrierOutletTemperature:78};let x=run(s);ok(x.a.facts.includes('FACT_DRIER_TEMP_DROP'),'13 localized drier evidence');ok(x.dx.includes('CAUSE_FILTER_DRIER_RESTRICTION'),'13 direct drier diagnosis survives unknown state');}
console.log(`WIC GOLD-STANDARD VALIDATION 2.0.5: ${S} source-derived scenarios / ${A} assertions PASS`);
