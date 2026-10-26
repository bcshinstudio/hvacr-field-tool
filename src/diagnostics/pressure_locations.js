/* Pressure-location selection for saturation calculations.
 * A fallback SAT is an estimate; it does not relocate a measured pressure.
 * Never use a remote pressure to silently calculate location-specific SH/SC.
 */
const finite = value => typeof value === "number" && Number.isFinite(value);

export function resolveHighSidePressure(m = {}) {
    const locations = [
        ["condenserOutletPressure", "Condenser Outlet"],
        ["kingValvePressure", "Receiver Outlet / King Valve"],
        ["compressorDischargePressure", "Compressor Discharge"]
    ];
    const readings = locations.filter(([key]) => finite(m[key]))
        .map(([key, label]) => ({ key, label, pressure: m[key] }));
    const selected = readings[0] || null;
    return {
        pressure: selected?.pressure ?? null,
        location: selected?.label ?? null,
        approximate: !!selected && selected.key !== "condenserOutletPressure",
        readings,
        spreadPsig: readings.length > 1
            ? Math.max(...readings.map(r => r.pressure)) - Math.min(...readings.map(r => r.pressure))
            : null
    };
}

export function resolveEvaporatingPressure(m = {}) {
    if (finite(m.evaporatorOutletPressure))
        return { pressure: m.evaporatorOutletPressure, location: "Evaporator Outlet", approximate: false };
    if (finite(m.compressorSuctionPressure))
        return { pressure: m.compressorSuctionPressure, location: "Compressor Suction", approximate: true };
    return { pressure: null, location: null, approximate: false };
}
