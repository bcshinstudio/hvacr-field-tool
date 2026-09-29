import { walkInCooler } from './walk_in_cooler.js';

/* Residential A/C reuses the proven DX component/electrical field model while
 * exposing an A/C-specific topology. System-specific diagnosis remains layered
 * on top of shared refrigeration/electrical evidence. */
const keep = new Set(['compressor','condenser','filter_drier','txv','evaporator']);
const baseComponents = walkInCooler.components.filter(c => keep.has(c.id)).map(c => ({...c}));
const pos = {
  compressor:{x:16,y:58,label:'Compressor'}, condenser:{x:39,y:20,label:'Outdoor Condenser'},
  filter_drier:{x:69,y:29,label:'Liquid-Line Filter Drier'}, txv:{x:80,y:58,label:'Metering Device'},
  evaporator:{x:48,y:80,label:'Indoor Evaporator'}
};
const components = baseComponents.map(c => ({...c,...pos[c.id],
  ...(c.id==='txv'?{allowedSubtypes:['txv','fixed_orifice','capillary_tube'],subtype:'txv'}:{}),
  ...(c.id==='evaporator'?{subtype:'forced_air'}:{})
}));

const fieldData = JSON.parse(JSON.stringify(walkInCooler.fieldData || {}));
fieldData.electrical = fieldData.electrical || [];
fieldData.electrical.push({id:'transformer_electrical',component:'transformer',sections:[
  {id:'transformer',label:'24-V Transformer',fields:[
    {id:'primary_voltage',label:'Primary Voltage',unit:'V',type:'number',inputType:'number',measurementCondition:'energized'},
    {id:'secondary_voltage',label:'Secondary Voltage',unit:'V',type:'number',inputType:'number',measurementCondition:'energized'},
    {id:'secondary_fuse',label:'Low-Voltage Fuse',type:'select',options:['good','open','unknown'],measurementCondition:'power_off'}
  ]}
]});
fieldData.airLocations = [
  {id:'return_air',label:'Return Air',measurements:['temperature','wet_bulb_temperature']},
  {id:'supply_air',label:'Supply Air',measurements:['temperature']},
  {id:'outdoor_air',label:'Outdoor Ambient',measurements:['temperature']}
];

const measurementPoints = (walkInCooler.measurementPoints || []).filter(p => {
  const a=p.connectionFrom, b=p.connectionTo;
  return (!a || keep.has(a)) && (!b || keep.has(b));
}).map(p => {
  if (p.id === 'condenser_outlet') return {...p, connectionFrom:'condenser', connectionTo:'filter_drier'};
  return {...p};
});

export const acSplit = {
  ...walkInCooler,
  id:'ac_split', name:'Residential Split A/C',
  description:'Residential split direct-expansion air-conditioning system.',
  components, fieldData, measurementPoints,
  topology:{type:'single_circuit',paths:[{id:'main_refrigerant_circuit',closedLoop:true,
    components:['compressor','condenser','filter_drier','txv','evaporator'],
    sections:[{id:'discharge',from:'compressor',until:'condenser'},{id:'liquid',from:'condenser',until:'txv'},
      {id:'expansion',from:'txv',until:'evaporator'},{id:'suction',from:'evaporator',until:'compressor'}]}]},
  residentialAc:true, equipmentConfiguration:'split'
};
