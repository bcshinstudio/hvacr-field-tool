export const walkInCooler = {

    id: "walk_in_cooler",

    name: "Walk-In Cooler",

    description:
        "Typical medium-temperature commercial refrigeration system",


    /*
     * =====================================================
     * COMPONENTS
     * =====================================================
     */

    components: [

        {
            id: "compressor",
            role: "compressor",
            type: "compressor",
            subtype: "reciprocating",

            required: true,
            removable: false,

            allowedSubtypes: [
                "reciprocating",
                "scroll",
                "rotary",
                "screw"
            ],

            label: "Compressor",

            x: 16,
            y: 58,

            labelPosition: "left"
        },


        {
            id: "condenser",
            role: "condenser",
            type: "condenser",
            subtype: "air_cooled",

            required: true,
            removable: false,

            allowedSubtypes: [
                "air_cooled",
                "water_cooled",
                "evaporative"
            ],

            label: "Condenser",

            x: 38,
            y: 20,

            labelPosition: "top"
        },


        {
            id: "receiver",
            role: "receiver",
            type: "receiver",
            subtype: "standard",

            required: false,
            removable: true,

            allowedSubtypes: [
                "standard"
            ],

            label: "Receiver",

            x: 62,
            y: 22,

            labelPosition: "top"
        },


        {
            id: "filter_drier",
            role: "filter_drier",
            type: "filter_drier",
            subtype: "liquid_line",

            required: false,
            removable: true,

            allowedSubtypes: [
                "liquid_line"
            ],

            label: "Filter Drier",

            x: 77,
            y: 30,

            labelPosition: "top"
        },


        /*
         * Sight glass and moisture indicator are normally
         * combined into one liquid-line component.
         *
         * Only one subtype is provided, so the Component
         * tool will not display an unnecessary dropdown.
         */

        {
            id: "sight_glass",
            role: "sight_glass",
            type: "sight_glass",

            subtype:
                "sight_glass_moisture_indicator",

            required: false,
            removable: true,

            allowedSubtypes: [
                "sight_glass_moisture_indicator"
            ],

            label:
                "Sight Glass / Moisture Indicator",

            x: 84,
            y: 43,

            labelPosition: "right"
        },


        {
            id: "solenoid",
            role: "solenoid_valve",
            type: "solenoid",
            subtype: "liquid_line",

            required: false,
            removable: true,

            allowedSubtypes: [
                "liquid_line"
            ],

            label: "Solenoid",

            x: 84,
            y: 58,

            labelPosition: "right"
        },


        {
            id: "txv",
            role: "metering_device",
            type: "metering_device",
            subtype: "txv",

            required: true,
            removable: false,

            allowedSubtypes: [
                "txv",
                "eev",
                "fixed_orifice",
                "capillary_tube"
            ],

            label: "TXV",

            x: 76,
            y: 74,

            labelPosition: "right"
        },


        {
            id: "evaporator",
            role: "evaporator",
            type: "evaporator",
            subtype: "forced_air",

            required: true,
            removable: false,

            allowedSubtypes: [
                "forced_air",
                "natural_convection",
                "plate"
            ],

            label: "Evaporator",

            x: 46,
            y: 80,

            labelPosition: "bottom"
        }

    ],


    /*
     * =====================================================
     * REFRIGERANT CONNECTIONS
     * =====================================================
     */

    connections: [

        {
            from: "compressor",
            to: "condenser",
            section: "discharge"
        },

        {
            from: "condenser",
            to: "receiver",
            section: "liquid"
        },

        {
            from: "receiver",
            to: "filter_drier",
            section: "liquid"
        },

        {
            from: "filter_drier",
            to: "sight_glass",
            section: "liquid"
        },

        {
            from: "sight_glass",
            to: "solenoid",
            section: "liquid"
        },

        {
            from: "solenoid",
            to: "txv",
            section: "liquid"
        },

        {
            from: "txv",
            to: "evaporator",
            section: "expansion"
        },

        {
            from: "evaporator",
            to: "compressor",
            section: "suction"
        }

    ],


    /*
     * =====================================================
     * MEASUREMENT LOCATIONS
     * =====================================================
     *
     * IMPORTANT:
     *
     * system_diagram.js expects:
     *
     * connectionFrom
     * connectionTo
     * position
     *
     * Do not replace these with a nested
     * connection: { ... } object.
     */

    measurementPoints: [

        /*
         * -------------------------------------------------
         * 1. COMPRESSOR DISCHARGE
         * -------------------------------------------------
         */

        {
            id: "compressor_discharge",

            label:
                "Compressor Discharge / Service",

            connectionFrom: "compressor",
            connectionTo: "condenser",
            position: 0.12,

            diagnosticRole:
                "compressor_discharge",

            capabilities: {
                pressure: "available",
                temperature: "available"
            },

            measurements: [

                {
                    id: "pressure",

                    label:
                        "Discharge Pressure",

                    type: "number",

                    unit: "psig"
                },

                {
                    id: "temperature",

                    label:
                        "Discharge Line Temperature",

                    type: "number",

                    unit: "°F"
                }

            ]
        },


        /*
         * -------------------------------------------------
         * 2. CONDENSER INLET
         * -------------------------------------------------
         */

        {
            id: "condenser_inlet",

            label: "Condenser Inlet",

            connectionFrom: "compressor",
            connectionTo: "condenser",
            position: 0.88,

            diagnosticRole:
                "condenser_inlet",

            capabilities: {
                pressure: "optional",
                temperature: "available"
            },

            measurements: [

                {
                    id: "pressure",

                    label:
                        "Condenser Inlet Pressure",

                    type: "number",

                    unit: "psig"
                },

                {
                    id: "temperature",

                    label:
                        "Condenser Inlet Temperature",

                    type: "number",

                    unit: "°F"
                }

            ]
        },


        /*
         * -------------------------------------------------
         * 3. CONDENSER OUTLET
         * -------------------------------------------------
         */

        {
            id: "condenser_outlet",

            label: "Condenser Outlet",

            connectionFrom: "condenser",
            connectionTo: "receiver",
            position: 0.16,

            diagnosticRole:
                "condenser_outlet",

            capabilities: {
                pressure: "optional",
                temperature: "available"
            },

            measurements: [

                {
                    id: "pressure",

                    label:
                        "Condenser Outlet Pressure",

                    type: "number",

                    unit: "psig"
                },

                {
                    id: "temperature",

                    label:
                        "Condenser Outlet Temperature",

                    type: "number",

                    unit: "°F"
                }

            ]
        },


        /*
         * -------------------------------------------------
         * 4. RECEIVER OUTLET / KING VALVE
         * -------------------------------------------------
         */

        {
            id: "receiver_outlet",

            label:
                "Receiver Outlet / King Valve",

            connectionFrom: "receiver",
            connectionTo: "filter_drier",
            position: 0.15,

            diagnosticRole:
                "receiver_outlet",

            capabilities: {

                /*
                 * Keep this as currently designed.
                 *
                 * We may revisit the pressure-access model
                 * later because actual receiver/king-valve
                 * service access varies by equipment.
                 */

                pressure: "available",

                temperature: "available"
            },

            measurements: [

                {
                    id: "pressure",

                    label:
                        "Receiver Outlet Pressure",

                    type: "number",

                    unit: "psig"
                },

                {
                    id: "temperature",

                    label:
                        "Receiver Outlet Temperature",

                    type: "number",

                    unit: "°F"
                }

            ]
        },


        /*
         * -------------------------------------------------
         * 5. FILTER DRIER INLET
         * -------------------------------------------------
         */

        {
            id: "filter_drier_inlet",

            label: "Filter Drier Inlet",

            connectionFrom: "receiver",
            connectionTo: "filter_drier",
            position: 0.82,

            diagnosticRole:
                "filter_drier_inlet",

            capabilities: {
                pressure: "optional",
                temperature: "available"
            },

            measurements: [

                {
                    id: "pressure",

                    label:
                        "Filter Drier Inlet Pressure",

                    type: "number",

                    unit: "psig"
                },

                {
                    id: "temperature",

                    label:
                        "Filter Drier Inlet Temperature",

                    type: "number",

                    unit: "°F"
                }

            ]
        },


        /*
         * -------------------------------------------------
         * 6. FILTER DRIER OUTLET
         * -------------------------------------------------
         */

        {
            id: "filter_drier_outlet",

            label: "Filter Drier Outlet",

            connectionFrom: "filter_drier",
            connectionTo: "sight_glass",
            position: 0.18,

            diagnosticRole:
                "filter_drier_outlet",

            capabilities: {
                pressure: "optional",
                temperature: "available"
            },

            measurements: [

                {
                    id: "pressure",

                    label:
                        "Filter Drier Outlet Pressure",

                    type: "number",

                    unit: "psig"
                },

                {
                    id: "temperature",

                    label:
                        "Filter Drier Outlet Temperature",

                    type: "number",

                    unit: "°F"
                }

            ]
        },


        /*
         * -------------------------------------------------
         * 7. METERING DEVICE INLET
         * -------------------------------------------------
         */

        {
            id: "metering_device_inlet",

            label: "Metering Device Inlet",

            connectionFrom: "solenoid",
            connectionTo: "txv",
            position: 0.82,

            diagnosticRole:
                "metering_device_inlet",

            capabilities: {
                pressure: "optional",
                temperature: "available"
            },

            measurements: [

                {
                    id: "pressure",

                    label:
                        "Metering Device Inlet Pressure",

                    type: "number",

                    unit: "psig"
                },

                {
                    id: "temperature",

                    label:
                        "Metering Device Inlet Temperature",

                    type: "number",

                    unit: "°F"
                }

            ]
        },


        /*
         * -------------------------------------------------
         * 8. EVAPORATOR INLET
         * -------------------------------------------------
         */

        {
            id: "evaporator_inlet",

            label: "Evaporator Inlet",

            connectionFrom: "txv",
            connectionTo: "evaporator",
            position: 0.82,

            diagnosticRole:
                "evaporator_inlet",

            capabilities: {
                pressure: "optional",
                temperature: "available"
            },

            measurements: [

                {
                    id: "pressure",

                    label:
                        "Evaporator Inlet Pressure",

                    type: "number",

                    unit: "psig"
                },

                {
                    id: "temperature",

                    label:
                        "Evaporator Inlet Temperature",

                    type: "number",

                    unit: "°F"
                }

            ]
        },


        /*
         * -------------------------------------------------
         * 9. EVAPORATOR OUTLET
         * -------------------------------------------------
         */

        {
            id: "evaporator_outlet",

            label: "Evaporator Outlet",

            connectionFrom: "evaporator",
            connectionTo: "compressor",
            position: 0.14,

            diagnosticRole:
                "evaporator_outlet",

            capabilities: {
                pressure: "optional",
                temperature: "available"
            },

            measurements: [

                {
                    id: "pressure",

                    label:
                        "Evaporator Outlet Pressure",

                    type: "number",

                    unit: "psig"
                },

                {
                    id: "temperature",

                    label:
                        "Evaporator Outlet Temperature",

                    type: "number",

                    unit: "°F"
                }

            ]
        },


        /*
         * -------------------------------------------------
         * 10. COMPRESSOR SUCTION
         * -------------------------------------------------
         */

        {
            id: "compressor_suction",

            label:
                "Compressor Suction / Service",

            connectionFrom: "evaporator",
            connectionTo: "compressor",
            position: 0.88,

            diagnosticRole:
                "compressor_suction",

            capabilities: {
                pressure: "available",
                temperature: "available"
            },

            measurements: [

                {
                    id: "pressure",

                    label:
                        "Suction Pressure",

                    type: "number",

                    unit: "psig"
                },

                {
                    id: "temperature",

                    label:
                        "Suction Line Temperature",

                    type: "number",

                    unit: "°F"
                }

            ]
        }

    ]

};