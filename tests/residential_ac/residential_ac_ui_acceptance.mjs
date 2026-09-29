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
 ['AC brain enabled',app.includes('["walk_in_cooler","ac_split","ac_package"].includes(currentSystem?.id)')],
 ['AC does not inherit WIC SH fallback',app.includes('currentSystem?.id === "walk_in_cooler" ? (knowledgeHub?.application?.reference_profiles?.evaporatorSuperheat')],
 ['workspace presets',app.includes('workspace') || html.includes('workspace')]
];
for(const [n,p] of checks) console.log(`${p?'PASS':'FAIL'} ${n}`);
const pass=checks.filter(x=>x[1]).length; console.log(`RESIDENTIAL A/C UI ACCEPTANCE: ${pass}/${checks.length} PASS`); if(pass!==checks.length)process.exitCode=1;
