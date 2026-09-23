import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
const j=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const items=p=>j(p).items;
const rules=items('../data/knowledge/core/evidence_rules.json'), relationships=items('../data/knowledge/core/relationships.json'), checks=items('../data/knowledge/core/checks.json'), discriminators=items('../data/knowledge/core/discriminators.json');
const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const SH={low:8,high:12,unit:'delta_degF'};
const base=(state='STABLE_COOLING')=>({measurements:{},calculated:{},references:{evaporatorSuperheat:SH,condenserSubcooling:null},observations:{},configuration:['TXV','RECEIVER'],context:{operatingState:state},derived:{}});
const run=s=>{const a=buildWicKnowledgeFacts(s);const r=evaluateHypotheses({facts:a.facts,factRecords:a.factRecords||[],rules,relationships,checks,discriminators,application:'APP_WIC',operatingState:s.context.operatingState,configuration:s.configuration});return {a,r,dx:r.diagnoses.map(x=>x.candidate)}};
let n=0; const ok=(v,m)=>{if(!v)throw Error(m);n++};
// 7 exact UI value: Condenser > Fan Operation > Not Running
{let s=base();s.observations={condenser:{fan_operation:'not_running'}};let x=run(s);ok(x.a.facts.includes('FACT_COND_FAN_NOT_RUNNING'),'7 fact');ok(x.dx.includes('CAUSE_COND_FAN_FAILURE'),'7 cause');ok(app.includes('The non-operating condenser fan directly impairs condenser airflow and heat rejection.'),'7 presentation');ok(app.includes('Field troubleshooting path'),'7 path UI');}
// 8 exact UI values: Fan Operation > Normal; Coil Condition > Dirty
{let s=base();s.observations={condenser:{fan_operation:'normal',coil_condition:'dirty'}};let x=run(s);ok(x.a.facts.includes('FACT_COND_COIL_DIRTY'),'8 fact');ok(x.dx.includes('CAUSE_COND_COIL_DIRTY'),'8 cause');ok(!x.dx.includes('CAUSE_COND_FAN_FAILURE'),'8 normal fan excludes fan failure');ok(app.includes('The dirty/restricted condenser coil can reduce airflow and condenser heat rejection.'),'8 presentation');}
// 9 Defrost gates ordinary steady-state diagnosis.
{let s=base('DEFROST');s.calculated.evaporatorSuperheat=24.7;let x=run(s);ok(x.r.stateGate.steadyInterpretationAllowed===false,'9 state gate');ok(!x.dx.includes('CAUSE_LOW_REFRIGERANT_CHARGE')&&!x.dx.includes('CAUSE_TXV_UNDERFEED'),'9 no steady diagnosis');ok(app.includes('— state-specific interpretation'),'9 presentation');}
// 10 SC alone, receiver, no target: measured but no low-charge verdict.
{let s=base();s.calculated.condenserSubcooling=2.2;let x=run(s);ok(x.a.facts.includes('FACT_SUBCOOLING_MEASURED'),'10 measured');ok(x.a.facts.includes('FACT_SC_REFERENCE_NOT_APPLICABLE'),'10 receiver caveat');ok(!x.a.facts.includes('FACT_SUBCOOLING_LOW'),'10 no invented formal low class');ok(!x.dx.includes('CAUSE_LOW_REFRIGERANT_CHARGE'),'10 no charge verdict');ok(app.includes('very little/minimal subcooling'),'10 presentation wording');}
console.log(`WIC ACCEPTANCE 7-10 2.0.6: ${n} assertions PASS`);
