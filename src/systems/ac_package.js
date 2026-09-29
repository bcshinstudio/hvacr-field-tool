import { acSplit } from './ac_split.js';
export const acPackage = {
  ...acSplit,
  id:'ac_package', name:'Residential Package A/C',
  description:'Residential packaged direct-expansion air-conditioning system.',
  equipmentConfiguration:'package',
  components: acSplit.components.map(c => ({...c,
    ...(c.id==='condenser'?{label:'Condenser Section'}:{}),
    ...(c.id==='evaporator'?{label:'Evaporator / Blower Section'}:{})
  }))
};
