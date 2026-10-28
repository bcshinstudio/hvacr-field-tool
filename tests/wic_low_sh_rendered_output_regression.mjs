import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const start=source.indexOf('function buildCalculationsTool() {');const end=source.indexOf('\nfunction normalizeWicOperatingState',start);assert(start>=0&&end>start);
const app=JSON.parse(fs.readFileSync(new URL('../data/knowledge/applications/walk_in_cooler.json',import.meta.url)));
const readings={'box_temperature:temperature':35,'evaporator_outlet:pressure':62,'evaporator_outlet:temperature':25,'compressor_discharge:pressure':333,'condenser_outlet:temperature':115,'condenser_entering_air:temperature':95};
const context={Number,Math,Set,Map,Object,Array,String,Boolean,console,
 getNumericMeasurementValue:(p,u)=> readings[`${p}:${u}`] ?? null,
 evaporatorReferenceTd:()=>({value:10,row:{value_role:'SCREENING_REFERENCE'}}),
 applicableEvaporatorReference:()=>({center:25,low:15,high:35}),
 condenserReferenceTdRange:()=>({low:20,high:40}),
 resolveEvaporatingPressure:({evaporatorOutletPressure})=>({pressure:evaporatorOutletPressure,location:'Evaporator Outlet',approximate:false}),
 resolveHighSidePressure:({compressorDischargePressure})=>({pressure:compressorDischargePressure,location:'Discharge',approximate:true,spreadPsig:null}),
 saturationTemperatureFromPressure:(pressure)=>pressure===62?24.9:124.9,
 formatCalculatedTemperature:v=>v===null?'—':`${Number(v).toFixed(1)}°F`,
 formatCalculatedRatio:v=>v===null?'—':String(v),formatTemperatureRange:(a,b)=>`${a}–${b}°F`,
 currentApplicationId:()=> 'APP_WIC',currentSystem:{id:'walk_in_cooler',components:[{id:'txv',subtype:'txv'},{id:'receiver'}]},
 knowledgeHub:{application:app,applications:{APP_WIC:app}},normalizeWicOperatingState:()=> 'UNKNOWN',wicDiagnosticContext:{operatingState:'unknown'},
 selectedRefrigerant:{label:'R-404A',glide:false},isComponentInstalled:()=>true,
 atmosphericPressurePsia:14.7};
vm.createContext(context);vm.runInContext(source.slice(start,end)+'\nthis.build=buildCalculationsTool;',context);
const html=context.build();
function strip(h){return h.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ')};
const visible=strip(html);
assert.match(visible,/Superheat\s+0\.1°F\s+LOW/);
assert.match(visible,/Reference SAT\s+25\.0°F/);
assert(!/Subcooling \(Estimated\)\s+9\.9°F\s+(LOW|HIGH)/.test(visible),'receiver subcooling remains unclassified');
console.log('PASS WIC unknown-state calculated low superheat / receiver subcooling unclassified');
