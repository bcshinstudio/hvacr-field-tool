import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const src=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const rows=fs.readFileSync(new URL('../data/reference_values.csv',import.meta.url),'utf8').trim().split(/\r?\n/).slice(1).map(line=>{
  const [reference_id,application_id,parameter_id,value,unit,value_role]=line.split(',');
  return {reference_id,application_id,parameter_id,value,unit,value_role,conditions:line};
});
const start=src.indexOf('function currentApplicationId() {');
const end=src.indexOf('function formatTemperatureRange(',start);
assert(start>0&&end>start,'source resolver must remain available');
const state={system:'walk_in_cooler',refrigerant:'R404A',box:25,air:null};
const vmScope={Number,referenceValues:rows,systemSelect:{get value(){return state.system}},selectedRefrigerant:{get label(){return state.refrigerant}},
 normalizeRefrigerantName:v=>String(v??'').toUpperCase().replace(/[^A-Z0-9]/g,''),
 getNumericMeasurementValue:(name)=>name==='box_temperature'?state.box:name==='evaporator_entering_air'?state.air:null};
vm.createContext(vmScope);
vm.runInContext(src.slice(start,end)+'\nthis.applicableEvap=applicableEvaporatorReference;this.condRange=condenserReferenceTdRange;',vmScope);
const cases=[
 ['walk_in_cooler',45,35,25,45,20,40],
 ['walk_in_freezer',25,15,5,25,20,40],
 ['reach_in_refrigerator',60,40,30,50,20,40],
 ['reach_in_freezer',30,10,0,20,20,40]
];
let n=0;
for(const [system,box,expected,low,high,csLow,csHigh] of cases){
 state.system=system;state.box=box;state.air=null;
 const e=vmScope.applicableEvap();const c=vmScope.condRange();
 for(const [actual,target,label] of [[e?.center,expected,'expected SAT'],[e?.low,low,'low SAT'],[e?.high,high,'high SAT'],[c?.low,csLow,'condenser low split'],[c?.high,csHigh,'condenser high split']]){
  assert.equal(actual,target,`${system} ${label}`);n++;
 }
 state.air=box+3;
 assert.equal(vmScope.applicableEvap().center,box+3-(box-expected),`${system}: entering air takes precedence`);n++;
 state.air=null;
}
state.system='ac_split';state.box=75;
assert.equal(vmScope.applicableEvap(),null,'no invented AC evaporator TD');n++;
const c=vmScope.condRange();assert.equal(c.low,10);assert.equal(c.high,30);n+=2;
console.log(`PASS ${n} application reference integration assertions across 5 contexts`);
