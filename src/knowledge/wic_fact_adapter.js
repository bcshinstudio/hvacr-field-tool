// Walk-In Cooler -> Knowledge Hub Fact Adapter v0.1
// Pure adapter: no DOM access, no diagnosis, no universal HVAC thresholds.
//
// Input is a semantic snapshot from the existing app:
// {
//   measurements: {...},
//   calculated: {...},
//   references: {...},
//   observations: { componentId: { fieldId: value } },
//   derived: {...} // optional already-established states
// }
//
// Output:
// { facts: [...], trace: [{fact, source, value, reason}] }
//
// IMPORTANT:
// Numeric states such as HIGH SH / LOW SC are emitted only when an explicit
// application/manufacturer reference is supplied, or when the caller supplies
// an already-established derived boolean. Missing data remains unknown.

export const WIC_FACT_ADAPTER_VERSION = "0.5.0";

const finite = v => typeof v === "number" && Number.isFinite(v);

function addFact(result, fact, source, value, reason) {
  if (result._set.has(fact)) return;
  result._set.add(fact);
  result.facts.push(fact);
  result.trace.push({fact, source, value, reason});
}

function obs(observations, component, field) {
  const v=observations?.[component]?.[field];
  return v===undefined || v===null || v==="" || v==="unknown" ? null : v;
}

function classifyAgainstRange(value, ref, lowFact, highFact, retainedFact, result, source) {
  if (!finite(value) || !ref) return;
  const low=finite(ref.low)?ref.low:null;
  const high=finite(ref.high)?ref.high:null;
  if (low!==null && value<low) addFact(result,lowFact,source,value,`Below explicit reference minimum ${low}.`);
  else if (high!==null && value>high) addFact(result,highFact,source,value,`Above explicit reference maximum ${high}.`);
  else if (retainedFact && low!==null && (high===null || value<=high))
    addFact(result,retainedFact,source,value,"Within/not-below explicit reference.");
}

