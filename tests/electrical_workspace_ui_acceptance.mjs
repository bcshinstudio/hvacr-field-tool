import fs from 'node:fs';
const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const wic=fs.readFileSync(new URL('../src/systems/walk_in_cooler.js',import.meta.url),'utf8');
const checks=[
 ['workspace presets', ['data-workspace-view="diagram"','data-workspace-view="work"','data-workspace-view="tools"'].every(x=>html.includes(x))],
 ['workspace CSS', ['workspace-view-diagram','workspace-view-work','workspace-view-tools'].every(x=>css.includes(x))],
 ['electrical controls UI', ['power_supply','contactor','system_controls'].every(x=>app.includes(x))],
 ['contactor evidence', ['coil_voltage','line_voltage','load_voltage','drop_l1_t1','drop_l2_t2'].every(x=>wic.includes(x))],
 ['power evidence', ['main_power_available','line_voltage_l1_l2','breaker_state','fuse_l1','fuse_l2'].every(x=>wic.includes(x))],
 ['compressor evidence', ['terminal_voltage','overload_state','winding_c_r','winding_c_s','winding_r_s'].every(x=>wic.includes(x))],
 ['controls evidence', ['cooling_demand','anti_short_cycle','hp_control','lp_control'].every(x=>wic.includes(x))],
 ['brain bridge', app.includes('Bridge structured Electrical/Controls UI evidence')]
];
let fail=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`); if(!ok) fail++;}
console.log(`ELECTRICAL + WORKSPACE UI ACCEPTANCE: ${checks.length-fail}/${checks.length} PASS`);
if(fail) process.exitCode=1;
