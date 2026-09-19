/*
 * =========================================================
 * WALK-IN COOLER SYSTEM PROFILE
 * =========================================================
 *
 * This file describes the physical system.
 *
 * Application/UI code should not need HVAC-specific knowledge
 * about individual components or measurement locations.
 *
 * Major sections:
 *
 *   components
 *       Physical equipment installed in the system.
 *
 *   topology
 *       Refrigerant-flow order and refrigerant sections.
 *
 *   connections
 *       Legacy/default connection list retained during the
 *       V2 migration. Runtime topology may rebuild this list.
 *
 *   fieldData
 *       V2 semantic field-information model.
 *
 *   measurementPoints
 *       Legacy/current UI measurement model retained during
 *       migration so the existing application keeps working.
 *
 * IMPORTANT:
 *
 * fieldData is being introduced before the diagram/UI begins
 * consuming it. This allows us to migrate incrementally without
 * breaking the currently working application.
 */


export const walkInCooler = {

    id: "walk_in_cooler",

    name: "Walk-In Cooler",

    description:
        "Medium-temperature walk-in refrigeration system.",


    /*
     * =========================================================
     * COMPONENTS
     * =========================================================
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

            labelPosition: "right"
        },


        {
            id: "sight_glass",
            role: "sight_glass",
            type: "sight_glass",
            subtype: "sight_glass_moisture_indicator",

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
            subtype: "standard",

            required: false,
            removable: true,

            allowedSubtypes: [
                "standard"
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
     * =========================================================
     * TOPOLOGY
     * =========================================================
     *
     * This describes refrigerant flow independently of the
     * diagram coordinates.
     *
     * Optional components may be removed. The application can
     * then rebuild the active connection list by skipping
     * components whose installed state is false.
     */

    topology: {

        type: "single_circuit",

        paths: [

            {
                id:
                    "main_refrigerant_circuit",

                closedLoop: true,

                components: [
                    "compressor",
                    "condenser",
                    "receiver",
                    "filter_drier",
                    "sight_glass",
                    "solenoid",
                    "txv",
                    "evaporator"
                ],

                sections: [

                    {
                        id: "discharge",
                        from: "compressor",
                        until: "condenser"
                    },

                    {
                        id: "liquid",
                        from: "condenser",
                        until: "txv"
                    },

                    {
                        id: "expansion",
                        from: "txv",
                        until: "evaporator"
                    },

                    {
                        id: "suction",
                        from: "evaporator",
                        until: "compressor"
                    }
                ]
            }
        ]
    },


    /*
     * =========================================================
     * DEFAULT / LEGACY CONNECTIONS
     * =========================================================
     *
     * Retained during the V2 migration.
     *
     * The current application may replace this list at runtime
     * using the topology builder.
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
     * =========================================================
     * V2 FIELD INFORMATION MODEL
     * =========================================================
     *
     * fieldData describes what a field technician may collect
     * or calculate.
     *
     * It is intentionally independent of SVG coordinates.
     *
     * Information is separated into:
     *
     *   refrigerantLocations
     *   airLocations
     *   electrical
     *   observations
     *   controls
     *   calculations
     *
     * ---------------------------------------------------------
     * SEMANTIC LOCATION VS ACCESS
     * ---------------------------------------------------------
     *
     * A useful physical location does NOT mean that the actual
     * installation necessarily has a pressure service port.
     *
     * Pressure access:
     *
     *   available
     *       A normal/expected service-pressure location.
     *
     *   optional
     *       Pressure is diagnostically useful here, but the
     *       technician must confirm that access exists.
     *
     *   none
     *       Pressure input is not normally requested here.
     *
     * Temperature access:
     *
     *   available
     *       Surface/line temperature can normally be measured
     *       when the physical tubing is accessible.
     *
     *   optional
     *       Useful only when physical access allows it.
     *
     * ---------------------------------------------------------
     * SEMANTIC ANCHORS
     * ---------------------------------------------------------
     *
     * Refrigerant locations use:
     *
     *   anchor.component
     *   anchor.side
     *
     * instead of permanently binding a location to a particular
     * component-to-component connection.
     *
     * Example:
     *
     *   condenser_outlet belongs to the condenser outlet.
     *
     * If the receiver is removed:
     *
     *   condenser -> receiver
     *
     * becomes:
     *
     *   condenser -> filter_drier
     *
     * but condenser_outlet remains a valid semantic location.
     */


    fieldData: {


        /*
         * =====================================================
         * REFRIGERANT LOCATIONS
         * =====================================================
         */

        refrigerantLocations: [

            {
                id: "compressor_suction",

                label:
                    "Compressor Suction",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "compressor",

                    side:
                        "inlet"
                },

                position:
                    0.88,

                capabilities: {
                    pressure:
                        "available",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Suction Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Suction Line Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "suction_saturation_temperature",
                    "compressor_superheat",
                    "compression_ratio",
                    "suction_line_analysis"
                ]
            },


            {
                id: "compressor_discharge",

                label:
                    "Compressor Discharge",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "compressor",

                    side:
                        "outlet"
                },

                position:
                    0.12,

                capabilities: {
                    pressure:
                        "available",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Discharge Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Discharge Line Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "condensing_saturation_temperature",
                    "compression_ratio",
                    "discharge_temperature_analysis"
                ]
            },


            {
                id: "condenser_inlet",

                label:
                    "Condenser Inlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "condenser",

                    side:
                        "inlet"
                },

                position:
                    0.88,

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Condenser Inlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Condenser Inlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "condenser_refrigerant_analysis"
                ]
            },


            {
                id: "condenser_outlet",

                label:
                    "Condenser Outlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "condenser",

                    side:
                        "outlet"
                },

                position:
                    0.16,

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Condenser Outlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Condenser Outlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "condenser_outlet_subcooling",
                    "liquid_line_analysis"
                ]
            },


            {
                id: "receiver_inlet",

                label:
                    "Receiver Inlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "receiver",

                    side:
                        "inlet"
                },

                position:
                    0.82,

                requiresComponent:
                    "receiver",

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Receiver Inlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Receiver Inlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "receiver_inlet_analysis"
                ]
            },


            {
                id: "receiver_outlet",

                label:
                    "Receiver Outlet / King Valve",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "receiver",

                    side:
                        "outlet"
                },

                position:
                    0.15,

                requiresComponent:
                    "receiver",

                capabilities: {
                    pressure:
                        "available",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Receiver Outlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Receiver Outlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "receiver_outlet_analysis",
                    "liquid_line_analysis"
                ]
            },


            {
                id: "filter_drier_inlet",

                label:
                    "Filter Drier Inlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "filter_drier",

                    side:
                        "inlet"
                },

                position:
                    0.82,

                requiresComponent:
                    "filter_drier",

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Filter Drier Inlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Filter Drier Inlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "filter_drier_temperature_difference",
                    "filter_drier_pressure_drop"
                ]
            },


            {
                id: "filter_drier_outlet",

                label:
                    "Filter Drier Outlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "filter_drier",

                    side:
                        "outlet"
                },

                position:
                    0.18,

                requiresComponent:
                    "filter_drier",

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Filter Drier Outlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Filter Drier Outlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "filter_drier_temperature_difference",
                    "filter_drier_pressure_drop",
                    "liquid_line_analysis"
                ]
            },


            {
                id: "solenoid_inlet",

                label:
                    "Solenoid Valve Inlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "solenoid",

                    side:
                        "inlet"
                },

                position:
                    0.82,

                requiresComponent:
                    "solenoid",

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Solenoid Inlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Solenoid Inlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "solenoid_temperature_difference",
                    "solenoid_pressure_drop"
                ]
            },


            {
                id: "solenoid_outlet",

                label:
                    "Solenoid Valve Outlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "solenoid",

                    side:
                        "outlet"
                },

                position:
                    0.18,

                requiresComponent:
                    "solenoid",

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Solenoid Outlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Solenoid Outlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "solenoid_temperature_difference",
                    "solenoid_pressure_drop",
                    "liquid_line_analysis"
                ]
            },


            {
                id: "metering_device_inlet",

                label:
                    "Metering Device Inlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "txv",

                    side:
                        "inlet"
                },

                position:
                    0.82,

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Metering Device Inlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Temperature Before Metering Device",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "metering_device_inlet_subcooling",
                    "liquid_line_analysis"
                ]
            },


            {
                id: "metering_device_outlet",

                label:
                    "Metering Device Outlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "txv",

                    side:
                        "outlet"
                },

                position:
                    0.18,

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "optional"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Metering Device Outlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Metering Device Outlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "metering_device_analysis"
                ]
            },


            {
                id: "evaporator_inlet",

                label:
                    "Evaporator Inlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "evaporator",

                    side:
                        "inlet"
                },

                position:
                    0.82,

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "optional"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Evaporator Inlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Evaporator Inlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "evaporator_feed_analysis",
                    "evaporator_pressure_drop"
                ]
            },


            {
                id: "evaporator_outlet",

                label:
                    "Evaporator Outlet",

                category:
                    "refrigerant",

                anchor: {
                    component:
                        "evaporator",

                    side:
                        "outlet"
                },

                position:
                    0.14,

                capabilities: {
                    pressure:
                        "optional",

                    temperature:
                        "available"
                },

                measurements: [

                    {
                        id: "pressure",

                        label:
                            "Evaporator Outlet Pressure",

                        unit:
                            "psig",

                        inputType:
                            "number"
                    },

                    {
                        id: "temperature",

                        label:
                            "Evaporator Outlet Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "evaporator_superheat",
                    "evaporator_pressure_drop",
                    "suction_line_analysis"
                ]
            }
        ],


        /*
         * =====================================================
         * AIR / SPACE LOCATIONS
         * =====================================================
         *
         * These are not refrigerant-line measurement dots.
         *
         * Later the diagram/UI may represent them with a
         * different symbol and interaction.
         */

        airLocations: [

            {
                id:
                    "box_temperature",

                label:
                    "Box Temperature",

                category:
                    "space",

                context:
                    "refrigerated_space",

                measurements: [

                    {
                        id:
                            "temperature",

                        label:
                            "Box Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "evaporator_td"
                ]
            },


            {
                id:
                    "evaporator_entering_air",

                label:
                    "Evaporator Entering Air",

                category:
                    "air",

                anchor: {
                    component:
                        "evaporator",

                    side:
                        "air_inlet"
                },

                measurements: [

                    {
                        id:
                            "temperature",

                        label:
                            "Entering Air Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "evaporator_air_delta_t"
                ]
            },


            {
                id:
                    "evaporator_leaving_air",

                label:
                    "Evaporator Leaving Air",

                category:
                    "air",

                anchor: {
                    component:
                        "evaporator",

                    side:
                        "air_outlet"
                },

                measurements: [

                    {
                        id:
                            "temperature",

                        label:
                            "Leaving Air Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "evaporator_air_delta_t"
                ]
            },


            {
                id:
                    "condenser_entering_air",

                label:
                    "Condenser Entering Air / Ambient",

                category:
                    "air",

                anchor: {
                    component:
                        "condenser",

                    side:
                        "air_inlet"
                },

                measurements: [

                    {
                        id:
                            "temperature",

                        label:
                            "Entering Air Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "condenser_split",
                    "condenser_air_delta_t"
                ]
            },


            {
                id:
                    "condenser_leaving_air",

                label:
                    "Condenser Leaving Air",

                category:
                    "air",

                anchor: {
                    component:
                        "condenser",

                    side:
                        "air_outlet"
                },

                measurements: [

                    {
                        id:
                            "temperature",

                        label:
                            "Leaving Air Temperature",

                        unit:
                            "°F",

                        inputType:
                            "number"
                    }
                ],

                supportsCalculations: [
                    "condenser_air_delta_t"
                ]
            }
        ],


        /*
         * =====================================================
         * ELECTRICAL MEASUREMENTS
         * =====================================================
         *
         * These belong primarily to components rather than
         * refrigerant-line locations.
         */

        electrical: [

            {
                id:
                    "compressor_electrical",

                component:
                    "compressor",

                measurements: [

                    {
                        id:
                            "supply_voltage",

                        label:
                            "Supply Voltage",

                        unit:
                            "V",

                        inputType:
                            "number"
                    },

                    {
                        id:
                            "running_amps",

                        label:
                            "Running Amps",

                        unit:
                            "A",

                        inputType:
                            "number"
                    }
                ]
            },


            {
                id:
                    "condenser_fan_electrical",

                component:
                    "condenser",

                measurements: [

                    {
                        id:
                            "fan_voltage",

                        label:
                            "Fan Voltage",

                        unit:
                            "V",

                        inputType:
                            "number"
                    },

                    {
                        id:
                            "fan_running_amps",

                        label:
                            "Fan Running Amps",

                        unit:
                            "A",

                        inputType:
                            "number"
                    }
                ]
            },


            {
                id:
                    "evaporator_fan_electrical",

                component:
                    "evaporator",

                measurements: [

                    {
                        id:
                            "fan_voltage",

                        label:
                            "Fan Voltage",

                        unit:
                            "V",

                        inputType:
                            "number"
                    },

                    {
                        id:
                            "fan_running_amps",

                        label:
                            "Fan Running Amps",

                        unit:
                            "A",

                        inputType:
                            "number"
                    }
                ]
            },


            {
                id:
                    "solenoid_electrical",

                component:
                    "solenoid",

                requiresComponent:
                    "solenoid",

                measurements: [

                    {
                        id:
                            "coil_voltage",

                        label:
                            "Coil Voltage",

                        unit:
                            "V",

                        inputType:
                            "number"
                    },

                    {
                        id:
                            "coil_resistance",

                        label:
                            "Coil Resistance",

                        unit:
                            "Ω",

                        inputType:
                            "number"
                    }
                ]
            }
        ],


        /*
         * =====================================================
         * COMPONENT OBSERVATIONS
         * =====================================================
         *
         * Structured observations are preferred over a single
         * large notes field because structured evidence can be
         * used by the future diagnostic engine.
         *
         * Every group may still provide technician notes.
         */

        observations: [

            {
                id:
                    "compressor_observations",

                component:
                    "compressor",

                fields: [

                    {
                        id:
                            "running_state",

                        label:
                            "Operating State",

                        type:
                            "select",

                        options: [
                            "running",
                            "off",
                            "cycling",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "noise",

                        label:
                            "Unusual Noise",

                        type:
                            "select",

                        options: [
                            "no",
                            "yes",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "vibration",

                        label:
                            "Excessive Vibration",

                        type:
                            "select",

                        options: [
                            "no",
                            "yes",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "oil_evidence",

                        label:
                            "Oil Evidence / Leakage",

                        type:
                            "select",

                        options: [
                            "none",
                            "present",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "notes",

                        label:
                            "Notes",

                        type:
                            "textarea"
                    }
                ]
            },


            {
                id:
                    "condenser_observations",

                component:
                    "condenser",

                fields: [

                    {
                        id:
                            "coil_condition",

                        label:
                            "Coil Condition",

                        type:
                            "select",

                        options: [
                            "clean",
                            "dirty",
                            "blocked",
                            "damaged",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "fan_operation",

                        label:
                            "Fan Operation",

                        type:
                            "select",

                        options: [
                            "normal",
                            "not_running",
                            "intermittent",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "airflow",

                        label:
                            "Airflow",

                        type:
                            "select",

                        options: [
                            "normal",
                            "low",
                            "blocked",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "air_recirculation",

                        label:
                            "Hot-Air Recirculation",

                        type:
                            "select",

                        options: [
                            "no",
                            "yes",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "notes",

                        label:
                            "Notes",

                        type:
                            "textarea"
                    }
                ]
            },


            {
                id:
                    "receiver_observations",

                component:
                    "receiver",

                requiresComponent:
                    "receiver",

                fields: [

                    {
                        id:
                            "visible_condition",

                        label:
                            "Visible Condition",

                        type:
                            "select",

                        options: [
                            "normal",
                            "corrosion",
                            "oil_evidence",
                            "damage",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "notes",

                        label:
                            "Notes",

                        type:
                            "textarea"
                    }
                ]
            },


            {
                id:
                    "filter_drier_observations",

                component:
                    "filter_drier",

                requiresComponent:
                    "filter_drier",

                fields: [

                    {
                        id:
                            "outlet_sweating",

                        label:
                            "Outlet Sweating",

                        type:
                            "select",

                        options: [
                            "no",
                            "yes",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "outlet_frosting",

                        label:
                            "Outlet Frosting",

                        type:
                            "select",

                        options: [
                            "no",
                            "yes",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "visible_condition",

                        label:
                            "Visible Condition",

                        type:
                            "select",

                        options: [
                            "normal",
                            "corrosion",
                            "damage",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "notes",

                        label:
                            "Notes",

                        type:
                            "textarea"
                    }
                ]
            },


            {
                id:
                    "sight_glass_observations",

                component:
                    "sight_glass",

                requiresComponent:
                    "sight_glass",

                fields: [

                    {
                        id:
                            "refrigerant_appearance",

                        label:
                            "Refrigerant Appearance",

                        type:
                            "select",

                        options: [
                            "clear",
                            "occasional_bubbles",
                            "continuous_bubbles",
                            "flashing_or_frothing",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "moisture_indicator",

                        label:
                            "Moisture Indicator",

                        type:
                            "select",

                        options: [
                            "dry",
                            "wet",
                            "intermediate",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "notes",

                        label:
                            "Notes",

                        type:
                            "textarea"
                    }
                ]
            },


            {
                id:
                    "solenoid_observations",

                component:
                    "solenoid",

                requiresComponent:
                    "solenoid",

                fields: [

                    {
                        id:
                            "energized",

                        label:
                            "Coil Energized",

                        type:
                            "select",

                        options: [
                            "yes",
                            "no",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "valve_operation",

                        label:
                            "Valve Operation",

                        type:
                            "select",

                        options: [
                            "opens_normally",
                            "does_not_open",
                            "does_not_close",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "notes",

                        label:
                            "Notes",

                        type:
                            "textarea"
                    }
                ]
            },


            {
                id:
                    "metering_device_observations",

                component:
                    "txv",

                fields: [

                    {
                        id:
                            "hunting",

                        label:
                            "Hunting",

                        type:
                            "select",

                        appliesToSubtypes: [
                            "txv",
                            "eev"
                        ],

                        options: [
                            "no",
                            "yes",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "bulb_contact",

                        label:
                            "Sensing Bulb Contact",

                        type:
                            "select",

                        appliesToSubtypes: [
                            "txv"
                        ],

                        options: [
                            "good",
                            "poor",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "bulb_position",

                        label:
                            "Sensing Bulb Position",

                        type:
                            "select",

                        appliesToSubtypes: [
                            "txv"
                        ],

                        options: [
                            "appears_correct",
                            "appears_incorrect",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "bulb_insulation",

                        label:
                            "Sensing Bulb Insulation",

                        type:
                            "select",

                        appliesToSubtypes: [
                            "txv"
                        ],

                        options: [
                            "good",
                            "missing_or_poor",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "equalizer_condition",

                        label:
                            "External Equalizer",

                        type:
                            "select",

                        appliesToSubtypes: [
                            "txv"
                        ],

                        options: [
                            "good",
                            "issue_observed",
                            "not_applicable",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "notes",

                        label:
                            "Notes",

                        type:
                            "textarea"
                    }
                ]
            },


            {
                id:
                    "evaporator_observations",

                component:
                    "evaporator",

                fields: [

                    {
                        id:
                            "coil_condition",

                        label:
                            "Coil Condition",

                        type:
                            "select",

                        options: [
                            "clean",
                            "dirty",
                            "partially_iced",
                            "fully_iced",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "frost_pattern",

                        label:
                            "Frost Pattern",

                        type:
                            "select",

                        options: [
                            "normal_even",
                            "inlet_only",
                            "partial_coil",
                            "heavy_even",
                            "none",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "fan_operation",

                        label:
                            "Fan Operation",

                        type:
                            "select",

                        options: [
                            "normal",
                            "not_running",
                            "intermittent",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "airflow",

                        label:
                            "Airflow",

                        type:
                            "select",

                        options: [
                            "normal",
                            "low",
                            "blocked",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "notes",

                        label:
                            "Notes",

                        type:
                            "textarea"
                    }
                ]
            }
        ],


        /*
         * =====================================================
         * CONTROLS / OPERATION
         * =====================================================
         *
         * These describe system operating controls.
         *
         * They are intentionally separate from refrigerant
         * measurement locations.
         */

        controls: [

            {
                id:
                    "temperature_controller",

                label:
                    "Temperature Controller",

                fields: [

                    {
                        id:
                            "setpoint",

                        label:
                            "Setpoint",

                        unit:
                            "°F",

                        type:
                            "number"
                    },

                    {
                        id:
                            "differential",

                        label:
                            "Differential",

                        unit:
                            "°F",

                        type:
                            "number"
                    },

                    {
                        id:
                            "sensor_temperature",

                        label:
                            "Controller Sensor Temperature",

                        unit:
                            "°F",

                        type:
                            "number"
                    }
                ]
            },


            {
                id:
                    "low_pressure_control",

                label:
                    "Low Pressure Control",

                fields: [

                    {
                        id:
                            "cut_in",

                        label:
                            "Cut-In Pressure",

                        unit:
                            "psig",

                        type:
                            "number"
                    },

                    {
                        id:
                            "cut_out",

                        label:
                            "Cut-Out Pressure",

                        unit:
                            "psig",

                        type:
                            "number"
                    },

                    {
                        id:
                            "contact_state",

                        label:
                            "Current Contact State",

                        type:
                            "select",

                        options: [
                            "open",
                            "closed",
                            "unknown"
                        ]
                    }
                ]
            },


            {
                id:
                    "high_pressure_control",

                label:
                    "High Pressure Control",

                fields: [

                    {
                        id:
                            "cut_out",

                        label:
                            "Cut-Out Pressure",

                        unit:
                            "psig",

                        type:
                            "number"
                    },

                    {
                        id:
                            "contact_state",

                        label:
                            "Current Contact State",

                        type:
                            "select",

                        options: [
                            "open",
                            "closed",
                            "unknown"
                        ]
                    }
                ]
            },


            {
                id:
                    "defrost_control",

                label:
                    "Defrost Control",

                fields: [

                    {
                        id:
                            "defrost_type",

                        label:
                            "Defrost Type",

                        type:
                            "select",

                        options: [
                            "off_cycle",
                            "electric",
                            "hot_gas",
                            "other",
                            "unknown"
                        ]
                    },

                    {
                        id:
                            "schedule",

                        label:
                            "Schedule",

                        type:
                            "text"
                    },

                    {
                        id:
                            "duration",

                        label:
                            "Duration",

                        unit:
                            "min",

                        type:
                            "number"
                    },

                    {
                        id:
                            "termination_temperature",

                        label:
                            "Termination Temperature",

                        unit:
                            "°F",

                        type:
                            "number"
                    },

                    {
                        id:
                            "current_state",

                        label:
                            "Current State",

                        type:
                            "select",

                        options: [
                            "refrigeration",
                            "defrost",
                            "drip",
                            "fan_delay",
                            "unknown"
                        ]
                    }
                ]
            }
        ],


        /*
         * =====================================================
         * CALCULATIONS
         * =====================================================
         *
         * These are definitions only.
         *
         * No calculation engine is being added in this step.
         *
         * inputs describe the semantic field information needed
         * by the future calculation engine.
         */

        calculations: [

            {
                id:
                    "suction_saturation_temperature",

                label:
                    "Suction Saturation Temperature",

                shortLabel:
                    "SST",

                category:
                    "refrigerant",

                requires: [
                    "refrigerant",
                    "compressor_suction.pressure"
                ]
            },


            {
                id:
                    "condensing_saturation_temperature",

                label:
                    "Condensing Saturation Temperature",

                shortLabel:
                    "SCT",

                category:
                    "refrigerant",

                requires: [
                    "refrigerant",
                    "compressor_discharge.pressure"
                ]
            },


            {
                id:
                    "evaporator_superheat",

                label:
                    "Evaporator Superheat",

                category:
                    "superheat",

                requires: [
                    "evaporator_outlet.temperature",
                    "evaporating_saturation_temperature"
                ]
            },


            {
                id:
                    "compressor_superheat",

                label:
                    "Compressor / Total Superheat",

                category:
                    "superheat",

                requires: [
                    "compressor_suction.temperature",
                    "suction_saturation_temperature"
                ]
            },


            {
                id:
                    "condenser_outlet_subcooling",

                label:
                    "Condenser Outlet Subcooling",

                category:
                    "subcooling",

                requires: [
                    "condensing_saturation_temperature",
                    "condenser_outlet.temperature"
                ]
            },


            {
                id:
                    "metering_device_inlet_subcooling",

                label:
                    "Subcooling at Metering Device Inlet",

                category:
                    "subcooling",

                requires: [
                    "metering_device_inlet.pressure_or_valid_reference",
                    "metering_device_inlet.temperature"
                ]
            },


            {
                id:
                    "suction_line_temperature_gain",

                label:
                    "Suction Line Temperature Gain",

                category:
                    "temperature_difference",

                requires: [
                    "compressor_suction.temperature",
                    "evaporator_outlet.temperature"
                ]
            },


            {
                id:
                    "suction_line_pressure_drop",

                label:
                    "Suction Line Pressure Drop",

                category:
                    "pressure_difference",

                requires: [
                    "evaporator_outlet.pressure",
                    "compressor_suction.pressure"
                ]
            },


            {
                id:
                    "filter_drier_temperature_difference",

                label:
                    "Filter Drier Temperature Difference",

                category:
                    "temperature_difference",

                requiresComponent:
                    "filter_drier",

                requires: [
                    "filter_drier_inlet.temperature",
                    "filter_drier_outlet.temperature"
                ]
            },


            {
                id:
                    "filter_drier_pressure_drop",

                label:
                    "Filter Drier Pressure Drop",

                category:
                    "pressure_difference",

                requiresComponent:
                    "filter_drier",

                requires: [
                    "filter_drier_inlet.pressure",
                    "filter_drier_outlet.pressure"
                ]
            },


            {
                id:
                    "solenoid_temperature_difference",

                label:
                    "Solenoid Temperature Difference",

                category:
                    "temperature_difference",

                requiresComponent:
                    "solenoid",

                requires: [
                    "solenoid_inlet.temperature",
                    "solenoid_outlet.temperature"
                ]
            },


            {
                id:
                    "solenoid_pressure_drop",

                label:
                    "Solenoid Pressure Drop",

                category:
                    "pressure_difference",

                requiresComponent:
                    "solenoid",

                requires: [
                    "solenoid_inlet.pressure",
                    "solenoid_outlet.pressure"
                ]
            },


            {
                id:
                    "evaporator_air_delta_t",

                label:
                    "Evaporator Air Temperature Difference",

                shortLabel:
                    "Evaporator ΔT",

                category:
                    "air",

                requires: [
                    "evaporator_entering_air.temperature",
                    "evaporator_leaving_air.temperature"
                ]
            },


            {
                id:
                    "evaporator_td",

                label:
                    "Evaporator Temperature Difference",

                shortLabel:
                    "Evaporator TD",

                category:
                    "air_refrigerant",

                requires: [
                    "box_temperature.temperature",
                    "evaporating_saturation_temperature"
                ]
            },


            {
                id:
                    "condenser_split",

                label:
                    "Condenser Split",

                category:
                    "air_refrigerant",

                requires: [
                    "condensing_saturation_temperature",
                    "condenser_entering_air.temperature"
                ]
            },


            {
                id:
                    "condenser_air_delta_t",

                label:
                    "Condenser Air Temperature Difference",

                shortLabel:
                    "Condenser Air ΔT",

                category:
                    "air",

                requires: [
                    "condenser_entering_air.temperature",
                    "condenser_leaving_air.temperature"
                ]
            },


            {
                id:
                    "compression_ratio",

                label:
                    "Compression Ratio",

                category:
                    "compressor",

                requires: [
                    "compressor_suction.pressure",
                    "compressor_discharge.pressure"
                ],

                pressureBasis:
                    "absolute"
            }
        ]
    },


    /*
     * =========================================================
     * LEGACY / CURRENT MEASUREMENT POINTS
     * =========================================================
     *
     * IMPORTANT:
     *
     * Keep this section during the migration.
     *
     * The current app.js and system_diagram.js still consume
     * measurementPoints.
     *
     * In the next development step the diagram engine will begin
     * consuming fieldData.refrigerantLocations and resolving the
     * semantic anchors against the ACTIVE topology.
     *
     * After that migration is proven stable, this legacy section
     * can be removed.
     */

    measurementPoints: [

        {
            id:
                "compressor_discharge",

            label:
                "Compressor Discharge",

            connectionFrom:
                "compressor",

            connectionTo:
                "condenser",

            position:
                0.12,

            diagnosticRole:
                "compressor_discharge",

            capabilities: {
                pressure:
                    "available",

                temperature:
                    "available"
            },

            measurements: [

                {
                    id:
                        "pressure",

                    label:
                        "Discharge Pressure",

                    unit:
                        "psig",

                    inputType:
                        "number"
                },

                {
                    id:
                        "temperature",

                    label:
                        "Discharge Line Temperature",

                    unit:
                        "°F",

                    inputType:
                        "number"
                }
            ]
        },


        {
            id:
                "condenser_inlet",

            label:
                "Condenser Inlet",

            connectionFrom:
                "compressor",

            connectionTo:
                "condenser",

            position:
                0.88,

            diagnosticRole:
                "condenser_inlet",

            capabilities: {
                pressure:
                    "optional",

                temperature:
                    "available"
            },

            measurements: [

                {
                    id:
                        "pressure",

                    label:
                        "Condenser Inlet Pressure",

                    unit:
                        "psig",

                    inputType:
                        "number"
                },

                {
                    id:
                        "temperature",

                    label:
                        "Condenser Inlet Temperature",

                    unit:
                        "°F",

                    inputType:
                        "number"
                }
            ]
        },


        {
            id:
                "condenser_outlet",

            label:
                "Condenser Outlet",

            connectionFrom:
                "condenser",

            connectionTo:
                "receiver",

            position:
                0.16,

            diagnosticRole:
                "condenser_outlet",

            capabilities: {
                pressure:
                    "optional",

                temperature:
                    "available"
            },

            measurements: [

                {
                    id:
                        "pressure",

                    label:
                        "Condenser Outlet Pressure",

                    unit:
                        "psig",

                    inputType:
                        "number"
                },

                {
                    id:
                        "temperature",

                    label:
                        "Condenser Outlet Temperature",

                    unit:
                        "°F",

                    inputType:
                        "number"
                }
            ]
        },


        {
            id:
                "receiver_outlet",

            label:
                "Receiver Outlet / King Valve",

            connectionFrom:
                "receiver",

            connectionTo:
                "filter_drier",

            position:
                0.15,

            diagnosticRole:
                "receiver_outlet",

            capabilities: {
                pressure:
                    "available",

                temperature:
                    "available"
            },

            measurements: [

                {
                    id:
                        "pressure",

                    label:
                        "Receiver Outlet Pressure",

                    unit:
                        "psig",

                    inputType:
                        "number"
                },

                {
                    id:
                        "temperature",

                    label:
                        "Receiver Outlet Temperature",

                    unit:
                        "°F",

                    inputType:
                        "number"
                }
            ]
        },


        {
            id:
                "filter_drier_inlet",

            label:
                "Filter Drier Inlet",

            connectionFrom:
                "receiver",

            connectionTo:
                "filter_drier",

            position:
                0.82,

            diagnosticRole:
                "filter_drier_inlet",

            capabilities: {
                pressure:
                    "optional",

                temperature:
                    "available"
            },

            measurements: [

                {
                    id:
                        "pressure",

                    label:
                        "Filter Drier Inlet Pressure",

                    unit:
                        "psig",

                    inputType:
                        "number"
                },

                {
                    id:
                        "temperature",

                    label:
                        "Filter Drier Inlet Temperature",

                    unit:
                        "°F",

                    inputType:
                        "number"
                }
            ]
        },


        {
            id:
                "filter_drier_outlet",

            label:
                "Filter Drier Outlet",

            connectionFrom:
                "filter_drier",

            connectionTo:
                "sight_glass",

            position:
                0.18,

            diagnosticRole:
                "filter_drier_outlet",

            capabilities: {
                pressure:
                    "optional",

                temperature:
                    "available"
            },

            measurements: [

                {
                    id:
                        "pressure",

                    label:
                        "Filter Drier Outlet Pressure",

                    unit:
                        "psig",

                    inputType:
                        "number"
                },

                {
                    id:
                        "temperature",

                    label:
                        "Filter Drier Outlet Temperature",

                    unit:
                        "°F",

                    inputType:
                        "number"
                }
            ]
        },


        {
            id:
                "metering_device_inlet",

            label:
                "Metering Device Inlet",

            connectionFrom:
                "solenoid",

            connectionTo:
                "txv",

            position:
                0.82,

            diagnosticRole:
                "metering_device_inlet",

            capabilities: {
                pressure:
                    "optional",

                temperature:
                    "available"
            },

            measurements: [

                {
                    id:
                        "pressure",

                    label:
                        "Metering Device Inlet Pressure",

                    unit:
                        "psig",

                    inputType:
                        "number"
                },

                {
                    id:
                        "temperature",

                    label:
                        "Temperature Before Metering Device",

                    unit:
                        "°F",

                    inputType:
                        "number"
                }
            ]
        },


        {
            id:
                "evaporator_inlet",

            label:
                "Evaporator Inlet",

            connectionFrom:
                "txv",

            connectionTo:
                "evaporator",

            position:
                0.82,

            diagnosticRole:
                "evaporator_inlet",

            capabilities: {
                pressure:
                    "optional",

                temperature:
                    "available"
            },

            measurements: [

                {
                    id:
                        "pressure",

                    label:
                        "Evaporator Inlet Pressure",

                    unit:
                        "psig",

                    inputType:
                        "number"
                },

                {
                    id:
                        "temperature",

                    label:
                        "Evaporator Inlet Temperature",

                    unit:
                        "°F",

                    inputType:
                        "number"
                }
            ]
        },


        {
            id:
                "evaporator_outlet",

            label:
                "Evaporator Outlet",

            connectionFrom:
                "evaporator",

            connectionTo:
                "compressor",

            position:
                0.14,

            diagnosticRole:
                "evaporator_outlet",

            capabilities: {
                pressure:
                    "optional",

                temperature:
                    "available"
            },

            measurements: [

                {
                    id:
                        "pressure",

                    label:
                        "Evaporator Outlet Pressure",

                    unit:
                        "psig",

                    inputType:
                        "number"
                },

                {
                    id:
                        "temperature",

                    label:
                        "Evaporator Outlet Temperature",

                    unit:
                        "°F",

                    inputType:
                        "number"
                }
            ]
        },


        {
            id:
                "compressor_suction",

            label:
                "Compressor Suction",

            connectionFrom:
                "evaporator",

            connectionTo:
                "compressor",

            position:
                0.88,

            diagnosticRole:
                "compressor_suction",

            capabilities: {
                pressure:
                    "available",

                temperature:
                    "available"
            },

            measurements: [

                {
                    id:
                        "pressure",

                    label:
                        "Suction Pressure",

                    unit:
                        "psig",

                    inputType:
                        "number"
                },

                {
                    id:
                        "temperature",

                    label:
                        "Suction Line Temperature",

                    unit:
                        "°F",

                    inputType:
                        "number"
                }
            ]
        }
    ]
};