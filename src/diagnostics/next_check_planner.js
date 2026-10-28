/*
 * Evidence-driven next-check planner.
 * All equipment types use this registry. It does not diagnose faults;
 * it selects the next recordable evidence based on the existing Brain facts,
 * candidate causes and operating state.
 */
export const EVIDENCE_CHECKS = Object.freeze({
  cooling_demand: {
    component:"controls", field:"cooling_demand", label:"Cooling call",
    instruction:"Check whether the thermostat/controller is calling for cooling.",
    options:[["calling","Cooling requested"],["not_calling","No cooling request"],["unknown","Cannot determine"]]
  },
  compressor_running: {
    component:"compressor",field:"running_state",label:"Compressor operation",
    instruction:"Observe whether the compressor runs when cooling is requested. Do not open electrical enclosures.",
    options:[["running","Running"],["off","Not running"],["cycling","Cycling"],["unknown","Cannot determine"]]
  },
  condenser_coil: {
    component:"condenser",field:"coil_condition",label:"Condenser coil",
    instruction:"Visually inspect the condenser coil for dirt or blockage, keeping clear of the fan.",
    options:[["clean","Clean"],["dirty","Dirty"],["blocked","Blocked"],["damaged","Damaged"],["unknown","Cannot determine"]]
  },
  condenser_fan: {
    component:"condenser",field:"fan_operation",label:"Condenser fan",
    instruction:"Observe condenser fan operation during a cooling call, from a safe position.",
    options:[["normal","Running normally"],["not_running","Not running"],["intermittent","Intermittent"],["unknown","Cannot determine"]]
  },
  condenser_airflow: {
    component:"condenser",field:"airflow",label:"Condenser airflow",
    instruction:"Inspect for blocked intake/discharge paths and verify adequate airflow.",
    options:[["normal","Normal"],["low","Low"],["blocked","Blocked"],["unknown","Cannot determine"]]
  },
  condenser_recirculation: {
    component:"condenser",field:"air_recirculation",label:"Condenser hot-air recirculation",
    instruction:"Check whether hot discharge air is being drawn back into the condenser.",
    options:[["no","No recirculation"],["yes","Hot air recirculating"],["unknown","Cannot determine"]]
  },
  evaporator_coil: {
    component:"evaporator",field:"coil_condition",label:"Evaporator coil",
    instruction:"Inspect the evaporator for ice buildup, dirt, or airflow blockage.",
    options:[["clean","Clean"],["dirty","Dirty"],["partially_iced","Partially iced"],["fully_iced","Fully iced"],["unknown","Cannot determine"]]
  },
  evaporator_fan: {
    component:"evaporator",field:"fan_operation",label:"Evaporator fan",
    instruction:"Observe evaporator fan operation while cooling is active; account for fan delay/defrost.",
    options:[["normal","Running normally"],["not_running","Not running"],["intermittent","Intermittent"],["unknown","Cannot determine"]]
  },
  evaporator_airflow: {
    component:"evaporator",field:"airflow",label:"Evaporator airflow",
    instruction:"Inspect supply/return airflow, obstructions, and the coil airflow path.",
    options:[["normal","Normal"],["low","Low"],["blocked","Blocked"],["unknown","Cannot determine"]]
  },
  sight_glass: {
    component:"sight_glass",field:"refrigerant_appearance",label:"Sight glass",
    instruction:"Observe the sight glass during stable operation, if installed. Bubbles alone do not prove undercharge.",
    options:[["clear","Clear"],["bubbles","Bubbles"],["flashing","Flashing"],["unknown","Cannot determine"]]
  },
  txv_bulb: {
    component:"txv",field:"bulb_contact",label:"TXV bulb mounting",
    instruction:"Inspect TXV sensing bulb contact and secure mounting on the suction line.",
    options:[["good","Secure contact"],["poor","Poor contact"],["unknown","Cannot determine"]]
  },
  room_load: {
    component:"room",field:"warm_product_load",label:"Warm product load",
    instruction:"Check for recently loaded warm product or unusually high refrigeration load.",
    options:[["normal","Normal load"],["large_warm_load","Large warm load"],["unknown","Cannot determine"]]
  },
  door: {
    component:"room",field:"door_infiltration",label:"Door infiltration",
    instruction:"Inspect door closure, gaskets, and warm-air infiltration.",
    options:[["normal_sealed","Sealed"],["confirmed_infiltration","Infiltration observed"],["unknown","Cannot determine"]]
  },
  filter_drier: {
    component:"filter_drier",field:"outlet_sweating",label:"Filter-drier observation",
    instruction:"Inspect for a temperature difference or sweating/frost at the drier; confirm with inlet/outlet temperature measurements.",
    options:[["yes","Outlet sweating/frosting"],["no","No visible change"],["unknown","Cannot determine"]]
  },
  hp_safety: {
    component:"controls",field:"hp_safety",label:"High-pressure safety",
    instruction:"Check the high-pressure safety state using the appropriate safe control test.",
    options:[["closed_normal","Closed / normal"],["open_tripped","Open / tripped"],["unknown","Cannot determine"]]
  },
  lp_control: {
    component:"controls",field:"lp_control",label:"Low-pressure control",
    instruction:"Check the low-pressure control state and whether the system is in pump-down.",
    options:[["closed","Closed"],["open","Open"],["unknown","Cannot determine"]]
  },
  contactor_coil: {
    component:"controls",field:"contactor_coil",label:"Contactor coil",
    instruction:"Qualified personnel: check whether the contactor coil is energized during a cooling call.",
    options:[["energized","Energized"],["not_energized","Not energized"],["unknown","Cannot determine"]]
  },
  contactor_output: {
    component:"controls",field:"contactor_output",label:"Contactor load side",
    instruction:"Qualified personnel: verify whether the contactor passes the required line voltage.",
    options:[["passes_voltage","Passes voltage"],["not_passing_voltage","Not passing voltage"],["unknown","Cannot determine"]]
  }
});