export function buildWicKnowledgeFacts(snapshot={}) {
  const result={facts:[],trace:[],_set:new Set()};
  const m=snapshot.measurements||{};
  const c=snapshot.calculated||{};
  const r=snapshot.references||{};
  const o=snapshot.observations||{};
  const d=snapshot.derived||{};
  const configuration=new Set(snapshot.configuration||[]);

  // ---- System configuration ----
  // Receiver presence materially changes how condenser-outlet subcooling is
  // interpreted in refrigeration systems. Preserve that context as evidence;
  // do not invent a generic subcooling threshold.
  if (configuration.has("RECEIVER"))
    addFact(result,"FACT_RECEIVER_PRESENT","configuration.receiver",true,"Liquid receiver is installed in the active system configuration.");

  // ---- Reference-based calculated conditions ----
  if (finite(c.evaporatorSat) && finite(c.evaporatorReferenceSat)) {
    if (c.evaporatorSat < c.evaporatorReferenceSat)
      addFact(result,"FACT_EVAP_SAT_LOW","calculated.evaporatorSat",c.evaporatorSat,"Below application reference SAT.");
    else if (c.evaporatorSat > c.evaporatorReferenceSat)
      addFact(result,"FACT_EVAP_SAT_HIGH","calculated.evaporatorSat",c.evaporatorSat,"Above application reference SAT.");
  }

  if (finite(c.condenserSat) && finite(c.condenserReferenceHigh) &&
      c.condenserSat > c.condenserReferenceHigh)
    addFact(result,"FACT_COND_SAT_HIGH","calculated.condenserSat",c.condenserSat,"Above explicit condenser reference range.");

  if (finite(c.evaporatorSuperheat))
    addFact(result,"FACT_EVAP_SH_MEASURED","calculated.evaporatorSuperheat",
      c.evaporatorSuperheat,"Evaporator superheat has been measured/calculated.");

  classifyAgainstRange(c.evaporatorSuperheat,r.evaporatorSuperheat,
    "FACT_EVAP_SH_LOW","FACT_EVAP_SH_HIGH",null,result,"calculated.evaporatorSuperheat");

  if (finite(c.condenserSubcooling))
    addFact(result,"FACT_SUBCOOLING_MEASURED","calculated.condenserSubcooling",
      c.condenserSubcooling,"Condenser subcooling has been measured/calculated.");

  classifyAgainstRange(c.condenserSubcooling,r.condenserSubcooling,
    "FACT_SUBCOOLING_LOW","FACT_SUBCOOLING_HIGH","FACT_SUBCOOLING_RETAINED",
    result,"calculated.condenserSubcooling");

  // A measured condenser-outlet SC value without an applicable target remains
  // numeric evidence only. On a receiver-equipped WIC, explicitly preserve the
  // receiver caveat so downstream reasoning cannot silently treat a packaged-
  // system SC target as applicable.
  if (finite(c.condenserSubcooling) && !r.condenserSubcooling && configuration.has("RECEIVER"))
    addFact(result,"FACT_SC_REFERENCE_NOT_APPLICABLE","calculated.condenserSubcooling",
      c.condenserSubcooling,"Receiver-equipped system has no applicable condenser-subcooling target; value remains measured but unclassified.");

  // ---- Direct field-measurement relationships ----
  // A detectable outlet temperature reduction across a liquid-line filter drier
  // is manufacturer-supported restriction evidence. No universal delta-F threshold
  // is invented here; instrument uncertainty still matters in field interpretation.
  const drierIn=m.filterDrierInletTemperature, drierOut=m.filterDrierOutletTemperature;
  if(finite(drierIn)&&finite(drierOut)) {
    addFact(result,"FACT_DRIER_TEMPERATURES_MEASURED","measurements.filterDrierTemperatureDifference",
      drierIn-drierOut,"Filter-drier inlet and outlet temperatures have both been measured.");
    if(drierIn>drierOut)
      addFact(result,"FACT_DRIER_TEMP_DROP","measurements.filterDrierTemperatureDifference",
        drierIn-drierOut,"Filter-drier outlet is colder than inlet.");
  }

  // ---- Caller-established derived states (no threshold invented here) ----
  const derivedMap={
    boxTempHigh:"FACT_BOX_TEMP_HIGH",
    slowPulldown:"FACT_SLOW_PULLDOWN",
    compressorLongRuntime:"FACT_COMPRESSOR_LONG_RUNTIME",
    drierTempDrop:"FACT_DRIER_TEMP_DROP",
    liquidLinePressureDrop:"FACT_LIQUID_LINE_PRESSURE_DROP",
    highAmbient:"FACT_HIGH_AMBIENT",
    highProductLoad:"FACT_HIGH_PRODUCT_LOAD",
    defrostIncomplete:"FACT_DEFROST_INCOMPLETE",
    drainIce:"FACT_DRAIN_ICE",
    evaporatorFeedUneven:"FACT_EVAP_FEED_UNEVEN",
    lowPressureControlTrip:"FACT_LOW_PRESSURE_CONTROL_TRIP",
    highPressureControlTrip:"FACT_HIGH_PRESSURE_CONTROL_TRIP",
    compressorHighDischargeTemperature:"FACT_COMPRESSOR_HIGH_DLT",
    compressorHighCurrent:"FACT_COMPRESSOR_HIGH_CURRENT",
    compressorLowCapacity:"FACT_COMPRESSOR_LOW_CAPACITY",
    controllerSetpointWrong:"FACT_CONTROLLER_SETPOINT_WRONG",
    sensorError:"FACT_SENSOR_ERROR"
  };
  for (const [key,fact] of Object.entries(derivedMap))
    if (d[key]===true) addFact(result,fact,`derived.${key}`,true,"Caller-established semantic state.");

  // ---- Direct field observations from current WIC profile ----
  const condAir=obs(o,"condenser","airflow");
  if (condAir==="low" || condAir==="blocked")
    addFact(result,"FACT_COND_AIRFLOW_LOW","observation.condenser.airflow",condAir,"Observed low/blocked condenser airflow.");

  if (obs(o,"condenser","fan_operation")==="not_running")
    addFact(result,"FACT_COND_FAN_NOT_RUNNING","observation.condenser.fan_operation","not_running","Condenser fan directly observed not running.");

  const condCoil=obs(o,"condenser","coil_condition");
  if (condCoil==="dirty")
    addFact(result,"FACT_COND_COIL_DIRTY","observation.condenser.coil_condition",condCoil,"Condenser coil directly observed dirty.");
  if (condCoil==="blocked")
    addFact(result,"FACT_COND_AIRFLOW_LOW","observation.condenser.coil_condition",condCoil,"Blocked condenser coil implies an observed airflow obstruction.");

  if (obs(o,"condenser","air_recirculation")==="yes")
    addFact(result,"FACT_HOT_AIR_RECIRCULATION","observation.condenser.air_recirculation","yes","Hot-air recirculation directly observed.");

  const evapAir=obs(o,"evaporator","airflow");
  if (evapAir==="low")
    addFact(result,"FACT_EVAP_AIRFLOW_LOW","observation.evaporator.airflow",evapAir,"Observed low evaporator airflow.");
  if (evapAir==="blocked")
    addFact(result,"FACT_EVAP_AIRFLOW_BLOCKED","observation.evaporator.airflow",evapAir,"Observed blocked evaporator airflow.");

  if (obs(o,"evaporator","fan_operation")==="not_running")
    addFact(result,"FACT_EVAP_FAN_NOT_RUNNING","observation.evaporator.fan_operation","not_running","Evaporator fan directly observed not running.");

  const evapCoil=obs(o,"evaporator","coil_condition");
  if (evapCoil==="dirty")
    addFact(result,"FACT_EVAP_COIL_DIRTY","observation.evaporator.coil_condition",evapCoil,"Evaporator coil directly observed dirty.");
  if (evapCoil==="partially_iced" || evapCoil==="fully_iced")
    addFact(result,"FACT_EVAP_COIL_ICED","observation.evaporator.coil_condition",evapCoil,"Evaporator coil directly observed iced.");

  const appearance=obs(o,"sight_glass","refrigerant_appearance");
  if (appearance==="continuous_bubbles" || appearance==="flashing_or_frothing")
    addFact(result,"FACT_SIGHT_GLASS_FLASHING","observation.sight_glass.refrigerant_appearance",appearance,"Continuous bubbles/flashing observed at sight glass.");

  const moisture=obs(o,"sight_glass","moisture_indicator");
  if (moisture==="wet")
    addFact(result,"FACT_MOISTURE_INDICATED","observation.sight_glass.moisture_indicator",moisture,"Sight-glass moisture indicator shows wet.");

  if (obs(o,"solenoid","valve_operation")==="does_not_open")
    addFact(result,"FACT_SOLENOID_NOT_OPENING","observation.solenoid.valve_operation","does_not_open","Solenoid directly observed not opening.");
  if (obs(o,"solenoid","valve_operation")==="does_not_close")
    addFact(result,"FACT_SOLENOID_NOT_CLOSING","observation.solenoid.valve_operation","does_not_close","Solenoid directly observed not closing.");

  if (obs(o,"txv","hunting")==="yes")
    addFact(result,"FACT_TXV_HUNTING","observation.txv.hunting","yes","TXV/EEV hunting directly observed.");

  const bulbContact=obs(o,"txv","bulb_contact");
  const bulbPosition=obs(o,"txv","bulb_position");
  const bulbInsulation=obs(o,"txv","bulb_insulation");
  if (bulbContact==="poor" || bulbPosition==="appears_incorrect" || bulbInsulation==="missing_or_poor")
    addFact(result,"FACT_TXV_BULB_BAD_CONTACT","observation.txv.bulb",`${bulbContact||""}/${bulbPosition||""}/${bulbInsulation||""}`,"TXV sensing-bulb installation/contact issue observed.");

  if (obs(o,"txv","equalizer_condition")==="issue_observed")
    addFact(result,"FACT_TXV_EQUALIZER_PROBLEM","observation.txv.equalizer_condition","issue_observed","TXV external-equalizer issue observed.");

  if (obs(o,"txv","inlet_condition")==="restriction_observed")
    addFact(result,"FACT_TXV_INLET_RESTRICTION","observation.txv.inlet_condition","restriction_observed","Restriction observed at TXV inlet/strainer.");

  if (obs(o,"txv","response_to_load")==="does_not_respond")
    addFact(result,"FACT_TXV_NOT_RESPONDING","observation.txv.response_to_load","does_not_respond","TXV does not respond appropriately to bulb/load change.");

  // Current profile exposes oil evidence on compressor and other components.
  for (const component of ["compressor","condenser","filter_drier","sight_glass","solenoid","txv","evaporator"]) {
    if (obs(o,component,"oil_evidence")==="present")
      addFact(result,"FACT_OIL_STAIN_OR_LEAK_EVIDENCE",`observation.${component}.oil_evidence`,"present","Oil/leak evidence directly observed.");
  }

  // Case-wide operating/control observations exposed by Brain 2.0 UI.
  const room=o.room||{}, ctl=o.controls||{}, comp=o.compressor||{};
  if(room.door_infiltration==="confirmed_infiltration") addFact(result,"FACT_DOOR_OPEN_OR_LEAKING","observations.room.door_infiltration",room.door_infiltration);
  if(room.warm_product_load==="large_warm_load") addFact(result,"FACT_WARM_PRODUCT_LOAD_CONFIRMED","observations.room.warm_product_load",room.warm_product_load);
  if(room.sensor_reference==="disagrees") addFact(result,"FACT_SENSOR_DISAGREES_REFERENCE","observations.room.sensor_reference",room.sensor_reference);
  if(ctl.cooling_demand==="calling") addFact(result,"FACT_COOLING_DEMAND_PRESENT","observations.controls.cooling_demand",ctl.cooling_demand);
  if(ctl.anti_short_cycle==="active") addFact(result,"FACT_ANTI_SHORT_CYCLE_DELAY_ACTIVE","observations.controls.anti_short_cycle",ctl.anti_short_cycle);
  if(ctl.wiring_scheme==="unknown") addFact(result,"FACT_WIRING_SCHEME_UNKNOWN","observations.controls.wiring_scheme",ctl.wiring_scheme);
  if(ctl.hp_safety==="open_tripped") addFact(result,"FACT_HP_SAFETY_OPEN","observations.controls.hp_safety",ctl.hp_safety);
  if(ctl.lp_control==="open") addFact(result,"FACT_LP_CONTROL_OPEN","observations.controls.lp_control",ctl.lp_control);
  if(ctl.contactor_coil==="energized") addFact(result,"FACT_CONTACTOR_COIL_ENERGIZED","observations.controls.contactor_coil",ctl.contactor_coil);
  if(ctl.contactor_coil==="not_energized") addFact(result,"FACT_CONTACTOR_COIL_NOT_ENERGIZED","observations.controls.contactor_coil",ctl.contactor_coil);
  if(ctl.contactor_output==="not_passing_voltage") addFact(result,"FACT_CONTACTOR_NOT_PASSING_VOLTAGE","observations.controls.contactor_output",ctl.contactor_output);
  if(ctl.fuse_state==="open_blown") addFact(result,"FACT_FUSE_OPEN","observations.controls.fuse_state",ctl.fuse_state);
  if(ctl.solenoid_command==="closed") addFact(result,"FACT_SOLENOID_COMMAND_CLOSED","observations.controls.solenoid_command",ctl.solenoid_command);
  if(ctl.solenoid_command==="open") addFact(result,"FACT_SOLENOID_COMMAND_OPEN","observations.controls.solenoid_command",ctl.solenoid_command);
  if(ctl.solenoid_command==="closed"&&ctl.solenoid_flow==="flowing") addFact(result,"FACT_SOLENOID_FLOW_CONTINUES_CLOSED","observations.controls.solenoid_flow",ctl.solenoid_flow);
  if(ctl.solenoid_command==="open"&&ctl.solenoid_flow==="not_flowing") addFact(result,"FACT_SOLENOID_NO_FLOW_WHEN_OPEN","observations.controls.solenoid_flow",ctl.solenoid_flow);
  if(comp.running_state==="off") addFact(result,"FACT_COMPRESSOR_NOT_RUNNING","observations.compressor.running_state",comp.running_state);
  if(comp.running_state==="running") addFact(result,"FACT_COMPRESSOR_RUNNING","observations.compressor.running_state",comp.running_state);
  if(comp.temperature_condition==="hot") addFact(result,"FACT_COMPRESSOR_HOT","observations.compressor.temperature_condition",comp.temperature_condition);
  if(comp.overload_state==="open_tripped") addFact(result,"FACT_OVERLOAD_PROTECTION_OPEN","observations.compressor.overload_state",comp.overload_state);

  // Measurement quality is not a diagnosis. Suspect/invalid pressure makes
  // pressure-derived evidence non-authoritative in the hypothesis engine.
  result.factRecords=result.factRecords||[];
  const eq=snapshot.context?.evaporatorPressureQuality;
  if((eq==="suspect"||eq==="invalid") && result.facts.includes("FACT_EVAP_SH_HIGH")){
    result.factRecords.push({id:"FACT_EVAP_SH_HIGH",quality:eq.toUpperCase()});
  }

  delete result._set;
  result.facts.sort();
  return result;
}
