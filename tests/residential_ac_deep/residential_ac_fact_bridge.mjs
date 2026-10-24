import {buildWicKnowledgeFacts as buildDxKnowledgeFacts} from '../../src/knowledge/wic_fact_adapter.js';
const tests=[
 ['thermostat Y absent',{observations:{controls:{thermostat_y:'absent'}}},'FACT_THERMOSTAT_Y_ABSENT'],
 ['transformer primary',{observations:{controls:{transformer_primary:'present'}}},'FACT_TRANSFORMER_PRIMARY_PRESENT'],
 ['transformer secondary absent',{observations:{controls:{transformer_secondary:'absent'}}},'FACT_TRANSFORMER_SECONDARY_ABSENT'],
 ['low voltage fuse',{observations:{controls:{low_voltage_fuse:'open'}}},'FACT_LOW_VOLTAGE_FUSE_OPEN'],
 ['run capacitor failed',{observations:{controls:{run_capacitor_failed:true}}},'FACT_RUN_CAPACITOR_FAILED'],
 ['compressor terminal voltage',{observations:{compressor:{terminal_voltage_present:true}}},'FACT_COMPRESSOR_TERMINAL_VOLTAGE_PRESENT'],
 ['compressor winding open',{observations:{compressor:{winding_open:true}}},'FACT_COMPRESSOR_WINDING_OPEN'],
 ['compressor grounded',{observations:{compressor:{grounded:true}}},'FACT_COMPRESSOR_GROUNDED'],
 ['condenser fan voltage',{observations:{condenser:{fan_voltage_present:true}}},'FACT_COND_FAN_VOLTAGE_PRESENT'],
 ['blower voltage',{observations:{evaporator:{fan_voltage_present:true}}},'FACT_EVAP_BLOWER_VOLTAGE_PRESENT'],
 ['dirty filter',{observations:{evaporator:{air_filter_condition:'dirty_restricted'}}},'FACT_AIR_FILTER_DIRTY'],
 ['duct restriction',{observations:{evaporator:{duct_restriction:'restriction_observed'}}},'FACT_DUCT_RESTRICTED']
];
let p=0;
for(const [name,snap,f] of tests){const r=buildDxKnowledgeFacts({measurements:{},calculated:{},references:{},configuration:[],context:{},derived:{},...snap}); const ok=r.facts.includes(f); if(ok)p++; console.log(`${ok?'PASS':'FAIL'} ${name} -> ${f}`)}
console.log(`RESIDENTIAL A/C FACT BRIDGE: ${p}/${tests.length} PASS`); if(p!==tests.length)process.exitCode=1;
