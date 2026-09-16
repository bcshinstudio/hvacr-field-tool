export const acSplit = {
    id: "ac_split",
    name: "Residential Split AC",
    description: "Typical direct-expansion split air-conditioning system",

    components: [
        {
            id: "compressor",
            type: "compressor",
            label: "Compressor",
            x: 16,
            y: 58,
            labelPosition: "left"
        },
        {
            id: "condenser",
            type: "condenser",
            label: "Condenser",
            x: 40,
            y: 20,
            labelPosition: "top"
        },
        {
            id: "filter_drier",
            type: "filter_drier",
            label: "Filter Drier",
            x: 70,
            y: 28,
            labelPosition: "top"
        },
        {
            id: "metering_device",
            type: "metering_device",
            label: "TXV / Piston",
            x: 82,
            y: 58,
            labelPosition: "right"
        },
        {
            id: "evaporator",
            type: "evaporator",
            label: "Evaporator",
            x: 48,
            y: 80,
            labelPosition: "bottom"
        }
    ],

    connections: [
        {
            from: "compressor",
            to: "condenser",
            section: "discharge"
        },
        {
            from: "condenser",
            to: "filter_drier",
            section: "liquid"
        },
        {
            from: "filter_drier",
            to: "metering_device",
            section: "liquid"
        },
        {
            from: "metering_device",
            to: "evaporator",
            section: "expansion"
        },
        {
            from: "evaporator",
            to: "compressor",
            section: "suction"
        }
    ]
};