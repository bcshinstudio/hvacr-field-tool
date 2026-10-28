import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {buildWicKnowledgeFacts} from '../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
import {interpretMeasurement} from '../src/knowledge/measurement_state.js';
import {planNextChecks,ALL_EVIDENCE_CHECKS} from '../src/diagnostics/next_check_planner.js';
const json=file=>JSON.parse(fs.readFileSync(new URL('../data/knowledge/'+file,import.meta.url),'utf8'));
const app=json('applications/walk_in_cooler.json');
const hub={concepts:json('core/concepts.json'),rules:json('core/evidence_rules.json'),relationships:json('core/relationships.json'),discriminators:json('core/discriminators.json'),checks:json('core/checks.json'),fieldGuidance:json('core/field_guidance.json'),application:app,applications:{APP_WIC:app}};
const source=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const start=source.indexOf('function buildKnowledgeHubComparison(state, observationValue) {');
const end=source.indexOf('\nfunction buildSystemCheckTool()',start);
assert(start>=0&&end>start);
let op='UNKNOWN';
let delta=10;
const snapshot={calculated:{evaporatorSat:19.8,evaporatorReferenceSat:40,evaporatorReferenceLow:30,evaporatorReferenceHigh:50,condenserSat:100,condenserReferenceLow:110,condenserReferenceHigh:130,evaporatorSuperheat:30.2,condenserSubcooling:10},references:{evaporatorSuperheat:{low:5,high:20},condenserSubcooling:null},measurements:{outdoorAmbientF:90},configuration:['RECEIVER','TXV'],context:{operatingState:'UNKNOWN',evaporatorPressureQuality:'valid',condenserPressureQuality:'valid'},observations:{},derived:{}};
const ctx={Number,Math,Set,Map,Object,Array,String,Boolean,console,currentSystem:{id:'walk_in_cooler',components:[{id:'txv',subtype:'txv'}]},knowledgeHub:hub,knowledgeHubLoadError:null,buildCurrentWicKnowledgeSnapshot:()=>({...snapshot,context:{...snapshot.context,operatingState:op},measurements:{...snapshot.measurements,filterDrierInletTemperature:90,filterDrierOutletTemperature:90-delta}}),buildWicKnowledgeFacts,evaluateHypotheses,interpretMeasurement,planNextChecks,ALL_EVIDENCE_CHECKS,currentApplicationId:()=> 'APP_WIC',wicDiagnosticContext:{get operatingState(){return op.toLowerCase()},reportedProblem:'unknown'},componentObservationValues:new Map(),observationKey:(a,b)=>`${a}:${b}`,observationValue:()=>null,getNumericMeasurementValue:(point,unit)=>point==='box_temperature'?50:null,getApplicableObservationFields:()=>[],isComponentInstalled:()=>true};
vm.createContext(ctx);vm.runInContext(source.slice(start,end)+'\nthis.renderComparison=buildKnowledgeHubComparison;',ctx);
for(const state of ['UNKNOWN','STABLE_COOLING']){
 op=state;
 const html=ctx.renderComparison({},()=>null);const text=html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
 const top=text.slice(text.indexOf('POSSIBLE CAUSES'),text.indexOf('How to investigate possible causes'));
 assert.match(top,/1\. Filter-drier restriction/,`direct evidence should prioritize drier under ${state}: ${top}`);
 assert.match(text,/10\.0°F temperature decrease/,`localized finding under ${state}`);
 assert.match(text,/Recorded box \/ cabinet temperature: 50\.0°F/,`box evidence under ${state}`);
 assert.match(text,/Verify filter-drier temperature difference/,`confirmation check under ${state}`);
}
// A one-degree measurement difference must not claim a strong localized fault.
delta=1;op='UNKNOWN';
const one=ctx.renderComparison({},()=>null).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
assert(!/1\. Filter-drier restriction \(strong direct evidence/.test(one),'1°F difference must not force leading restriction');
console.log('PASS localized filter-drier output, provisional/stable, negative control');
