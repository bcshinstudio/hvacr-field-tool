import assert from 'node:assert/strict';
import {walkInCooler} from '../src/systems/walk_in_cooler.js';
import {acSplit} from '../src/systems/ac_split.js';
import {acPackage} from '../src/systems/ac_package.js';
import {reachInRefrigerator,reachInFreezer} from '../src/systems/reach_in.js';
for(const [system,id,refrigerant] of [
  [reachInRefrigerator,'reach_in_refrigerator','R134a'],
  [reachInFreezer,'reach_in_freezer','R404A']]) {
  assert.equal(system.id,id);
  assert.equal(system.defaultRefrigerant,refrigerant);
  assert.equal(system.components.find(c=>c.id==='txv')?.subtype,'capillary_tube');
  assert.equal(system.components.find(c=>c.id==='txv')?.required,true);
  assert.equal(system.components.some(c=>['receiver','solenoid','sight_glass'].includes(c.id)),false);
  assert.deepEqual(system.topology.paths[0].components,
    ['compressor','condenser','filter_drier','txv','evaporator']);
  assert(system.measurementPoints.some(p=>p.id==='compressor_suction'));
  assert(system.measurementPoints.some(p=>p.id==='condenser_outlet'));
}
assert.equal(walkInCooler.components.find(c=>c.id==='txv')?.subtype,'txv');
assert.equal(acSplit.id,'ac_split');
assert.equal(acPackage.id,'ac_package');
console.log('REACH-IN PROFILE VALIDATION: PASS (2 profiles, shared system regression checks)');
