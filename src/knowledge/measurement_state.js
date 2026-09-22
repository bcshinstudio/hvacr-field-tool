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

// Reference precedence is explicit so generic fallbacks cannot override equipment data.
// A reference marked applicable:false is never used for classification.
export function selectApplicableReference(references=[]){
  const rank={MODEL_SPECIFIC:5,EQUIPMENT_MANUFACTURER:4,COMPONENT_MANUFACTURER:3,APPLICATION_DIAGNOSTIC:2,GENERIC_FIELD:1};
  return [...references].filter(r=>r && r.applicable!==false && Number.isFinite(r.low) && Number.isFinite(r.high))
    .sort((a,b)=>(rank[b.level]||0)-(rank[a.level]||0))[0]||null;
}
