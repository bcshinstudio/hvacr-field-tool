import assert from 'node:assert/strict';
import {planNextChecks,ALL_EVIDENCE_CHECKS,BRAIN_CHECK_REQUIREMENTS} from '../src/diagnostics/next_check_planner.js';
import {buildDxKnowledgeFacts} from '../src/knowledge/dx_fact_adapter.js';
import {walkInCooler} from '../src/systems/walk_in_cooler.js';
import fs from 'node:fs';
let count=0;
function check(v,msg){assert.ok(v,msg);count++;}
const observationFields=new Set(walkInCooler.fieldData.observations.flatMap(def=>def.fields.map(f=>`${def.component}:${f.id}`)));
const controlsFields=new Set(['controls:cooling_demand','controls:contactor_coil','controls:contactor_output','controls:hp_safety','controls:lp_control','controls:solenoid_command','controls:solenoid_flow','room:door_infiltration','room:warm_product_load','room:sensor_reference']);
const allowed=[...observationFields,...controlsFields];
const make=(facts,obs={},state='STABLE_COOLING',nextCheckId=null,problem='unknown')=>
 planNextChecks({facts,observations:obs,operatingState:state,nextCheckId,
 availableFields:allowed,reportedProblem:problem,maxChecks:3});
const high=make(['FACT_COND_SAT_HIGH'],{},'STABLE_COOLING','CHECK_VERIFY_COND_AIRFLOW');
check(high.length===3,'top 3 checks');
check(high.every(x=>x.type==='observation'),'direct inputs for high head');
check(high.map(x=>x.id).join(',')==='condenser_coil,condenser_fan,condenser_airflow','prioritized condenser inspections');
const obs={'condenser:coil_condition':'clean','condenser:fan_operation':'normal'};
const updated=make(['FACT_COND_SAT_HIGH'],obs,'STABLE_COOLING','CHECK_VERIFY_COND_AIRFLOW');
check(updated.every(x=>!['condenser_coil','condenser_fan'].includes(x.id)),'does not repeat completed tests');
check(updated.some(x=>x.id==='condenser_recirculation'),'advances to remaining discriminating check');
const allNormal={
 'condenser:coil_condition':'clean','condenser:fan_operation':'normal',
 'condenser:airflow':'normal','condenser:air_recirculation':'no'
};
const afterAir=make(['FACT_COND_SAT_HIGH','FACT_SUBCOOLING_HIGH'],allNormal,'STABLE_COOLING','CHECK_VERIFY_COND_AIRFLOW');
check(afterAir.some(x=>x.type==='tool' && x.tool==='measurements'),'normal condenser findings advance to pressure-location verification');
const noRepeat=make(['FACT_COND_SAT_HIGH'],{'condenser:coil_condition':'unknown','condenser:fan_operation':'unknown'});
check(!noRepeat.some(x=>['condenser_coil','condenser_fan'].includes(x.id)),'explicitly unavailable checks are skipped');

const fault=make(['FACT_COND_SAT_HIGH','FACT_COND_FAN_NOT_RUNNING'],{'condenser:fan_operation':'not_running'});
check(fault[0].type==='action','direct fault outranks new unrelated inspections');
const unknown=make(['FACT_COND_SAT_HIGH'],{},'UNKNOWN','CHECK_VERIFY_COND_AIRFLOW');
check(unknown.some(x=>x.type==='state'),'unknown operating condition is requestable');
check(unknown.some(x=>x.type==='observation'),'safe visual checks still possible with unknown state');
const off=make([],{},'OFF',null,'not_cooling');
check(off.some(x=>x.id==='cooling_demand'),'off state asks cooling demand');
check(!off.some(x=>x.id==='measure_sc'),'off state avoids charging tests');
const offNext=make([],{ 'controls:cooling_demand':'calling'},'OFF',null,'not_cooling');
check(!offNext.some(x=>x.id==='cooling_demand'),'off state advances after cooling demand recorded');
const cannot=make(['FACT_COND_SAT_HIGH'],{'condenser:coil_condition':'unknown'},'STABLE_COOLING','CHECK_VERIFY_COND_AIRFLOW');
check(!cannot.some(x=>x.id==='condenser_coil'),'unavailable test is not repeatedly requested');
const other=make(['FACT_EVAP_SH_HIGH'],{},'STABLE_COOLING','CHECK_VERIFY_EVAP_AIRFLOW');
check(other.some(x=>x.id==='evaporator_coil'),'evaporator-specific path');
const control=make(['FACT_COMPRESSOR_NOT_RUNNING'],{},'OFF','CHECK_CONTACTOR_PATH','not_cooling');
check(control.some(x=>x.id==='contactor_coil'),'electrical path');
const drier=make([],{},'STABLE_COOLING','CHECK_DRIER_DROP');
check(drier.some(x=>x.id==='measure_drier'),'drier measurement route');
const txv=make([],{},'STABLE_COOLING','CHECK_TXV_INSTALL');
check(txv.some(x=>x.id==='txv_bulb'),'TXV observation route');
const measurements=make(['FACT_EVAP_SH_HIGH'],{'evaporator:coil_condition':'clean','evaporator:fan_operation':'normal','evaporator:airflow':'normal'});
check(measurements.some(x=>x.type==='tool' || x.type==='manual'),'evaporator complete -> further test');
const factsFromObservation=buildDxKnowledgeFacts({observations:{condenser:{fan_operation:'not_running',coil_condition:'dirty'}}}).facts;
check(factsFromObservation.includes('FACT_COND_FAN_NOT_RUNNING'),'observation feeds Brain');
check(factsFromObservation.includes('FACT_COND_COIL_DIRTY'),'coil observation feeds Brain');
const roomFacts=buildDxKnowledgeFacts({observations:{controls:{cooling_demand:'calling',contactor_coil:'energized',contactor_output:'not_passing_voltage'}}}).facts;
check(roomFacts.includes('FACT_CONTACTOR_NOT_PASSING_VOLTAGE'),'control observation feeds Brain');
for(const [id,keys] of Object.entries(BRAIN_CHECK_REQUIREMENTS)){
 check(keys.every(x=>x==='operating_state' || ALL_EVIDENCE_CHECKS[x] || ['measure_sh','measure_sc','measure_drier','measure_pressures','measure_evap_air'].includes(x)),`mapping ${id} has defined requests`);
}
const source=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
for(const str of ['planNextChecks({','nextCheckId: result.nextCheck','data-next-check-problem','data-next-check-component','data-next-check-tool','data-next-check-state','renderSidePanel();','Review / change earlier answers','ALL_EVIDENCE_CHECKS'])check(source.includes(str),`app wiring ${str}`);
console.log(`v2.2.14 GENERAL NEXT CHECK: ${count} assertions PASS`);
