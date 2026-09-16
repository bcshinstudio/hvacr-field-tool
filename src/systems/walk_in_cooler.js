export const walkInCooler = {
    id: "walk_in_cooler",
    name: "Walk-In Cooler",
    description: "Typical DX medium-temperature refrigeration system",

    components: [
        { id: "compressor", type: "compressor", label: "Compressor", x: 12, y: 58, labelPosition: "left" },
        { id: "condenser", type: "condenser", label: "Condenser", x: 32, y: 18, labelPosition: "top" },
        { id: "receiver", type: "receiver", label: "Receiver", x: 55, y: 18, labelPosition: "top" },
        { id: "filter_drier", type: "filter_drier", label: "Filter Drier", x: 72, y: 28, labelPosition: "top" },
        { id: "sight_glass", type: "sight_glass", label: "Sight Glass", x: 84, y: 42, labelPosition: "right" },
        { id: "solenoid", type: "solenoid", label: "Solenoid", x: 84, y: 58, labelPosition: "right" },
        { id: "txv", type: "metering_device", label: "TXV", x: 76, y: 74, labelPosition: "right" },
        { id: "evaporator", type: "evaporator", label: "Evaporator", x: 43, y: 80, labelPosition: "bottom" }
    ],

    /*
     * Known physical service locations.
     * The technician activates only the locations needed.
     * Values are stored by point id + measurement id.
     */
    measurementPoints: [
        {
            id: "compressor_discharge",
            label: "Compressor Discharge",
            selectionType: "MEASUREMENT POINT",
            connectionFrom: "compressor",
            connectionTo: "condenser",
            position: 0.12,
            measurements: [
                { id: "pressure", label: "Pressure", unit: "psig", inputType: "number" },
                { id: "temperature", label: "Line Temperature", unit: "°F", inputType: "number" }
            ]
        },
        {
            id: "condenser_inlet",
            label: "Condenser Inlet",
            selectionType: "MEASUREMENT POINT",
            connectionFrom: "compressor",
            connectionTo: "condenser",
            position: 0.88,
            measurements: [
                { id: "pressure", label: "Pressure", unit: "psig", inputType: "number" },
                { id: "temperature", label: "Line Temperature", unit: "°F", inputType: "number" }
            ]
        },
        {
            id: "condenser_outlet",
            label: "Condenser Outlet",
            selectionType: "MEASUREMENT POINT",
            connectionFrom: "condenser",
            connectionTo: "receiver",
            position: 0.16,
            measurements: [
                { id: "pressure", label: "Pressure", unit: "psig", inputType: "number" },
                { id: "temperature", label: "Liquid Line Temperature", unit: "°F", inputType: "number" }
            ]
        },
        {
            id: "receiver_outlet",
            label: "Receiver Outlet",
            selectionType: "MEASUREMENT POINT",
            connectionFrom: "receiver",
            connectionTo: "filter_drier",
            position: 0.14,
            measurements: [
                { id: "pressure", label: "Pressure", unit: "psig", inputType: "number" },
                { id: "temperature", label: "Liquid Line Temperature", unit: "°F", inputType: "number" }
            ]
        },
        {
            id: "filter_drier_inlet",
            label: "Filter Drier Inlet",
            selectionType: "MEASUREMENT POINT",
            connectionFrom: "receiver",
            connectionTo: "filter_drier",
            position: 0.82,
            measurements: [
                { id: "pressure", label: "Pressure", unit: "psig", inputType: "number" },
                { id: "temperature", label: "Line Temperature", unit: "°F", inputType: "number" }
            ]
        },
        {
            id: "filter_drier_outlet",
            label: "Filter Drier Outlet",
            selectionType: "MEASUREMENT POINT",
            connectionFrom: "filter_drier",
            connectionTo: "sight_glass",
            position: 0.18,
            measurements: [
                { id: "pressure", label: "Pressure", unit: "psig", inputType: "number" },
                { id: "temperature", label: "Line Temperature", unit: "°F", inputType: "number" }
            ]
        },
        {
            id: "txv_inlet",
            label: "TXV Inlet",
            selectionType: "MEASUREMENT POINT",
            connectionFrom: "solenoid",
            connectionTo: "txv",
            position: 0.82,
            measurements: [
                { id: "pressure", label: "Pressure", unit: "psig", inputType: "number" },
                { id: "temperature", label: "Liquid Line Temperature", unit: "°F", inputType: "number" }
            ]
        },
        {
            id: "evaporator_inlet",
            label: "Evaporator Inlet",
            selectionType: "MEASUREMENT POINT",
            connectionFrom: "txv",
            connectionTo: "evaporator",
            position: 0.82,
            measurements: [
                { id: "pressure", label: "Pressure", unit: "psig", inputType: "number" },
                { id: "temperature", label: "Line Temperature", unit: "°F", inputType: "number" }
            ]
        },
        {
            id: "evaporator_outlet",
            label: "Evaporator Outlet",
            selectionType: "MEASUREMENT POINT",
            connectionFrom: "evaporator",
            connectionTo: "compressor",
            position: 0.14,
            measurements: [
                { id: "pressure", label: "Pressure", unit: "psig", inputType: "number" },
                { id: "temperature", label: "Suction Line Temperature", unit: "°F", inputType: "number" }
            ]
        },
        {
            id: "compressor_inlet",
            label: "Compressor Inlet",
            selectionType: "MEASUREMENT POINT",
            connectionFrom: "evaporator",
            connectionTo: "compressor",
            position: 0.88,
            measurements: [
                { id: "pressure", label: "Pressure", unit: "psig", inputType: "number" },
                { id: "temperature", label: "Suction Line Temperature", unit: "°F", inputType: "number" }
            ]
        }
    ],

    connections: [
        { from: "compressor", to: "condenser", section: "discharge" },
        { from: "condenser", to: "receiver", section: "liquid" },
        { from: "receiver", to: "filter_drier", section: "liquid" },
        { from: "filter_drier", to: "sight_glass", section: "liquid" },
        { from: "sight_glass", to: "solenoid", section: "liquid" },
        { from: "solenoid", to: "txv", section: "liquid" },
        { from: "txv", to: "evaporator", section: "expansion" },
        { from: "evaporator", to: "compressor", section: "suction" }
    ]
};
