// Measurement interpretation layer 1.0.
// Preserves measured/calculated values even when no defensible reference exists.
export const MEASUREMENT_STATE_VERSION="1.0.0";
const finite=v=>typeof v==="number"&&Number.isFinite(v);
export function interpretMeasurement({id,value,unit,reference=null,referenceSource=null}){
  const out={id,value:finite(value)?value:null,unit,classification:"UNCLASSIFIED",reference:null,referenceSource:referenceSource||null};
  if(!finite(value))return{...out,classification:"MISSING"};
  if(!reference)return out;
  const low=finite(reference.low)?reference.low:null,high=finite(reference.high)?reference.high:null;
  out.reference={low,high,unit:reference.unit||unit};
  if(low!==null&&value<low)out.classification="LOW";
  else if(high!==null&&value>high)out.classification="HIGH";
  else if(low!==null||high!==null)out.classification="WITHIN_REFERENCE";
  return out;
}
