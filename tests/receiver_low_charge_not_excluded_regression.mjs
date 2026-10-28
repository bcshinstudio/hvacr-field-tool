import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {buildWicKnowledgeFacts} from '../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
import {interpretMeasurement} from '../src/knowledge/measurement_state.js';
import {planNextChecks,ALL_EVIDENCE_CHECKS} from '../src/diagnostics/next_check_planner.js';
const json=file=>JSON.parse(fs.readFileSync(new URL('../data/knowledge/'+file,import.meta.url),'utf8'));
const app=json('applications/app_wif.json');
const hub={concepts:json('core/concepts.json'),rules:json('core/evidence_rules.json'),relationships:json('core/relationships.json'),discriminators:json('core/discriminators.json'),checks:json('core/checks.json'),fieldGuidance:json('core/field_guidance.json'),application:app,applications:{APP_WIF:app}};
const source=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const start=source.indexOf('function buildKnowledgeHubComparison(state, observationValue) {');
const end=source.indexOf('\nfunction buildSystemCheckTool()',start);
assert(start>0 && end>start);
let operatingState='UNKNOWN';
const snapshot={calculated:{evaporatorSat:-9.55,evaporatorReferenceSat:20,evaporatorReferenceLow:10,evaporatorReferenceHigh:30,condenserSat:90.21,condenserReferenceLow:100,condenserReferenceHigh:120,evaporatorSuperheat:34.55,condenserSubcooling:0.21},references:{evaporatorSuperheat:{low:5,high:20},condenserSubcooling:null},measurements:{outdoorAmbientF:75},configuration:['RECEIVER','TXV'],context:{operatingState:'UNKNOWN',evaporatorPressureQuality:'valid',condenserPressureQuality:'valid'},observations:{},derived:{}};
const ctx={Number,Math,Set,Map,Object,Array,String,Boolean,console,currentSystem:{id:'walk_in_freezer',components:[{id:'txv',subtype:'txv'}]},knowledgeHub:hub,knowledgeHubLoadError:null,buildCurrentWicKnowledgeSnapshot:()=>({...snapshot,context:{...snapshot.context,operatingState}}),buildWicKnowledgeFacts,evaluateHypotheses,interpretMeasurement,planNextChecks,ALL_EVIDENCE_CHECKS,currentApplicationId:()=> 'APP_WIF',wicDiagnosticContext:{get operatingState(){return operatingState.toLowerCase()},reportedProblem:'unknown'},componentObservationValues:new Map(),observationKey:(a,b)=>`${a}:${b}`,observationValue:()=>null,getNumericMeasurementValue:()=>null,getApplicableObservationFields:()=>[],isComponentInstalled:()=>true};
vm.createContext(ctx);
vm.runInContext(source.slice(start,end)+'\nthis.renderComparison=buildKnowledgeHubComparison;',ctx);
for (const state of ['UNKNOWN','STABLE_COOLING']) {
 operatingState=state;
 const html=ctx.renderComparison({},()=>null);
 const text=html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
 const segment=text.slice(text.indexOf('POSSIBLE CAUSES'),text.indexOf('How to investigate possible causes'));
 console.log(state,segment.slice(0,260)); assert.match(segment,/1\. Low refrigerant charge \/ refrigerant loss/,`receiver ${state}: missing SC reference must not exclude a low-charge possibility`);
 assert.match(segment,/TXV underfeeding/,`receiver ${state}: competing feeding cause must remain`);
 assert.match(segment,/Liquid-line restriction/,`receiver ${state}: restriction must remain competing cause`);
}
console.log('PASS low-charge differential retained with unavailable receiver subcooling target under both operating states');
