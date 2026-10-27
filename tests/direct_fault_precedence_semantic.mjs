import assert from 'node:assert/strict';
import {planNextCheck} from '../src/diagnostics/next_check_planner.js';

// Semantic regression: verified direct faults outrank unknown state and
// unrelated measurements. Do not require obsolete UI/tool wording.
const directFacts = [
  ['FACT_MAIN_POWER_NOT_AVAILABLE', /power|supply/i],
  ['FACT_COND_FAN_NOT_RUNNING', /fan/i],
  ['FACT_COND_COIL_DIRTY', /coil|obstruction/i],
  ['FACT_EVAP_FAN_NOT_RUNNING', /evaporator fan/i],
  ['FACT_DRIER_TEMP_DROP', /filter.drier|restriction/i],
  ['FACT_CONTACTOR_NOT_PASSING_VOLTAGE', /contactor/i],
  ['FACT_COMPRESSOR_START_WINDING_OPEN', /winding/i]
];
let n = 0;
for (const [fact, expected] of directFacts) {
  for (const operatingState of ['UNKNOWN', 'STABLE_COOLING']) {
    const result = planNextCheck({facts:[fact],operatingState});
    assert.equal(result?.type,'action', `${fact} (${operatingState}) must prioritize direct evidence`);
    assert.match(result.instruction, expected);
    n += 2;
  }
}
const unknown = planNextCheck({facts:[],operatingState:'UNKNOWN'});
assert.equal(unknown?.type,'state'); n++;
const highHead = planNextCheck({facts:['FACT_COND_SAT_HIGH'],operatingState:'STABLE_COOLING'});
assert.equal(highHead?.id,'condenser_coil'); n++;
console.log(`DIRECT-FAULT PRECEDENCE SEMANTIC: ${n} assertions PASS`);
