/*
 * HVAC/R Field Tool - Offline Diagnostic Engine
 * v17 foundation
 *
 * Pure logic: no DOM access. The application UI and automated test page
 * both call this same function.
 */

export function calculateDiagnosticState({
    measurements,
    references,
    saturationTemperatureFromPressure
}) {
    const m = measurements || {};
    const r = references || {};
    const sat = saturationTemperatureFromPressure;

    const evapSat = m.evaporatorOutletPressure != null
        ? sat(m.evaporatorOutletPressure, "dew")
        : null;

    const evapSH =
        evapSat != null && m.evaporatorOutletTemperature != null
            ? m.evaporatorOutletTemperature - evapSat
            : null;

    const suctionSat = m.compressorSuctionPressure != null
        ? sat(m.compressorSuctionPressure, "dew")
        : null;

    const totalSH =
        suctionSat != null && m.compressorSuctionTemperature != null
            ? m.compressorSuctionTemperature - suctionSat
            : null;

    const suctionLineRise =
        m.compressorSuctionTemperature != null &&
        m.evaporatorOutletTemperature != null
            ? m.compressorSuctionTemperature - m.evaporatorOutletTemperature
            : null;

    const compressionRatio =
        m.compressorSuctionPressure != null &&
        m.compressorDischargePressure != null &&
        m.compressorSuctionPressure + 14.7 > 0
            ? (m.compressorDischargePressure + 14.7) /
              (m.compressorSuctionPressure + 14.7)
            : null;

    const condenserPressure =
        m.condenserOutletPressure != null
            ? m.condenserOutletPressure
            : m.kingValvePressure;

    const condenserSat =
        condenserPressure != null
            ? sat(condenserPressure, "bubble")
            : null;

    const condenserOutletSat =
        m.condenserOutletPressure != null
            ? sat(m.condenserOutletPressure, "bubble")
            : null;

    const subcooling =
        condenserOutletSat != null &&
        m.condenserOutletTemperature != null
            ? condenserOutletSat - m.condenserOutletTemperature
            : null;

    const evaporatorAirDeltaT =
        m.evaporatorEnteringAir != null && m.evaporatorLeavingAir != null
            ? m.evaporatorEnteringAir - m.evaporatorLeavingAir
            : null;

    const condenserAirDeltaT =
        m.condenserEnteringAir != null && m.condenserLeavingAir != null
            ? m.condenserLeavingAir - m.condenserEnteringAir
            : null;

    const evapReferenceAir =
        m.boxTemperature != null
            ? m.boxTemperature
            : m.evaporatorEnteringAir;

    const evapReferenceSat =
        evapReferenceAir != null && r.evaporatorTd != null
            ? evapReferenceAir - r.evaporatorTd
            : null;

    const condenserReferenceLow =
        m.condenserEnteringAir != null && r.condenserCtoaLow != null
            ? m.condenserEnteringAir + r.condenserCtoaLow
            : null;

    const condenserReferenceHigh =
        m.condenserEnteringAir != null && r.condenserCtoaHigh != null
            ? m.condenserEnteringAir + r.condenserCtoaHigh
            : null;

    return {
        evaporatorSat: evapSat,
        evaporatorReferenceSat: evapReferenceSat,
        evaporatorSuperheat: evapSH,
        suctionSat,
        totalSuperheat: totalSH,
        suctionLineTemperatureRise: suctionLineRise,
        compressionRatio,
        compressorDischargeTemperature: m.compressorDischargeTemperature,
        condenserSat,
        condenserReferenceLow,
        condenserReferenceHigh,
        subcooling,
        evaporatorAirDeltaT,
        condenserAirDeltaT
    };
}