/**
 * One evidence vocabulary, many tests. A recommendation is only "answerable"
 * when its field is wired to the live knowledge snapshot. Otherwise the UI
 * links to a real tool or explicitly marks a manual service test.
 */
export const BRAIN_CHECK_REQUIREMENTS = Object.freeze({
  CHECK_VERIFY_COND_AIRFLOW: ["condenser_coil","condenser_fan","condenser_airflow","condenser_recirculation"],
  CHECK_VERIFY_EVAP_AIRFLOW: ["evaporator_coil","evaporator_fan","evaporator_airflow","measure_evap_air"],
  CHECK_MEASURE_SH: ["measure_sh"],
  CHECK_MEASURE_SC: ["measure_sc"],
  CHECK_DRIER_DROP: ["measure_drier"],
  CHECK_LEAK: ["leak_evidence"],
  CHECK_TXV_INSTALL: ["txv_bulb","txv_equalizer"],
  CHECK_DEFROST: ["defrost_state"],
  CHECK_LOAD_INFILTRATION: ["room_load","door"],
  CHECK_SOLENOID: ["solenoid_command","solenoid_flow"],
  CHECK_PRESSURE_CONTROLS: ["hp_safety","lp_control"],
  CHECK_CONTROLLER_SENSOR: ["sensor_reference"],
  CHECK_COMPRESSOR_PERFORMANCE: ["compressor_running","measure_pressures"],
  CHECK_TXV_LIQUID_CONDITION: ["sight_glass","measure_sc"],
  CHECK_TXV_RESPONSE: ["txv_response"],
  CHECK_TXV_INLET: ["txv_inlet"],
  CHECK_DEFROST_HEAT: ["defrost_state"],
  CHECK_DEFROST_TERMINATION: ["defrost_state"],
  CHECK_HEAD_PRESSURE_CONTROL: ["measure_pressures","hp_safety"],
  CHECK_COMPRESSOR_PUMPING: ["measure_pressures"],
  CHECK_ESTABLISH_OPERATING_STATE: ["operating_state","cooling_demand","compressor_running"],
  CHECK_DRAIN_REFREEZE: ["defrost_state"],
  CHECK_COMPRESSOR_TERMINAL_VOLTAGE: ["contactor_output","compressor_running"],
  CHECK_CONTACTOR_PATH: ["contactor_coil","contactor_output"],
  CHECK_SENSOR_REFERENCE: ["sensor_reference"],
  CHECK_DOOR_LOAD: ["room_load","door"],
  CHECK_SOLENOID_SEQUENCE: ["solenoid_command","solenoid_flow"],
  CHECK_CAPACITY_VS_LOAD: ["room_load","door","measure_pressures"],
  CHECK_WIRING_DIAGRAM_CONTROL_STATE: ["cooling_demand","contactor_coil"],
  CHECK_FUSE_DOWNSTREAM_CAUSE: ["contactor_output"],
  CHECK_HEAD_CONTROL_CONFIGURATION: ["measure_pressures"],
  CHECK_COMPRESSOR_DIFFERENTIAL: ["measure_pressures"],
  CHECK_SOLENOID_OPENING: ["solenoid_command","solenoid_flow"],
  CHECK_VERIFY_EVAP_PRESSURE_MEASUREMENT: ["measure_pressures"],
  CHECK_COMPRESSOR_CONTEXT: ["compressor_running","cooling_demand"],
  CHECK_OVERHEAT_CAUSE: ["compressor_running","evaporator_airflow"]
});
const EXTRA_CHECKS = Object.freeze({
  sensor_reference: {component:"room",field:"sensor_reference",label:"Controller sensor accuracy",
    instruction:"Compare the controller sensor with a trusted thermometer at the sensing location.",
    options:[["agrees","Agrees"],["disagrees","Disagrees"],["unknown","Cannot determine"]]},
  solenoid_command: {component:"controls",field:"solenoid_command",label:"Liquid solenoid command",
    instruction:"Check whether the controller is commanding the liquid solenoid open or closed.",
    options:[["open","Commanded open"],["closed","Commanded closed"],["unknown","Cannot determine"]]},
  solenoid_flow: {component:"controls",field:"solenoid_flow",label:"Liquid solenoid flow",
    instruction:"Check whether refrigerant flow continues through the liquid solenoid.",
    options:[["flowing","Flowing"],["not_flowing","Not flowing"],["unknown","Cannot determine"]]},
  txv_equalizer: {component:"txv",field:"equalizer_condition",label:"TXV equalizer",
    instruction:"Inspect the external equalizer connection and location if installed.",
    options:[["normal","Normal"],["issue_observed","Problem observed"],["unknown","Cannot determine"]]},
  txv_inlet: {component:"txv",field:"inlet_condition",label:"TXV inlet",
    instruction:"Inspect for a restriction at the TXV inlet/strainer when accessible.",
    options:[["normal","Normal"],["restriction_observed","Restriction observed"],["unknown","Cannot determine"]]},
  txv_response: {component:"txv",field:"response_to_load",label:"TXV response",
    instruction:"Qualified personnel: assess TXV response using an approved manufacturer procedure.",
    options:[["responds","Responds"],["does_not_respond","Does not respond"],["unknown","Cannot determine"]]},
  leak_evidence: {component:"compressor",field:"oil_evidence",label:"Leak/oil evidence",
    instruction:"Inspect accessible joints and components for oil staining; confirm leaks with a suitable leak detector.",
    options:[["absent","No oil staining"],["present","Oil staining observed"],["unknown","Cannot determine"]]},
  defrost_state: {component:"controls",field:"defrost_status",label:"Defrost operation",
    instruction:"Check defrost sequence using the manufacturer's controls and procedures.",
    options:[["normal","Normal"],["fault","Fault observed"],["unknown","Cannot determine"]]}
});
export const ALL_EVIDENCE_CHECKS = Object.freeze({...EVIDENCE_CHECKS,...EXTRA_CHECKS});
const REGISTRY = ALL_EVIDENCE_CHECKS;
const MEASUREMENTS = Object.freeze({
  measure_sh: {type:"tool",tool:"measurements",label:"Verify evaporator superheat",
    instruction:"Enter suction/evaporator pressure and suction-line temperature at known locations; use the correct refrigerant."},
  measure_sc: {type:"tool",tool:"measurements",label:"Verify subcooling",
    instruction:"Enter condenser/liquid pressure and liquid-line temperature at matching locations. If estimated from discharge pressure, treat charge interpretation as provisional."},
  measure_evap_air: {type:"tool",tool:"measurements",label:"Evaporator entering/leaving air temperatures",
    instruction:"Measure and enter entering-air and leaving-air temperatures at the evaporator under stable airflow. Compare the air temperature difference with the equipment design; this alone does not prove a refrigerant fault."},
  measure_drier: {type:"tool",tool:"measurements",label:"Filter-drier temperature difference",
    instruction:"Measure and enter filter-drier inlet and outlet temperatures during stable flow. A meaningful drop can indicate a restriction."},
  measure_pressures: {type:"tool",tool:"measurements",label:"Verify operating pressures",
    instruction:"Record stabilized suction and discharge pressures and operating temperatures, including the measurement locations."}
});
const has = (set, ...keys) => keys.some(key=>set.has(key));
const present = value => value !== null && value !== undefined && String(value).trim() !== "";
const safeSet = arr => new Set((arr||[]).filter(Boolean));
const normalized = v => String(v||"UNKNOWN").toUpperCase();
const isStable = state => state==="STABLE_COOLING";
const action = (instruction,why) => ({type:"action",label:"Correct and retest",instruction,why,priority:120});
function directActions(facts) {
  const actions=[];
  const push=(fact,instruction)=>{if(facts.has(fact))actions.push(action(instruction,"Observed fault: "+fact));};
  push("FACT_MAIN_POWER_NOT_AVAILABLE","Incoming line power is absent. Qualified personnel: verify disconnect, supply and fuses; restore safe power before downstream testing.");
  push("FACT_COND_FAN_NOT_RUNNING","Condenser fan is observed not running. Check fan power/control and correct the confirmed fault; then remeasure.");
  push("FACT_COND_COIL_DIRTY","Condenser coil is observed dirty or blocked. Correct the obstruction, then stabilize and remeasure.");
  push("FACT_EVAP_FAN_NOT_RUNNING","Evaporator fan is observed not running. Account for fan delay/defrost; check fan power and controls.");
  push("FACT_DRIER_TEMP_DROP","Filter-drier temperature drop is observed. Verify the restriction, service using proper recovery procedures, and retest.");
  push("FACT_CONTACTOR_NOT_PASSING_VOLTAGE","Contactor is not passing voltage. Qualified personnel: verify coil/load voltage and contacts before replacement.");
  push("FACT_COMPRESSOR_START_WINDING_OPEN","Suspected open compressor winding. With power isolated, verify isolated terminal resistance and ground tests.");
  return actions;
}
const stateQuestion={
 type:"state",id:"operating_state",label:"Operating condition (not the customer complaint)",
 instruction:"Is the compressor running with stabilized readings, off, cycling, or in a transitional sequence? 'Stable cooling' does not mean the box is cooling adequately.",
 options:[["unknown","Not established"],["stable_cooling","Running with stabilized readings"],["off","Compressor off / no cooling"],["startup","Just started"],["pulldown","Pull-down"],["satisfied","Satisfied / normal stop"],["pump_down","Pump-down"],["defrost","Defrost"],["post_defrost","Post-defrost"]],
 why:"Pressure/SH/SC interpretation depends on operating condition."
};
const groups = {
 condenser:["condenser_coil","condenser_fan","condenser_airflow","condenser_recirculation"],
 evaporator:["evaporator_coil","evaporator_fan","evaporator_airflow"],
 controls:["cooling_demand","compressor_running","contactor_coil","contactor_output","hp_safety","lp_control"],
 room:["room_load","door","sensor_reference"]
};
const checkGroup = {
 CHECK_VERIFY_COND_AIRFLOW:"condenser",CHECK_VERIFY_EVAP_AIRFLOW:"evaporator",
 CHECK_CONTACTOR_PATH:"controls",CHECK_COMPRESSOR_CONTEXT:"controls",
 CHECK_LOAD_INFILTRATION:"room",CHECK_DOOR_LOAD:"room"
};
function derivedPriority(id,fs,cs,brainCheck) {
  let score=20;
  if (id==="operating_state") score=70;
  if (groups.condenser.includes(id) && (has(fs,"FACT_COND_SAT_HIGH","FACT_COND_SAT_LOW","FACT_SUBCOOLING_HIGH") || [...cs].some(c=>/COND|OVERCHARGE|NONCONDENS|HIGH_AMBIENT/.test(c)))) score=84;
  if (groups.evaporator.includes(id) && (has(fs,"FACT_EVAP_SAT_LOW","FACT_EVAP_SAT_HIGH","FACT_EVAP_SH_HIGH","FACT_EVAP_SH_LOW") || [...cs].some(c=>/EVAP|UNDERFEED|TXV|LOW_REFRIGERANT/.test(c)))) score=82;
  if (groups.controls.includes(id) && has(fs,"FACT_COOLING_DEMAND_PRESENT","FACT_COMPRESSOR_NOT_RUNNING","FACT_HP_SAFETY_OPEN","FACT_LP_CONTROL_OPEN")) score=90;
  if (groups.room.includes(id) && has(fs,"FACT_WARM_PRODUCT_LOAD_CONFIRMED","FACT_DOOR_OPEN_OR_LEAKING","FACT_SENSOR_DISAGREES_REFERENCE")) score=80;
  // If core refrigeration indicators are reference-normal, prioritize actual
  // demand, room load and infiltration rather than inventing a feed fault.
  if (has(fs,"FACT_CORE_REFRIGERATION_VALUES_WITHIN_REFERENCE","FACT_OPERATING_PATTERN_WITHIN_REFERENCE")) {
    if (groups.room.includes(id)) score=Math.max(score,94);
    if (id==="cooling_demand" || id==="compressor_running") score=Math.max(score,88);
  }
  if (brainCheck && (BRAIN_CHECK_REQUIREMENTS[brainCheck]||[]).includes(id)) score=Math.max(110,score+38);
  if (brainCheck && groups[checkGroup[brainCheck]]?.includes(id)) score+=22;
  return score;
}
function measurementSatisfied(id,facts,measurements) {
  if(id==="measure_sh") return has(facts,"FACT_EVAP_SH_MEASURED","FACT_EVAP_SH_HIGH","FACT_EVAP_SH_LOW");
  if(id==="measure_sc") return has(facts,"FACT_SUBCOOLING_MEASURED","FACT_SUBCOOLING_HIGH","FACT_SUBCOOLING_LOW");
  if(id==="measure_drier") return has(facts,"FACT_DRIER_TEMPERATURES_MEASURED","FACT_DRIER_TEMP_DROP") ||
    (present(measurements["filter_drier_inlet:temperature"]) && present(measurements["filter_drier_outlet:temperature"]));
  if(id==="measure_evap_air") return present(measurements["evaporator_entering_air:temperature"]) && present(measurements["evaporator_leaving_air:temperature"]);
  if(id==="measure_pressures") return present(measurements["compressor_suction:pressure"]) && present(measurements["compressor_discharge:pressure"]);
  return false;
}
export function planNextChecks({
 operatingState="UNKNOWN",facts=[],candidates=[],nextCheckId=null,nextCheck="",
 observations={},measurements={},availableFields=null,maxChecks=3,reportedProblem="unknown"
}={}) {
 const fs=safeSet(facts),cs=safeSet(candidates),state=normalized(operatingState);
 const allowed=availableFields ? new Set(availableFields) : null;
 const result=directActions(fs);
 const items=[];
 const add=(item,score)=>{if(item && !items.some(x=>x.id===item.id && x.type===item.type))items.push({...item,priority:score});};
 const ids=new Set();
 const activeBrainCheck=nextCheckId && BRAIN_CHECK_REQUIREMENTS[nextCheckId] ? nextCheckId : null;
 if(activeBrainCheck) BRAIN_CHECK_REQUIREMENTS[activeBrainCheck].forEach(id=>ids.add(id));
 // Pattern-based differential is the fallback when Brain has no mapped check.
 if(has(fs,"FACT_COND_SAT_HIGH","FACT_SUBCOOLING_HIGH") || [...cs].some(c=>/COND_AIRFLOW|OVERCHARGE|NONCONDENS/.test(c)))
   groups.condenser.forEach(id=>ids.add(id));
 if(has(fs,"FACT_EVAP_SAT_LOW","FACT_EVAP_SAT_HIGH","FACT_EVAP_SH_HIGH","FACT_EVAP_SH_LOW") ||
   [...cs].some(c=>/EVAP|TXV|UNDERFEED|LOW_REFRIGERANT|RESTRICTION/.test(c)))
   groups.evaporator.forEach(id=>ids.add(id));
 if(state==="OFF" || reportedProblem==="not_cooling" || has(fs,"FACT_COMPRESSOR_NOT_RUNNING","FACT_COOLING_DEMAND_PRESENT"))
   groups.controls.forEach(id=>ids.add(id));
 if([...cs].some(c=>/LOAD|DOOR|SENSOR/.test(c))) groups.room.forEach(id=>ids.add(id));
 // A high box temperature with otherwise reference-normal refrigeration values
 // calls for load/controls checks, regardless of the diagnosed fault list.
 if(has(fs,"FACT_CORE_REFRIGERATION_VALUES_WITHIN_REFERENCE","FACT_OPERATING_PATTERN_WITHIN_REFERENCE")) {
   groups.room.forEach(id=>ids.add(id));
   ["cooling_demand","compressor_running"].forEach(id=>ids.add(id));
 }
 if(!ids.size && isStable(state)) {
   ["measure_pressures","measure_sh","measure_sc","condenser_coil","evaporator_fan"].forEach(id=>ids.add(id));
 }
 if(state==="UNKNOWN") add({...stateQuestion},reportedProblem==="not_cooling"?68:90);
 if(!isStable(state) && state!=="UNKNOWN") {
   // Never request steady-state refrigerant measurements during off/defrost.
   if(["OFF","PUMP_DOWN"].includes(state)) groups.controls.forEach(id=>ids.add(id));
   else add({type:"action",id:"sequence",label:"Verify current sequence",
     instruction:`Current state: ${state.toLowerCase().replaceAll("_"," ")}. Check whether this is the expected control sequence. Collect stabilized refrigeration readings when cooling resumes.`,
     why:"Transient or off-cycle readings cannot establish charge.",priority:75},75);
 }
 for(const id of ids) {
   if(id==="operating_state") {if(state!=="UNKNOWN")continue;add({...stateQuestion},90);continue;}
   if(MEASUREMENTS[id]) {
     if(!isStable(state) || measurementSatisfied(id,fs,measurements)) continue;
     add({...MEASUREMENTS[id],id,why:activeBrainCheck?"Requested by diagnostic Brain":"Needed to distinguish remaining causes"},derivedPriority(id,fs,cs,activeBrainCheck));
     continue;
   }
   const def=REGISTRY[id];
   if(!def)continue;
   const key=`${def.component}:${def.field}`;
   if(allowed && !allowed.has(key)) continue;
   if(present(observations[key])) continue; // includes explicit "unknown": do not repeat
   if(!isStable(state) && state!=="UNKNOWN" && !groups.controls.includes(id))continue;
   add({type:"observation",id,...def,why:activeBrainCheck && BRAIN_CHECK_REQUIREMENTS[activeBrainCheck]?.includes(id) ?
     "Requested by diagnostic Brain":"Helps distinguish the remaining possible causes"},(reportedProblem==="not_cooling" && groups.controls.includes(id) ? 105 : derivedPriority(id,fs,cs,activeBrainCheck)));
 }
 // After visual checks, use the available measurements or explicitly request
 // a location/charging verification. Do not loop through the same observations.
 if(!items.length && isStable(state) && has(fs,"FACT_COND_SAT_HIGH")) {
   add({...MEASUREMENTS.measure_sc,id:"verify_highside",
     instruction:"Confirm pressure/temperature measurement locations and compare high-side pressure and liquid temperature with the manufacturer's procedure. Discharge pressure gives only estimated subcooling when locations differ.",
     why:"Condenser observations are complete; charge remains unconfirmed."},48);
 }
 if(!items.length && isStable(state) && has(fs,"FACT_EVAP_SAT_LOW","FACT_EVAP_SH_HIGH")) {
   add({...MEASUREMENTS.measure_sh,id:"verify_low_side",
     instruction:"Verify evaporator outlet suction pressure and temperature, then compare metering and liquid-feed evidence against the equipment specification.",
     why:"Airflow observations are complete; verify feed-side evidence."},48);
 }
 // Do not invent a "recordable" answer for checks not connected to the adapter.
 if(!items.length && activeBrainCheck)
   add({type:"manual",id:activeBrainCheck,label:"Additional manufacturer-specific test",
     instruction:nextCheck || "Follow the equipment service procedure for this check. No validated structured input is available yet.",
     why:"This Brain check has no remaining mapped input; do not assume completion."},25);
 if(!items.length && !result.length)
   add({type:"manual",id:"coverage",label:"Review diagnosis and test plan",
     instruction:"No further validated automated test is available from the current evidence. Review the Brain's technical findings and equipment service instructions; do not treat a hypothesis as confirmed.",
     why:"Current evidence or input coverage is insufficient."},10);
 items.sort((a,b)=>b.priority-a.priority);
 // Direct physical faults should be acted on before unrelated diagnostic tests.
 if(result.length) return result.slice(0,1);
 const limit=Math.max(1,Math.min(3,maxChecks));
 if(state==="UNKNOWN") {
   const stateItem=items.find(item=>item.type==="state");
   if(stateItem) return [stateItem,...items.filter(item=>item!==stateItem).slice(0,limit-1)];
 }
 return items.slice(0,limit);
}
export function planNextCheck(args={}) {return planNextChecks({...args,maxChecks:1})[0];}
