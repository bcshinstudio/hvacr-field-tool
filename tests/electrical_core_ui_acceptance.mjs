import fs from 'node:fs';
import { buildWicKnowledgeFacts } from '../src/knowledge/wic_fact_adapter.js';

const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const wic=fs.readFileSync(new URL('../src/systems/walk_in_cooler.js',import.meta.url),'utf8');
const required=[
  'Cooling Demand','Outdoor / Condensing Unit Line Power','Contactor Coil Voltage',
  'Contactor Physical State','Contactor Line-Side Voltage (L1-L2)',
  'Contactor Load-Side Voltage (T1-T2)','Voltage Drop Across Suspect Contact',
  'Compressor Terminal Voltage'
];
for(const label of required) if(!app.includes(label)) throw new Error(`Missing UI evidence field: ${label}`);
for(const id of ['winding_c_r_continuity','winding_c_s_continuity','winding_r_s_continuity'])
  if(!wic.includes(id)) throw new Error(`Missing compressor winding continuity field: ${id}`);

const facts=buildWicKnowledgeFacts({observations:{controls:{cooling_demand:'calling',contactor_coil:'energized',contactor_physical_state:'closed',contactor_output:'not_passing_voltage',compressor_terminal_power:'absent'}}}).facts;
for(const fact of ['FACT_COOLING_DEMAND_PRESENT','FACT_CONTACTOR_COIL_ENERGIZED','FACT_CONTACTOR_NOT_PASSING_VOLTAGE','FACT_COMPRESSOR_TERMINAL_VOLTAGE_ABSENT'])
  if(!facts.includes(fact)) throw new Error(`Fact adapter missing: ${fact}`);
console.log('ELECTRICAL CORE UI ACCEPTANCE: PASS');