export function diagnoseSystem(input) {
    const state = calculateDiagnosticState(input);
    const m = input.measurements || {};
    const r = input.references || {};
    const o = input.observations || {};

    const known = v => v !== null && v !== undefined &&
        !(typeof v === "number" && Number.isNaN(v));

    const evapTolerance = known(r.evaporatorSatTolerance)
        ? r.evaporatorSatTolerance : 1;

    const evapReferenceKnown =
        known(state.evaporatorSat) && known(state.evaporatorReferenceSat);
    const condenserReferenceKnown =
        known(state.condenserSat) &&
        known(state.condenserReferenceLow) &&
        known(state.condenserReferenceHigh);

    const evapMatches = evapReferenceKnown &&
        Math.abs(state.evaporatorSat - state.evaporatorReferenceSat) <= evapTolerance;
    const evapBelowReference = evapReferenceKnown &&
        state.evaporatorSat < state.evaporatorReferenceSat - evapTolerance;
    const condenserMatches = condenserReferenceKnown &&
        state.condenserSat >= state.condenserReferenceLow &&
        state.condenserSat <= state.condenserReferenceHigh;
    const condenserAboveReference = condenserReferenceKnown &&
        state.condenserSat > state.condenserReferenceHigh;

    // SH/SC classifications exist only when explicit reference limits are supplied.
    const highEvapSH =
        known(state.evaporatorSuperheat) &&
        known(r.evaporatorSuperheatMax) &&
        state.evaporatorSuperheat > r.evaporatorSuperheatMax;
    const lowSubcooling =
        known(state.subcooling) &&
        known(r.subcoolingMin) &&
        state.subcooling < r.subcoolingMin;
    const normalOrHighSubcooling =
        known(state.subcooling) &&
        known(r.subcoolingMin) &&
        state.subcooling >= r.subcoolingMin;

    const restrictionEvidence =
        o.filterDrierOutletSweating === "yes" ||
        o.liquidLineRestriction === "present" ||
        o.flashGasAfterRestriction === "yes";

    const condenserAirflowEvidence =
        ["low", "blocked"].includes(o.condenserAirflow) ||
        ["dirty", "blocked"].includes(o.condenserCoilCondition) ||
        o.condenserFanOperation === "not_running" ||
        o.hotAirRecirculation === "yes";

    const evaporatorAirflowEvidence =
        ["low", "blocked"].includes(o.evaporatorAirflow) ||
        ["dirty", "blocked", "iced", "partially_iced", "fully_iced"]
            .includes(o.evaporatorCoilCondition) ||
        o.evaporatorFanOperation === "not_running";

    // ============================================================
    // v27 EVIDENCE-FIRST DIAGNOSTIC CANDIDATES
    // Missing unrelated fields never stop candidate evaluation.
    // ============================================================
    const candidates = [];

    if (restrictionEvidence && highEvapSH && normalOrHighSubcooling) {
        candidates.push({
            id: "LIQUID_LINE_RESTRICTION",
            title: "Likely Liquid-Line Restriction",
            summary:
                "The evaporator is starved while condenser-outlet subcooling is retained, and direct liquid-line restriction evidence is present.",
            nextCheck:
                "Check temperature and, where service access exists, pressure immediately before and after the suspected restriction.",
            evidence: [
                { id: "EVAP_SH_HIGH", kind: "support" },
                { id: "SUBCOOLING_NOT_LOW", kind: "support" },
                { id: "LIQUID_LINE_RESTRICTION_EVIDENCE", kind: "strong_support" }
            ]
        });
    }

    if (condenserAboveReference && condenserAirflowEvidence) {
        candidates.push({
            id: "CONDENSER_HEAT_REJECTION_PROBLEM",
            title: "Likely Condenser Heat-Rejection Problem",
            summary:
                "Condensing saturation temperature is above the current reference range and condenser airflow/coil evidence indicates impaired heat rejection.",
            nextCheck:
                "Verify condenser fan operation, coil cleanliness, airflow path, and hot-air recirculation before changing refrigerant charge.",
            evidence: [
                { id: "COND_SAT_ABOVE_REFERENCE", kind: "support" },
                { id: "CONDENSER_AIRFLOW_EVIDENCE", kind: "strong_support" }
            ]
        });
    }

    if (evapBelowReference && evaporatorAirflowEvidence) {
        candidates.push({
            id: "EVAPORATOR_AIRFLOW_OR_LOAD_PROBLEM",
            title: "Likely Evaporator Airflow / Load Problem",
            summary:
                "Evaporating saturation temperature is below the current application reference and evaporator airflow/coil evidence indicates reduced heat load at the coil.",
            nextCheck:
                "Verify evaporator fan operation, coil condition, ice buildup, and that the air path is not blocked.",
            evidence: [
                { id: "EVAP_SAT_BELOW_REFERENCE", kind: "support" },
                { id: "EVAPORATOR_AIRFLOW_EVIDENCE", kind: "strong_support" }
            ]
        });
    }

    if (highEvapSH && lowSubcooling && !restrictionEvidence) {
        candidates.push({
            id: "LOW_REFRIGERANT_CHARGE",
            title: "Likely Low Refrigerant Charge",
            summary:
                "High evaporator superheat together with low condenser-outlet subcooling is consistent with insufficient refrigerant feeding the evaporator.",
            nextCheck:
                "Check for refrigerant leakage and verify the charge using the equipment manufacturer's charging procedure before adding refrigerant.",
            evidence: [
                { id: "EVAP_SH_HIGH", kind: "support" },
                { id: "SUBCOOLING_LOW", kind: "support" }
            ]
        });
    }

    // Decide from ALL supported fault families before asking for anything else.
    if (candidates.length > 1) {
        const conflictId = {
            LIQUID_LINE_RESTRICTION: "liquid_line_restriction",
            CONDENSER_HEAT_REJECTION_PROBLEM: "condenser_heat_rejection",
            EVAPORATOR_AIRFLOW_OR_LOAD_PROBLEM: "evaporator_airflow_or_load",
            LOW_REFRIGERANT_CHARGE: "low_refrigerant_charge"
        };
        return {
            type: "more_information",
            id: "CONFLICTING_FAULT_EVIDENCE",
            title: "Multiple Fault Patterns Detected",
            summary:
                "Current measurements and observations support more than one independent fault pattern. Do not force a single cause until the conflicting evidence is separated.",
            nextCheck:
                "Verify the direct physical observations first, then repeat the related pressure and temperature measurements under stable operation.",
            evidence: candidates.map(c => ({
                id: conflictId[c.id],
                kind: "conflict"
            })),
            candidates: candidates.map(c => c.id),
            state
        };
    }

    if (candidates.length === 1) {
        return { type: "conclusion", ...candidates[0], state };
    }

    // ============================================================
    // NO STRONG FAULT YET: ask only for information that can
    // materially improve the diagnosis. No global required-field gate.
    // ============================================================
    if (!known(m.evaporatorEnteringAir) &&
        !known(m.boxTemperature) &&
        !evapReferenceKnown) {
        return {
            type: "more_information",
            id: "NEED_EVAP_REFERENCE_AIR",
            title: "Measure Evaporator Entering Air or Box Temperature",
            summary:
                "This provides the air-side reference needed to compare evaporating saturation temperature.",
            state
        };
    }

    if (!known(m.evaporatorOutletPressure)) {
        return {
            type: "more_information",
            id: "NEED_EVAPORATOROUTLETPRESSURE",
            title: "Measure Evaporator Outlet Pressure",
            summary:
                "This is needed to determine evaporating saturation temperature and evaporator superheat.",
            state
        };
    }

    if (!known(m.evaporatorOutletTemperature)) {
        return {
            type: "more_information",
            id: "NEED_EVAPORATOROUTLETTEMPERATURE",
            title: "Measure Evaporator Outlet Temperature",
            summary: "This completes the evaporator superheat calculation.",
            state
        };
    }

    if (!known(m.condenserOutletPressure)) {
        return {
            type: "more_information",
            id: "NEED_CONDENSEROUTLETPRESSURE",
            title: "Measure Condenser Outlet Pressure",
            summary:
                "This is needed to determine condensing saturation temperature and condenser subcooling.",
            state
        };
    }

    if (!known(m.condenserOutletTemperature)) {
        return {
            type: "more_information",
            id: "NEED_CONDENSEROUTLETTEMPERATURE",
            title: "Measure Condenser Outlet Temperature",
            summary: "This completes the condenser subcooling calculation.",
            state
        };
    }

    if (!known(m.condenserEnteringAir)) {
        return {
            type: "more_information",
            id: "NEED_CONDENSERENTERINGAIR",
            title: "Measure Condenser Entering Air",
            summary:
                "This provides the entering-air reference needed to compare condensing saturation temperature.",
            state
        };
    }

    // Secondary measurements are not mandatory unless a rule specifically needs them.
    if (evapReferenceKnown && condenserReferenceKnown) {
        if (evapMatches && condenserMatches) {
            return {
                type: "conclusion",
                id: "REFERENCE_SAT_MATCH",
                title: "Saturation Conditions Match Current References",
                summary:
                    "Evaporator saturation temperature is at the current reference and condenser saturation temperature is within the current reference range.",
                evidence: [
                    { id: "EVAP_SAT_MATCH", kind: "support" },
                    { id: "COND_SAT_IN_RANGE", kind: "support" }
                ],
                state
            };
        }
        return {
            type: "conclusion",
            id: "REFERENCE_CONDITION_DEVIATION",
            title: "Operating Conditions Need Further Diagnosis",
            summary:
                "One or more saturation conditions differ from the available reference information, but the current evidence does not support a more specific cause.",
            evidence: [
                ...(!evapMatches ? [{ id: "EVAP_SAT_REFERENCE_DEVIATION", kind: "attention" }] : []),
                ...(!condenserMatches ? [{ id: "COND_SAT_REFERENCE_DEVIATION", kind: "attention" }] : [])
            ],
            state
        };
    }

    return {
        type: "conclusion",
        id: "NO_SPECIFIC_CAUSE",
        title: "No Specific Cause Established",
        summary: "The current evidence does not support a specific validated fault.",
        evidence: [],
        state
    };
}
