import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const start=source.indexOf('function buildCalculationsTool() {');const end=source.indexOf('\nfunction normalizeWicOperatingState',start);assert(start>=0&&end>start);
const app=JSON.parse(fs.readFileSync(new URL('../data/knowledge/applications/app_ric.json',import.meta.url)));
const readings={'box_temperature:temperature':50,'evaporator_outlet:pressure':12,'evaporator_outlet:temperature':45,'compressor_discharge:pressure':124,'condenser_outlet:temperature':75,'condenser_entering_air:temperature':85};
const context={Number,Math,Set,Map,Object,Array,String,Boolean,console,
 getNumericMeasurementValue:(p,u)=> readings[`${p}:${u}`] ?? null,
 evaporatorReferenceTd:()=>({value:20,row:{value_role:'SCREENING_REFERENCE'}}),
 applicableEvaporatorReference:()=>({center:30,low:20,high:40}),
 condenserReferenceTdRange:()=>({low:20,high:40}),
 resolveEvaporatingPressure:({evaporatorOutletPressure})=>({pressure:evaporatorOutletPressure,location:'Evaporator Outlet',approximate:false}),
 resolveHighSidePressure:({compressorDischargePressure})=>({pressure:compressorDischargePressure,location:'Discharge',approximate:true,spreadPsig:null}),
 saturationTemperatureFromPressure:(pressure)=>pressure===12?10.2:99.9,
 formatCalculatedTemperature:v=>v===null?'—':`${Number(v).toFixed(1)}°F`,
 formatCalculatedRatio:v=>v===null?'—':String(v),formatTemperatureRange:(a,b)=>`${a}–${b}°F`,
 currentApplicationId:()=> 'APP_RIC',currentSystem:{id:'reach_in_refrigerator',components:[{id:'txv',subtype:'capillary_tube'}]},
 knowledgeHub:{application:app,applications:{APP_RIC:app}},normalizeWicOperatingState:()=> 'UNKNOWN',wicDiagnosticContext:{operatingState:'unknown'},
 selectedRefrigerant:{label:'R-134a',glide:false},isComponentInstalled:()=>true,
 atmosphericPressurePsia:14.7};
vm.createContext(context);vm.runInContext(source.slice(start,end)+'\nthis.build=buildCalculationsTool;',context);
const html=context.build();
function strip(h){return h.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')};
const visible=strip(html);
assert.match(visible,/Superheat\s+34\.8°F\s+HIGH/);
assert.match(visible,/Subcooling \(Estimated\)\s+24\.9°F\s+HIGH/);
assert.match(visible,/Reference SAT\s+30\.0°F/);
console.log('PASS rendered calculations HIGH superheat and HIGH estimated subcooling for APP_RIC');
