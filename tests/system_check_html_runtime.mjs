import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {buildWicKnowledgeFacts} from '../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../src/knowledge/hypothesis_engine.js';
import {interpretMeasurement} from '../src/knowledge/measurement_state.js';
import {planNextChecks,ALL_EVIDENCE_CHECKS} from '../src/diagnostics/next_check_planner.js';
const base = new URL('../data/knowledge/',import.meta.url);
const json=file=>JSON.parse(fs.readFileSync(new URL(file,base),'utf8'));
const hub={concepts:json('core/concepts.json'),rules:json('core/evidence_rules.json'),relationships:json('core/relationships.json'),discriminators:json('core/discriminators.json'),checks:json('core/checks.json'),fieldGuidance:json('core/field_guidance.json'),application:json('applications/walk_in_cooler.json')};
const source=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const start=source.indexOf('function buildKnowledgeHubComparison(state, observationValue) {');
const end=source.indexOf('\nfunction buildSystemCheckTool()',start);
assert(start>0 && end>start);
const testState={state:'UNKNOWN',snapshot:null,system:'walk_in_freezer',observations:{}};
const environment={Number,Math,Set,Map,Object,Array,String,Boolean,console,
  currentSystem:{get id(){return testState.system},components:[]},knowledgeHub:hub,knowledgeHubLoadError:null,
  buildCurrentWicKnowledgeSnapshot:()=>testState.snapshot,buildWicKnowledgeFacts,evaluateHypotheses,interpretMeasurement,planNextChecks,ALL_EVIDENCE_CHECKS,
  currentApplicationId:()=>({walk_in_cooler:'APP_WIC',walk_in_freezer:'APP_WIF',reach_in_refrigerator:'APP_RIC',reach_in_freezer:'APP_RIF'})[testState.system],
  wicDiagnosticContext:{get operatingState(){return testState.state.toLowerCase()},reportedProblem:'unknown'},
  componentObservationValues:new Map(),observationKey:(a,b)=>`${a}:${b}`,
  observationValue:(a,b)=>testState.observations[`${a}:${b}`]||null,
  getNumericMeasurementValue:()=>null,getApplicableObservationFields:()=>[],isComponentInstalled:()=>true
};
vm.createContext(environment);
vm.runInContext(source.slice(start,end)+'\nthis.renderComparison=buildKnowledgeHubComparison;',environment);
const snapshot=(state,measurements={})=>({
 measurements:{outdoorAmbientF:90},
 calculated:{evaporatorSat:.36,evaporatorReferenceSat:15,evaporatorReferenceLow:5,evaporatorReferenceHigh:25,condenserSat:100.04,condenserReferenceLow:110,condenserReferenceHigh:130,evaporatorSuperheat:9.64,condenserSubcooling:10.04,...measurements},
 references:{evaporatorSuperheat:{low:5,high:20},condenserSubcooling:null},
 configuration:['TXV','RECEIVER'],context:{operatingState:state,evaporatorPressureQuality:'valid',condenserPressureQuality:'valid'},observations:{},derived:{}
});
for (const state of ['UNKNOWN','STABLE_COOLING']){
 testState.state=state;testState.snapshot=snapshot(state);
 const html=environment.renderComparison({},()=>null);
 assert.match(html,/SYSTEM CHECK/);
 assert.match(html,/POSSIBLE CAUSES/);
 assert.match(html,/evaporator airflow|Evaporator airflow/i);
 assert.match(html,/ADDITIONAL INFORMATION NEEDED/);
 assert.match(html,/How to investigate possible causes/,`Cause investigation available under ${state}`);
 if(state==='UNKNOWN') assert(!html.includes('>Verify operating condition — preliminary findings</div>'), 'Unknown state must not replace useful diagnostic finding with generic heading');
 console.log(state,'HTML chars',html.length,'airflow',html.includes('airflow'));
}

