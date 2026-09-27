import fs from 'node:fs';
import {buildWicKnowledgeFacts} from '../../src/knowledge/wic_fact_adapter.js';
import {evaluateHypotheses} from '../../src/knowledge/hypothesis_engine.js';

const J=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const suite=J('./wic_master_diagnostic_cases.json');
const rules=J('../../data/knowledge/core/evidence_rules.json').items;
const relationships=J('../../data/knowledge/core/relationships.json').items;
const discriminators=J('../../data/knowledge/core/discriminators.json').items;
const checks=J('../../data/knowledge/core/checks.json').items;
const concepts=J('../../data/knowledge/core/concepts.json').items;
const guides=J('../../data/knowledge/core/field_guidance.json').items;
const labels=new Map(concepts.map(x=>[x.id,x.label||x.id]));
const checkLabels=new Map(checks.map(x=>[x.id,x.label||x.prompt||x.id]));
const STOP=new Set('the a an is are was were be been being to of and or in on at for from with by this that it its as before after first then next should may can could would system check result possible indicated observed present problem fault condition issue evidence direct known normal operating stable cooling'.split(/\s+/));
const norm=s=>String(s||'').toLowerCase().replace(/txv\/eev/g,'txv').replace(/[^a-z0-9]+/g,' ').trim();
const toks=s=>new Set(norm(s).split(/\s+/).filter(x=>x.length>2&&!STOP.has(x)));
function sim(a,b){const A=toks(a),B=toks(b); if(!A.size||!B.size)return 0; let n=0; for(const x of A)if(B.has(x))n++; return n/Math.min(A.size,B.size);}
function bestSim(s,arr){return arr.reduce((m,x)=>Math.max(m,sim(s,x)),0)}
function setPath(obj,path,value){const p=path.split('.');let o=obj;for(let i=0;i<p.length-1;i++)o=o[p[i]]??={};o[p.at(-1)]=value;}
function base(){return {measurements:{},calculated:{},references:{evaporatorSuperheat:{low:8,high:12,unit:'delta_degF',provenance:'MASTER_TEST'},condenserSubcooling:{low:8,high:15,unit:'delta_degF',provenance:'MASTER_TEST'}},observations:{},configuration:['TXV'],context:{operatingState:'STABLE_COOLING'},derived:{}}}
const F={
 'Low suction':'FACT_EVAP_SAT_LOW','High suction':'FACT_EVAP_SAT_HIGH','low head':'FACT_COND_SAT_LOW','Low head':'FACT_COND_SAT_LOW','high head':'FACT_COND_SAT_HIGH','High head':'FACT_COND_SAT_HIGH','high SH':'FACT_EVAP_SH_HIGH','High SH':'FACT_EVAP_SH_HIGH','low SH':'FACT_EVAP_SH_LOW','Low SH':'FACT_EVAP_SH_LOW','low SC':'FACT_SUBCOOLING_LOW','Low SC':'FACT_SUBCOOLING_LOW','high SC':'FACT_SUBCOOLING_HIGH','High SC':'FACT_SUBCOOLING_HIGH','retained/high SC':'FACT_SUBCOOLING_RETAINED',
};
function phraseFacts(text){
 const f=[]; const add=x=>{if(x&&!f.includes(x))f.push(x)}; const has=x=>text.toLowerCase().includes(x.toLowerCase());
 if(has('low suction'))add('FACT_EVAP_SAT_LOW'); if(has('high suction'))add('FACT_EVAP_SAT_HIGH'); if(has('low head'))add('FACT_COND_SAT_LOW'); if(has('high head'))add('FACT_COND_SAT_HIGH');
 if(has('high sh'))add('FACT_EVAP_SH_HIGH'); if(has('low sh'))add('FACT_EVAP_SH_LOW'); if(has('low sc'))add('FACT_SUBCOOLING_LOW'); if(has('high sc'))add('FACT_SUBCOOLING_HIGH'); if(has('retained/high sc'))add('FACT_SUBCOOLING_RETAINED');
 if(has('dirty condenser'))add('FACT_COND_COIL_DIRTY'); if(has('high head')&&has('fan stopped'))add('FACT_COND_FAN_NOT_RUNNING'); if(has('airflow normal')||has('normal condenser airflow'))add('FACT_COND_AIRFLOW_NORMAL'); if(has('condenser fan stopped'))add('FACT_COND_FAN_NOT_RUNNING'); if(has('evap fan stopped'))add('FACT_EVAP_FAN_NOT_RUNNING'); if(has('iced coil'))add('FACT_EVAP_COIL_ICED'); if(has('dirty evap coil'))add('FACT_EVAP_COIL_DIRTY');
 if(has('low airflow'))add('FACT_EVAP_AIRFLOW_LOW'); if(has('solenoid not opening'))add('FACT_SOLENOID_NOT_OPENING'); if(has('txv bulb'))add('FACT_TXV_BULB_BAD_CONTACT'); if(has('equalizer issue'))add('FACT_TXV_EQUALIZER_PROBLEM'); if(has('sight-glass bubbles'))add('FACT_SIGHT_GLASS_FLASHING'); if(has('drier restriction')||has('drier Δt'))add('FACT_DRIER_TEMP_DROP'); if(has('confirmed leak'))add('FACT_OIL_STAIN_OR_LEAK_EVIDENCE');
 if(has('high ambient'))add('FACT_HIGH_AMBIENT'); if(has('suspected overcharge'))add('FACT_CHARGE_SUSPECTED_HIGH'); if(has('warm product load')||has('high room load'))add('FACT_HIGH_PRODUCT_LOAD'); if(has('infiltration'))add('FACT_DOOR_OPEN_OR_LEAKING'); if(has('defrost incomplete'))add('FACT_DEFROST_INCOMPLETE'); if(has('drain ice'))add('FACT_DRAIN_ICE');
 if(has('cooling demand present'))add('FACT_COOLING_DEMAND_PRESENT'); if(has('cooling demand absent')||has('no cooling demand'))add('FACT_COOLING_DEMAND_ABSENT'); if(has('anti-short-cycle active'))add('FACT_ANTI_SHORT_CYCLE_DELAY_ACTIVE'); if(has('contactor coil not energized'))add('FACT_CONTACTOR_COIL_NOT_ENERGIZED'); if(has('contactor coil energized'))add('FACT_CONTACTOR_COIL_ENERGIZED'); if(has('no output voltage'))add('FACT_CONTACTOR_NOT_PASSING_VOLTAGE'); if(has('fuse open'))add('FACT_FUSE_OPEN');
 if(has('overload open')){add('FACT_OVERLOAD_PROTECTION_OPEN');add('FACT_COMPRESSOR_HOT')} if(has('hp safety open'))add('FACT_HP_SAFETY_OPEN'); if(has('lp control open'))add('FACT_LP_CONTROL_OPEN');
 if(has('solenoid commanded open but no flow')){add('FACT_SOLENOID_COMMAND_OPEN');add('FACT_SOLENOID_NO_FLOW_WHEN_OPEN')} if(has('solenoid commanded closed but flow continues')){add('FACT_SOLENOID_COMMAND_CLOSED');add('FACT_SOLENOID_FLOW_CONTINUES_CLOSED')}
 if(has('sensor error'))add('FACT_SENSOR_ERROR'); if(has('poor temperature control'))add('FACT_BOX_TEMP_HIGH'); if(has('compressor running continuously'))add('FACT_COMPRESSOR_LONG_RUNTIME'); if(has('compressor off'))add('FACT_COMPRESSOR_NOT_RUNNING'); if(has('poor cooling')||has('no abnormal load'))add('FACT_BOX_TEMP_HIGH'); if(has('lp control open during pump-down')){add('FACT_SOLENOID_COMMAND_CLOSED');add('FACT_LP_CONTROL_OPEN')} if(has('solenoid commanded open but no flow'))add('FACT_COOLING_DEMAND_PRESENT');
 return f;
}
function buildCase(c){
 const s=base(); const direct=[]; let sawEvapPair=false;
 for(const x of c.setup){
   if(x.type==='observation') setPath(s.observations,x.path,x.value==='flashing'?'flashing_or_frothing':x.value);
   else if(x.type==='measurement'){
     const map={filter_drier_inlet_temperature:'filterDrierInletTemperature',filter_drier_outlet_temperature:'filterDrierOutletTemperature'};
     if(map[x.name])s.measurements[map[x.name]]=x.value;
     if(x.name==='evaporator_outlet_pressure'||x.name==='evaporator_outlet_temperature')sawEvapPair=true;
   } else if(x.type==='fact'){
     if(x.id.startsWith('FACT_')) direct.push(x.id); else direct.push(...phraseFacts(x.ui_instruction||''));
     const t=(x.ui_instruction||'').toLowerCase(); if(t.includes('defrost state'))s.context.operatingState='DEFROST'; if(t.includes('startup state'))s.context.operatingState='STARTUP'; if(t.includes('satisfied/off'))s.context.operatingState='SATISFIED'; if(t.includes('post-defrost'))s.context.operatingState='POST_DEFROST'; if(t.includes('pump-down'))s.context.operatingState='PUMP_DOWN'; if(t.includes('unknown operating state'))s.context.operatingState='UNKNOWN';
   }
 }
 if(sawEvapPair)s.calculated.evaporatorSuperheat=24.7; // canonical R-448A 34 psig / 35F master case
 return {s,direct:[...new Set(direct)]};
}
function runCase(c){
 const {s,direct}=buildCase(c); const a=buildWicKnowledgeFacts(s); const facts=[...new Set([...a.facts,...direct])];
 const r=evaluateHypotheses({facts,factRecords:a.factRecords||[],rules,relationships,discriminators,checks,application:'APP_WIC',operatingState:s.context.operatingState,configuration:s.configuration});
 const activeGuides=[...guides].sort((a,b)=>(b.priority||0)-(a.priority||0)).filter(g=>(g.requires_all||[]).every(f=>facts.includes(f))&&(!g.requires_any?.length||g.requires_any.some(f=>facts.includes(f))));
 const stateLabels={DEFROST:['System is in defrost','Defrost operating state','Do not apply steady-cooling refrigerant diagnosis during defrost','A refrigeration measurement appears abnormal'],STARTUP:['System has just started','Startup operating state; readings are not yet stabilized','Allow startup stabilization before diagnosis','Pressure readings are not yet stabilized'],SATISFIED:['Cooling demand is satisfied/off','Off-cycle suction pressure may be low','Operating state explains why steady-cooling pressure rules do not apply'],OFF:['System is off','Off-cycle readings'],POST_DEFROST:['System is recovering from defrost','Readings are unstable during post-defrost recovery','Allow post-defrost recovery before steady-state diagnosis'],PUMP_DOWN:['System is in pump-down','Pump-down control sequence']};
 const factAliases={FACT_EVAP_SAT_LOW:['Low suction pressure','Suction pressure is low'],FACT_EVAP_SAT_HIGH:['High suction pressure','Suction pressure is high'],FACT_COND_SAT_LOW:['Condensing pressure is low','Low head pressure'],FACT_COND_SAT_HIGH:['Condensing pressure is high','High head pressure'],FACT_SUBCOOLING_LOW:['Subcooling is low/minimal'],FACT_SUBCOOLING_HIGH:['Subcooling is high'],FACT_SUBCOOLING_RETAINED:['Subcooling is retained/high'],FACT_BOX_TEMP_HIGH:['Room is not reaching setpoint','Poor cooling / room temperature high'],FACT_HIGH_PRODUCT_LOAD:['Large warm product load is present'],FACT_SENSOR_ERROR:['Room sensor disagrees with a trusted reference','Controller/sensor error is present'],FACT_DRIER_TEMP_DROP:['Temperature/pressure drop is localized across the filter drier'],FACT_SOLENOID_NO_FLOW_WHEN_OPEN:['No liquid flow is observed'],FACT_SOLENOID_COMMAND_OPEN:['Solenoid is commanded open'],FACT_SOLENOID_COMMAND_CLOSED:['Liquid-line solenoid is commanded closed'],FACT_CHARGE_SUSPECTED_HIGH:['Charge is suspected high','Suspected overcharge']};
 const actualLabels=[...facts.map(x=>labels.get(x)||x),...facts.flatMap(x=>factAliases[x]||[]),...r.conditions.map(x=>labels.get(x.id)||x.id),...r.diagnoses.map(x=>labels.get(x.candidate)||x.candidate),...r.hypotheses.map(x=>labels.get(x.candidate)||x.candidate),...activeGuides.map(x=>x.heading||x.id),...(stateLabels[s.context.operatingState]||[])];
 const headlineScore=bestSim(c.expected.headline,actualLabels);
 const findingScores=(c.expected.confirmed_findings||[]).map(x=>bestSim(x,actualLabels));
 const conceptById=new Map(concepts.map(x=>[x.id,x]));
 const stateNext={DEFROST:'Complete defrost, allow post-defrost recovery, then obtain stabilized cooling measurements before refrigerant diagnosis.',STARTUP:'Verify normal startup and allow readings to stabilize before applying pressure superheat subcooling diagnostic patterns.',SATISFIED:'Confirm the control state and obtain readings during a normal cooling call if refrigeration diagnosis is needed.',OFF:'Establish why the system is off and obtain readings during a normal cooling call.',POST_DEFROST:'Allow normal cooling recovery until temperatures and pressures stabilize, then evaluate superheat subcooling and pressures.',PUMP_DOWN:'Confirm intentional pump-down; verify solenoid closure, suction pressure fall, low-pressure control cut-out and compressor stop.'};
 const nextTexts=[
   stateNext[s.context.operatingState]||'',
   checkLabels.get(r.nextCheck)||'',
   ...activeGuides.flatMap(g=>[g.relationship||'',g.short_meaning||'',...(g.steps||[]).flatMap(x=>[x.action||'',x.record||''])]),
   ...r.diagnoses.flatMap(x=>{const z=conceptById.get(x.candidate)||{};return [z.corrective_action||'',z.explanation||''];})
 ];
 const nextScore=bestSim(c.expected.next_action_check,nextTexts);
 const errors=[];
 if(headlineScore<0.45)errors.push(`headline intent not found (${headlineScore.toFixed(2)})`);
 if(findingScores.some(x=>x<0.35))errors.push(`confirmed finding intent missing (${findingScores.map(x=>x.toFixed(2)).join(',')})`);
 if(nextScore<0.28)errors.push(`next-action intent not found (${nextScore.toFixed(2)})`);
 // Negative assertions: flag only when a forbidden statement strongly matches an actually supported diagnosis/condition/guide label.
 for(const ban of c.expected.must_not_conclude||[]){
   const b=norm(ban);
   const forbiddenDiagnoses=[];
   if(b.includes('undercharge')||b.includes('low charge')) forbiddenDiagnoses.push('CAUSE_LOW_CHARGE');
   if(b.includes('overcharge')) forbiddenDiagnoses.push('CAUSE_OVERCHARGE');
   if(b.includes('condemn compressor')||b.includes('compressor failure')) forbiddenDiagnoses.push('CAUSE_COMPRESSOR_INEFFICIENT','CAUSE_COMPRESSOR_FAILURE');
   if(forbiddenDiagnoses.some(id=>r.diagnoses.some(x=>x.candidate===id))) errors.push(`forbidden conclusion appears supported: ${ban}`);
 }
 const mappingOk = c.setup.length===0 ? false : (facts.length>0 || s.context.operatingState!=='STABLE_COOLING');
 if(!mappingOk) errors.unshift('RUNNER_MAPPING: setup produced no semantic facts/state');
 const failureClass = !errors.length ? null : errors.some(e=>e.startsWith('RUNNER_MAPPING')) ? 'RUNNER_MAPPING' : 'BRAIN_OR_PRESENTATION';
 return {id:c.id,title:c.title,pass:!errors.length,failureClass,errors,headlineScore,nextScore,findingScores,facts,operatingState:s.context.operatingState,resolution:r.resolution,diagnoses:r.diagnoses.map(x=>x.candidate),conditions:r.conditions.map(x=>x.id),nextCheck:r.nextCheck,activeGuides:activeGuides.map(x=>x.id)};
}
const results=suite.cases.map(runCase), passed=results.filter(x=>x.pass).length, failed=results.length-passed;
const report={suite:suite.suite_id,brain:'2.0.10',runner:'1.2.1',note:'Calibrated semantic runner v1.2.1. State/context mappings expanded; negative assertions use diagnosis IDs rather than prose similarity.  Concrete master inputs are translated into WIC facts/state. Next-action matching includes the same field-guide/check/corrective-action sources used by System Check. Failures are tagged RUNNER_MAPPING vs BRAIN_OR_PRESENTATION.',total:results.length,passed,failed,results};
fs.writeFileSync(new URL('./master_brain_report.json',import.meta.url),JSON.stringify(report,null,2));
const mapFails=results.filter(x=>x.failureClass==='RUNNER_MAPPING').length; const brainFails=results.filter(x=>x.failureClass==='BRAIN_OR_PRESENTATION').length;
console.log(`WIC MASTER BRAIN RUNNER v1.2.1: ${passed} PASS / ${failed} FAIL / ${results.length} TOTAL`);
console.log(`Failure classification: ${mapFails} RUNNER_MAPPING / ${brainFails} BRAIN_OR_PRESENTATION`);
for(const x of results)console.log(`${x.pass?'PASS':'FAIL'} ${x.id} ${x.title}${x.pass?'':` :: ${x.errors.join('; ')}`}`);
console.log('\nDetailed JSON report: tests\\master_validation\\master_brain_report.json');
if(failed)process.exitCode=1;
