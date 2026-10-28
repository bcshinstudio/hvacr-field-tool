import fs from 'node:fs';
const app=fs.readFileSync(new URL('../../src/app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../../index.html',import.meta.url),'utf8');
const split=fs.readFileSync(new URL('../../src/systems/ac_split.js',import.meta.url),'utf8');
const pack=fs.readFileSync(new URL('../../src/systems/ac_package.js',import.meta.url),'utf8');
const checks=[
 ['split selector',html.includes('value="ac_split"')],['package selector',html.includes('value="ac_package"')],
 ['split profile',split.includes("residentialAc:true")],['package profile',pack.includes("equipmentConfiguration:'package'")],
 ['transformer UI',split.includes("24-V Transformer")&&app.includes('id:"transformer"')],
 ['shared electrical controls',app.includes('System Controls / Safeties')&&app.includes('Contactor')],
 ['AC brain enabled',app.includes('["walk_in_cooler","walk_in_freezer","ac_split","ac_package","reach_in_refrigerator","reach_in_freezer"].includes(currentSystem?.id)')],
 ['AC does not inherit WIC SH fallback',app.includes('["walk_in_cooler","walk_in_freezer"].includes(currentSystem?.id)') && app.includes('superheatRange || (') && app.includes('currentSystem?.components?.some(c => c.id === "txv"')],
 ['workspace presets',app.includes('workspace') || html.includes('workspace')]
];
for(const [n,p] of checks) console.log(`${p?'PASS':'FAIL'} ${n}`);
const pass=checks.filter(x=>x[1]).length; console.log(`RESIDENTIAL A/C UI ACCEPTANCE: ${pass}/${checks.length} PASS`); if(pass!==checks.length)process.exitCode=1;
