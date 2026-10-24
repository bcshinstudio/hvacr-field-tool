import fs from 'node:fs';
const app=fs.readFileSync(new URL('../../src/app.js',import.meta.url),'utf8');
const ac=fs.readFileSync(new URL('../../src/systems/ac_split.js',import.meta.url),'utf8');
const checks=[
 ['AC application scope',app.includes('application: currentApplicationId()')],
 ['thermostat Y UI',ac.includes("id:'thermostat_y_present'")],
 ['Y-C voltage UI',ac.includes("id:'thermostat_y_voltage'")],
 ['filter UI',ac.includes("id:'air_filter_condition'")],
 ['duct restriction UI',ac.includes("id:'duct_restriction'")],
 ['transformer UI',ac.includes("id:'transformer_electrical'")],
 ['fixed orifice config bridge',app.includes('FIXED_ORIFICE')],
 ['TXV config bridge',app.includes('["TXV"]')],
 ['capacitor evidence bridge',app.includes('run_capacitor_failed')],
 ['compressor ground bridge',app.includes('"grounded",true')]
]; let p=0; for(const [n,ok] of checks){if(ok)p++;console.log(`${ok?'PASS':'FAIL'} ${n}`)} console.log(`RESIDENTIAL A/C UI/BRIDGE ACCEPTANCE: ${p}/${checks.length} PASS`);if(p!==checks.length)process.exitCode=1;