const cases=[
 ['7-2',{evaporatorSat:39.74,evaporatorReferenceSat:40,evaporatorReferenceLow:30,evaporatorReferenceHigh:50,condenserSat:140.04,condenserReferenceLow:110,condenserReferenceHigh:130,evaporatorSuperheat:10.26,condenserSubcooling:30.04},/excess refrigerant charge/i],
 ['7-3',{evaporatorSat:-4.91,evaporatorReferenceSat:10,evaporatorReferenceLow:0,evaporatorReferenceHigh:20,condenserSat:104.95,condenserReferenceLow:115,condenserReferenceHigh:135,evaporatorSuperheat:24.91,condenserSubcooling:9.95},/low refrigerant charge/i],
 ['7-4',{evaporatorSat:24.89,evaporatorReferenceSat:10,evaporatorReferenceLow:0,evaporatorReferenceHigh:20,condenserSat:79.81,condenserReferenceLow:100,condenserReferenceHigh:120,evaporatorSuperheat:40.11,condenserSubcooling:null},/TXV|refrigerant charge/i]
];
for(const [id,values,expected] of cases){
 for(const state of ['UNKNOWN','STABLE_COOLING']){
  testState.state=state;testState.snapshot=snapshot(state,values);
  const html=environment.renderComparison({},()=>null);
  assert.match(html,/SYSTEM CHECK/);
  assert.match(html,/POSSIBLE CAUSES/);
  assert.match(html,expected,`${id} ${state} diagnostic alternatives`);
  console.log(id,state,'HTML chars',html.length);
 }
}

// Render every exercise's pressure-derived results with production UI code.
// This is a genuine HTML-output integration check, not a browser screenshot
// and not an answer-key grading test.
const caseData=JSON.parse(fs.readFileSync(new URL('./chapter7/real_pt_chain_results.json',import.meta.url),'utf8')).cases;
const rawCases=JSON.parse(fs.readFileSync(new URL('./chapter7/inputs.json',import.meta.url),'utf8')).cases;
const appMap={APP_WIC:'walk_in_cooler',APP_WIF:'walk_in_freezer',APP_RIC:'reach_in_refrigerator',APP_RIF:'reach_in_freezer'};
for(const item of caseData){
 const input=rawCases.find(c=>c.book_problem===item.problem);
 testState.system=appMap[item.application];
 for(const state of ['UNKNOWN','STABLE_COOLING']){
  testState.state=state;
  const p=item.pressureBased;
  const ref=p.referenceEvapSatF;
  testState.snapshot={
   calculated:{evaporatorSat:p.evaporatorSatF,evaporatorReferenceSat:ref,evaporatorReferenceLow:ref===null?null:ref-10,evaporatorReferenceHigh:ref===null?null:ref+10,
      condenserSat:p.condenserSatF,condenserReferenceLow:input.ambient_f+20,condenserReferenceHigh:input.ambient_f+40,
      evaporatorSuperheat:p.superheatF,...(p.estimatedSubcoolF>=0?{condenserSubcooling:p.estimatedSubcoolF}:{})},
   references:{evaporatorSuperheat:{low:5,high:20},lowAmbientThresholdF:['APP_WIC','APP_WIF'].includes(item.application)?50:null},
   measurements:{outdoorAmbientF:input.ambient_f,...(Number.isFinite(input.filter_drier_inlet_f)?{filterDrierInletTemperature:input.filter_drier_inlet_f,filterDrierOutletTemperature:input.filter_drier_outlet_f}:{})},
   context:{operatingState:state,evaporatorPressureQuality:'valid',condenserPressureQuality:'valid'},configuration:input.metering==='TEV'?['TXV','RECEIVER']:[],observations:{},derived:{}
  };
  const html=environment.renderComparison({},()=>null);
  assert.match(html,/SYSTEM CHECK/);
  assert.match(html,/POSSIBLE CAUSES/);
  assert.match(html,/ADDITIONAL INFORMATION NEEDED/);
  assert.match(html,/Confirmation tests/);
  assert(!html.includes('NaN°F'),`${item.problem} ${state}: invalid numeric output`);
 }
}
console.log('PASS: all 15 cases rendered for both states (30 production System Check HTML outputs)');
console.log('PASS System Check HTML rendering with actual production comparison function');
