import { walkInCooler } from './walk_in_cooler.js';

/* Reach-in, capillary-tube DX refrigeration. Reuse shared component and
 * measurement semantics, but do not inherit a receiver, TXV, pump-down
 * solenoid, or sight glass as installed equipment. These are defaults, not
 * assertions about every manufacturer's reach-in design. */
const ids = ['compressor', 'condenser', 'filter_drier', 'txv', 'evaporator'];
const keep = new Set(ids);
const positions = {
  compressor: {x:16,y:58,label:'Compressor'},
  condenser: {x:40,y:20,label:'Air-Cooled Condenser'},
  filter_drier: {x:71,y:32,label:'Filter Drier'},
  txv: {x:80,y:62,label:'Capillary Tube'},
  evaporator: {x:45,y:80,label:'Cabinet Evaporator'}
};

function createReachIn(id, name, temperatureClass, defaultRefrigerant) {
  const components = walkInCooler.components
    .filter(c => keep.has(c.id))
    .map(c => ({...c,...positions[c.id],
      ...(c.id === 'txv' ? {
        subtype:'capillary_tube', allowedSubtypes:['capillary_tube'],
        required:true, removable:false
      } : {}),
      ...(c.id === 'condenser' ? {subtype:'air_cooled'} : {})
    }));

  // Clone to prevent changes in one system affecting another system's fields.
  const fieldData = structuredClone(walkInCooler.fieldData || {});
  // Preserve field measurement locations even when the walk-in source
  // topology routes them through optional components absent on reach-ins.
  const remap = {
    condenser_outlet:['condenser','filter_drier'],
    filter_drier_inlet:['condenser','filter_drier'],
    filter_drier_outlet:['filter_drier','txv'],
    metering_device_inlet:['filter_drier','txv']
  };
  const measurementPoints = (walkInCooler.measurementPoints || [])
    .filter(p => remap[p.id] ||
      ((!p.connectionFrom || keep.has(p.connectionFrom)) &&
       (!p.connectionTo || keep.has(p.connectionTo))))
    .map(p => remap[p.id] ? {...p,
      connectionFrom:remap[p.id][0], connectionTo:remap[p.id][1]} : {...p});

  return {
    ...walkInCooler, id, name,
    description:`${temperatureClass} reach-in cabinet with a capillary-tube metering device. Equipment-specific references take priority.`,
    components, fieldData, measurementPoints,
    defaultRefrigerant, temperatureClass, equipmentConfiguration:'reach_in',
    meteringDeviceType:'capillary_tube',
    topology: {type:'single_circuit',paths:[{
      id:'main_refrigerant_circuit',closedLoop:true,
      components:ids,
      sections:[
        {id:'discharge',from:'compressor',until:'condenser'},
        {id:'liquid',from:'condenser',until:'txv'},
        {id:'expansion',from:'txv',until:'evaporator'},
        {id:'suction',from:'evaporator',until:'compressor'}
      ]
    }]},
    connections:[
      {from:'compressor',to:'condenser',section:'discharge'},
      {from:'condenser',to:'filter_drier',section:'liquid'},
      {from:'filter_drier',to:'txv',section:'liquid'},
      {from:'txv',to:'evaporator',section:'expansion'},
      {from:'evaporator',to:'compressor',section:'suction'}
    ]
  };
}

export const reachInRefrigerator = createReachIn('reach_in_refrigerator',
  'Reach-In Refrigerator','Medium-temperature','R134a');
export const reachInFreezer = createReachIn('reach_in_freezer',
  'Reach-In Freezer','Low-temperature','R404A');
