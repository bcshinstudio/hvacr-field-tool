import fs from 'node:fs';
const app=fs.readFileSync(new URL('../../src/app.js',import.meta.url),'utf8');
const wic=fs.readFileSync(new URL('../../src/systems/walk_in_cooler.js',import.meta.url),'utf8');
const checks=[
 ['fan Not Running option', wic.includes('"not_running"')],
 ['cooling demand bridge', app.includes('put("controls", "cooling_demand", "calling")')],
 ['condenser fan bridge', app.includes('put("condenser", "fan_operation", "not_running")')],
 ['evaporator fan bridge', app.includes('put("evaporator", "fan_operation", "normal")')],
 ['L1-T1 drop bridge', app.includes('drop_l1_t1') && app.includes('"not_passing_voltage"')],
 ['contactor System Check priority', app.includes('Contactor is energized but is not passing line voltage')]
];
let pass=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`); if(ok)pass++;}
console.log(`ELECTRICAL UI BRIDGE ACCEPTANCE: ${pass}/${checks.length} PASS`); if(pass!==checks.length)process.exitCode=1;
