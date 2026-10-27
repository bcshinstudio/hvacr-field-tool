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
    if (c.evaporatorSat < (finite(c.evaporatorReferenceLow)?c.evaporatorReferenceLow:c.evaporatorReferenceSat))
      addFact(result,"FACT_EVAP_SAT_LOW","calculated.evaporatorSat",c.evaporatorSat,"Below application reference SAT.");
    else if (c.evaporatorSat > (finite(c.evaporatorReferenceHigh)?c.evaporatorReferenceHigh:c.evaporatorReferenceSat))
      addFact(result,"FACT_EVAP_SAT_HIGH","calculated.evaporatorSat",c.evaporatorSat,"Above application reference SAT.");
  }

  // Optional two-sided equipment reference. A high suction saturation is not
  // evidence of undercharge; it can be part of a weak-pumping pattern.
  if (finite(c.evaporatorSat) && finite(c.evaporatorReferenceHigh) &&
      c.evaporatorSat > c.evaporatorReferenceHigh)
    addFact(result,"FACT_EVAP_SAT_ABOVE_RANGE","calculated.evaporatorSat",c.evaporatorSat,"Above the explicitly supplied evaporator saturation range.");
  if (finite(c.condenserSat) && finite(c.condenserReferenceLow) &&
      c.condenserSat < c.condenserReferenceLow)
    addFact(result,"FACT_COND_SAT_LOW","calculated.condenserSat",c.condenserSat,"Below the explicitly supplied condenser saturation range.");
  if (finite(m.outdoorAmbientF) && finite(r.lowAmbientThresholdF) &&
      m.outdoorAmbientF < r.lowAmbientThresholdF)
    addFact(result,"FACT_LOW_AMBIENT","measurements.outdoorAmbientF",m.outdoorAmbientF,"Below explicitly supplied low-ambient reference; not a head-control failure diagnosis.");
  if (result.facts.includes("FACT_LOW_AMBIENT") && result.facts.includes("FACT_COND_SAT_LOW"))
    addFact(result,"FACT_LOW_AMBIENT_LOW_HEAD_PATTERN","calculated.condenserPattern",true,
      "Low head in cold ambient; check installed head-pressure control operation and design before concluding a fault.");
  if (finite(c.evaporatorSat) && finite(c.evaporatorReferenceHigh) &&
      finite(c.condenserSat) && finite(c.condenserReferenceLow) &&
      c.evaporatorSat > c.evaporatorReferenceHigh && c.condenserSat < c.condenserReferenceLow)
    addFact(result,"FACT_HIGH_SUCTION_LOW_HEAD_PATTERN","calculated.pressurePattern",true,"High evaporating and low condensing saturation together; investigate compressor performance and operating state.");
  // A low evaporating SAT with *reference-normal* evaporator superheat is
  // consistent with reduced evaporator heat transfer/load.  This is a
  // provisional physical condition, NOT proof of icing or an airflow fault.
  // Require an actual reference and a measured SH; missing data must never
  // create a "normal" finding by absence of a HIGH fact.
  if (finite(c.evaporatorSat) && finite(c.evaporatorReferenceLow) &&
      c.evaporatorSat < c.evaporatorReferenceLow &&
      finite(c.evaporatorSuperheat) && finite(r.evaporatorSuperheat?.low) &&
      finite(r.evaporatorSuperheat?.high) &&
      c.evaporatorSuperheat >= r.evaporatorSuperheat.low &&
      c.evaporatorSuperheat <= r.evaporatorSuperheat.high)
    addFact(result,"FACT_LOW_EVAP_SAT_WITH_NORMAL_SH","calculated.evaporatorPattern",true,
      "Low evaporator SAT with SH within an applicable reference; evaluate evaporator heat transfer/load and competing causes.");

  // Normal pattern requires COMPLETE two-sided references, not merely absence
  // of fault evidence. This does not override direct observations of a defect.
  if ([c.evaporatorSat,c.evaporatorReferenceLow,c.evaporatorReferenceHigh,
       c.condenserSat,c.condenserReferenceLow,c.condenserReferenceHigh,
       c.evaporatorSuperheat,c.condenserSubcooling,
       r.evaporatorSuperheat?.low,r.evaporatorSuperheat?.high,
       r.condenserSubcooling?.low,r.condenserSubcooling?.high].every(finite) &&
      c.evaporatorSat>=c.evaporatorReferenceLow && c.evaporatorSat<=c.evaporatorReferenceHigh &&
      c.condenserSat>=c.condenserReferenceLow && c.condenserSat<=c.condenserReferenceHigh &&
      c.evaporatorSuperheat>=r.evaporatorSuperheat.low && c.evaporatorSuperheat<=r.evaporatorSuperheat.high &&
      c.condenserSubcooling>=r.condenserSubcooling.low && c.condenserSubcooling<=r.condenserSubcooling.high)
    addFact(result,"FACT_OPERATING_PATTERN_WITHIN_REFERENCE","calculated.referencePattern",true,"All six measured conditions lie within explicitly supplied exercise ranges; this alone does not prove equipment health.");

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
  if(ctl.main_power_available==="no") addFact(result,"FACT_MAIN_POWER_NOT_AVAILABLE","observations.controls.main_power_available",ctl.main_power_available);
  if(ctl.main_power_available==="yes") addFact(result,"FACT_MAIN_POWER_AVAILABLE","observations.controls.main_power_available",ctl.main_power_available);
  if(ctl.thermostat_y==="present") addFact(result,"FACT_THERMOSTAT_Y_PRESENT","observations.controls.thermostat_y",ctl.thermostat_y);
  if(ctl.thermostat_y==="absent") addFact(result,"FACT_THERMOSTAT_Y_ABSENT","observations.controls.thermostat_y",ctl.thermostat_y);
  if(ctl.transformer_primary==="present") addFact(result,"FACT_TRANSFORMER_PRIMARY_PRESENT","observations.controls.transformer_primary",ctl.transformer_primary);
  if(ctl.transformer_secondary==="absent") addFact(result,"FACT_TRANSFORMER_SECONDARY_ABSENT","observations.controls.transformer_secondary",ctl.transformer_secondary);
  if(ctl.low_voltage_fuse==="open") addFact(result,"FACT_LOW_VOLTAGE_FUSE_OPEN","observations.controls.low_voltage_fuse",ctl.low_voltage_fuse);
  if(ctl.run_capacitor_failed===true) addFact(result,"FACT_RUN_CAPACITOR_FAILED","observations.controls.run_capacitor_failed",true);
  if(ctl.fuse_state==="open_blown") addFact(result,"FACT_FUSE_OPEN","observations.controls.fuse_state",ctl.fuse_state);
  if(ctl.solenoid_command==="closed") addFact(result,"FACT_SOLENOID_COMMAND_CLOSED","observations.controls.solenoid_command",ctl.solenoid_command);
  if(ctl.solenoid_command==="open") addFact(result,"FACT_SOLENOID_COMMAND_OPEN","observations.controls.solenoid_command",ctl.solenoid_command);
  if(ctl.solenoid_command==="closed"&&ctl.solenoid_flow==="flowing") addFact(result,"FACT_SOLENOID_FLOW_CONTINUES_CLOSED","observations.controls.solenoid_flow",ctl.solenoid_flow);
  if(ctl.solenoid_command==="open"&&ctl.solenoid_flow==="not_flowing") addFact(result,"FACT_SOLENOID_NO_FLOW_WHEN_OPEN","observations.controls.solenoid_flow",ctl.solenoid_flow);
  if(["off","not_running"].includes(comp.running_state)) addFact(result,"FACT_COMPRESSOR_NOT_RUNNING","observations.compressor.running_state",comp.running_state);
  if(comp.running_state==="running") addFact(result,"FACT_COMPRESSOR_RUNNING","observations.compressor.running_state",comp.running_state);
  if(comp.temperature_condition==="hot") addFact(result,"FACT_COMPRESSOR_HOT","observations.compressor.temperature_condition",comp.temperature_condition);
  if(comp.overload_state==="open_tripped") addFact(result,"FACT_OVERLOAD_PROTECTION_OPEN","observations.compressor.overload_state",comp.overload_state);
  if(comp.winding_start_open===true) addFact(result,"FACT_COMPRESSOR_START_WINDING_OPEN","observations.compressor.winding_start_open",true);
  if(comp.terminal_voltage_present===true) addFact(result,"FACT_COMPRESSOR_TERMINAL_VOLTAGE_PRESENT","observations.compressor.terminal_voltage_present",true);
  if(comp.grounded===true) addFact(result,"FACT_COMPRESSOR_GROUNDED","observations.compressor.grounded",true);
  if(comp.winding_open===true) addFact(result,"FACT_COMPRESSOR_WINDING_OPEN","observations.compressor.winding_open",true);
  if(comp.winding_relationship_normal===true) addFact(result,"FACT_COMPRESSOR_WINDING_RELATIONSHIP_NORMAL","observations.compressor.winding_relationship_normal",true);
  const cf=o.condenser||{};
  if(cf.fan_operation==="slow") addFact(result,"FACT_COND_FAN_RUNNING_SLOW","observations.condenser.fan_operation",cf.fan_operation);
  if(cf.fan_shaft_condition==="free") addFact(result,"FACT_COND_FAN_SHAFT_FREE","observations.condenser.fan_shaft_condition",cf.fan_shaft_condition);
  if(cf.fan_voltage_present===true) addFact(result,"FACT_COND_FAN_VOLTAGE_PRESENT","observations.condenser.fan_voltage_present",true);
  const ef=o.evaporator||{};
  if(ef.fan_voltage_present===true) addFact(result,"FACT_EVAP_BLOWER_VOLTAGE_PRESENT","observations.evaporator.fan_voltage_present",true);
  if(ef.air_filter_condition==="dirty_restricted") addFact(result,"FACT_AIR_FILTER_DIRTY","observations.evaporator.air_filter_condition",ef.air_filter_condition);
  if(ef.duct_restriction==="restriction_observed") addFact(result,"FACT_DUCT_RESTRICTED","observations.evaporator.duct_restriction",ef.duct_restriction);
  if(cf.fan_winding_relationship_normal===true) addFact(result,"FACT_COND_FAN_WINDING_RELATIONSHIP_NORMAL","observations.condenser.fan_winding_relationship_normal",true);

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
