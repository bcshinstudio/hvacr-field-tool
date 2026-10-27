import assert from 'node:assert/strict';
import fs from 'node:fs';
import {planNextCheck,EVIDENCE_CHECKS} from '../src/diagnostics/next_check_planner.js';
const select=(facts=[],candidates=[],state='STABLE_COOLING',observations={},measurements={})=>
  planNextCheck({facts,candidates,operatingState:state,observations,measurements});
let n=0;
const ok=(cond,msg)=>{assert.ok(cond,msg);n++;};
const cases=[
  ['7-1',['FACT_COND_SAT_HIGH'],[]],
  ['7-2',['FACT_COND_SAT_HIGH','FACT_SUBCOOLING_HIGH'],['CAUSE_REFRIGERANT_OVERCHARGE']],
  ['7-3',['FACT_EVAP_SAT_LOW'],[]],
  ['7-4',['FACT_EVAP_SH_HIGH'],['CAUSE_TXV_UNDERFEED']],
  ['7-5',['FACT_EVAP_SAT_LOW'],[]],
  ['7-6',['FACT_EVAP_SH_HIGH'],['CAUSE_LIQUID_LINE_RESTRICTION']],
  ['7-7',['FACT_EVAP_SAT_LOW'],[]],
  ['7-8',['FACT_EVAP_SAT_HIGH'],[]],
  ['7-9',[],['CAUSE_COMPRESSOR_INEFFICIENCY']],
  ['7-10',['FACT_EVAP_SAT_LOW'],[]],
  ['7-11',['FACT_EVAP_SH_HIGH'],[]],
  ['7-12',['FACT_EVAP_SAT_HIGH'],[]],
  ['7-13',['FACT_EVAP_SH_LOW'],[]],
  ['7-14',['FACT_COND_SAT_LOW'],['CAUSE_HEAD_PRESSURE_CONTROL_FAULT']],
  ['7-15',[],[]]
];
// This checks that representative case patterns have an actionable next step,
// not that diagnoses match the textbook (the book has no printed answer key).
for(const [id,facts,candidates] of cases){
 const result=select(facts,candidates);
 ok(result && ['state','observation','tool','action'].includes(result.type) &&
    typeof result.instruction==='string' && result.instruction.length>15,
    `${id}: missing action`);
}
ok(select(['FACT_COND_SAT_HIGH']).id==='condenser_coil','high head -> condenser coil');
ok(select(['FACT_COND_SAT_HIGH'],[],'STABLE_COOLING',{'condenser:coil_condition':'clean'}).id==='condenser_fan','coil recorded -> fan');
ok(select(['FACT_COND_SAT_HIGH'],[],'STABLE_COOLING',{
 'condenser:coil_condition':'clean','condenser:fan_operation':'normal',
 'condenser:airflow':'normal','condenser:air_recirculation':'no'
}).tool==='measurements','all condenser checks -> measurements');
ok(select(['FACT_COND_SAT_HIGH'],[],'STABLE_COOLING',{'condenser:coil_condition':'unknown'}).id==='condenser_fan','unavailable inspection -> alternate');
ok(select([],[],'UNKNOWN').type==='state','unknown state -> record state');
ok(select([],[],'OFF').id==='cooling_demand','off -> demand');
ok(select([],[],'OFF',{'controls:cooling_demand':'calling'}).id==='compressor_running','off -> compressor');
ok(select([],[],'OFF',{'controls:cooling_demand':'calling','compressor:running_state':'off'}).id==='contactor_coil','off -> contactor');
ok(select(['FACT_MAIN_POWER_NOT_AVAILABLE'],[],'UNKNOWN').type==='action','direct fault outranks unknown state');
ok(select(['FACT_DRIER_TEMP_DROP'],[],'STABLE_COOLING').type==='action','direct drier fault -> corrective action');
ok(select(['FACT_COND_FAN_NOT_RUNNING'],[],'STABLE_COOLING').type==='action','observed fan failure -> corrective action');
ok(select(['FACT_EVAP_SAT_LOW']).id==='evaporator_coil','low evap -> coil');
ok(planNextCheck({facts:[],candidates:['CAUSE_LIQUID_LINE_RESTRICTION'],operatingState:'STABLE_COOLING',nextCheckId:'CHECK_DRIER_DROP',observations:{'evaporator:coil_condition':'clean','evaporator:fan_operation':'normal','evaporator:airflow':'normal'}}).type==='tool','Brain-mapped restriction -> measurement follow-up');
ok(select([],[], 'STABLE_COOLING',{}, {'box_temperature:temperature':45}).type==='tool','missing readings -> measurements');
ok(select(['FACT_EVAP_SH_HIGH'],[],'STABLE_COOLING',{}, {},).type==='observation','SH -> recordable inspection');
ok(planNextCheck({facts:[],candidates:['CAUSE_TXV_UNDERFEED'],operatingState:'STABLE_COOLING',nextCheckId:'CHECK_TXV_INSTALL',observations:{
 'evaporator:coil_condition':'clean','evaporator:fan_operation':'normal','evaporator:airflow':'normal'
}}).id==='txv_bulb','Brain-mapped TXV evidence -> bulb check');
const supported=['condenser:coil_condition','condenser:fan_operation'];
ok(planNextCheck({facts:['FACT_COND_SAT_HIGH'],operatingState:'STABLE_COOLING',availableFields:supported,
 observations:{'condenser:coil_condition':'clean'}}).id==='condenser_fan','only supported component fields');
ok(planNextCheck({facts:['FACT_COND_SAT_HIGH'],operatingState:'STABLE_COOLING',availableFields:supported,
 observations:{'condenser:coil_condition':'clean','condenser:fan_operation':'normal'}}).type==='tool','unsupported fields skipped');
const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
for(const text of ['planNextChecks({','getApplicableObservationFields(component)','data-next-check-component','data-next-check-state','data-next-check-tool','componentObservationValues.set(key,event.target.value)','componentObservationValues.delete(key)','Review / change earlier answers','Why this diagnosis?','Confirmation tests']) ok(app.includes(text),text);
ok(Object.keys(EVIDENCE_CHECKS).length>=15,'shared registry has broad checks');
console.log(`GENERAL NEXT CHECK: ${n} assertions PASS; 15 Chapter 7 representative patterns, multiple equipment/fault families.`);
