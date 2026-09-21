import {
    walkInCooler
} from "./systems/walk_in_cooler.js";

import {
    acSplit
} from "./systems/ac_split.js";

import {
    renderSystemDiagram
} from "./components/system_diagram.js";


const systems = {
    walk_in_cooler: walkInCooler,
    ac_split: acSplit
};


const systemSelect =
    document.getElementById("system-select");

const refrigerantSelect =
    document.getElementById("refrigerant-select");

const diagramContainer =
    document.getElementById("system-diagram");

const systemTitle =
    document.getElementById("system-title");

const systemDescription =
    document.getElementById("system-description");

const measurementContent =
    document.getElementById("measurement-content");

const originalPanelTitle =
    document.querySelector(
        ".measurement-panel h2"
    );

const originalPanelHelp =
    document.querySelector(
        ".measurement-help"
    );


/*
 * =========================================================
 * APPLICATION STATE
 * =========================================================
 */

let currentSystem = null;

let activeTool =
    "measurements";

let addMeasurementMode =
    false;

let selectedComponent =
    null;

let selectedMeasurementPoint =
    null;


/*
 * Component UI state
 */
let systemComponentsExpanded =
    false;

let activeComponentTab =
    "overview";


/*
 * =========================================================
 * MEASUREMENT / FIELD STATE
 * =========================================================
 */

const activeMeasurementPoints =
    new Map();

const measurementValues =
    new Map();

const optionalPressureAccess =
    new Set();

const componentObservationValues =
    new Map();

const componentElectricalValues =
    new Map();

/* Refrigerant / P-T state */
let refrigerants = [];
let selectedRefrigerant = null;
let currentRefrigerantRows = [];
const refrigerantDataCache = new Map();

/* Reference / design data loaded from data/reference_values.csv */
let referenceValues = [];


function electricalKey(
    componentId,
    fieldId
) {

    return (
        `${componentId}:` +
        `${fieldId}`
    );
}


function observationKey(
    componentId,
    fieldId
) {

    return (
        `${componentId}:` +
        `${fieldId}`
    );
}


function measurementKey(
    pointId,
    measurementId
) {

    return (
        `${pointId}:` +
        `${measurementId}`
    );
}


/*
 * =========================================================
 * LABEL HELPERS
 * =========================================================
 */

function formatSubtypeLabel(
    subtype
) {

    const labels = {

        reciprocating:
            "Reciprocating",

        scroll:
            "Scroll",

        rotary:
            "Rotary",

        screw:
            "Screw",

        air_cooled:
            "Air-Cooled",

        water_cooled:
            "Water-Cooled",

        evaporative:
            "Evaporative",

        txv:
            "TXV",

        eev:
            "EEV",

        fixed_orifice:
            "Fixed Orifice / Piston",

        capillary_tube:
            "Capillary Tube",

        forced_air:
            "Forced-Air",

        natural_convection:
            "Natural-Convection",

        plate:
            "Plate",

        standard:
            "Standard",

        liquid_line:
            "Liquid Line",

        sight_glass_moisture_indicator:
            "Sight Glass / Moisture Indicator"
    };


    return (
        labels[subtype] ||
        subtype
            .replaceAll(
                "_",
                " "
            )
            .replace(
                /\b\w/g,
                character =>
                    character
                        .toUpperCase()
            )
    );
}


function formatObservationOptionLabel(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)
        .replaceAll(
            "_",
            " "
        )
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );
}


function componentRoleLabel(
    component
) {

    const labels = {

        compressor:
            "Compressor",

        condenser:
            "Condenser",

        metering_device:
            "Metering Device",

        evaporator:
            "Evaporator",

        receiver:
            "Receiver",

        filter_drier:
            "Filter Drier",

        sight_glass:
            "Sight Glass / Moisture Indicator",

        solenoid_valve:
            "Solenoid Valve"
    };


    return (
        labels[component.role] ||
        component.label
    );
}


function componentDisplayLabel(
    component
) {

    if (
        component.role ===
        "metering_device"
    ) {

        return formatSubtypeLabel(
            component.subtype
        );
    }


    return componentRoleLabel(
        component
    );
}


/*
 * =========================================================
 * COMPONENT INSTALLATION
 * =========================================================
 */

function isComponentInstalled(
    component
) {

    return (
        component.installed !==
        false
    );
}


function initializeComponentInstallationState(
    system
) {

    (
        system.components ||
        []
    ).forEach(
        component => {

            if (
                component.required ||
                component.removable === false
            ) {

                component.installed =
                    true;

                return;
            }


            if (
                typeof component.installed !==
                "boolean"
            ) {

                component.installed =
                    true;
            }
        }
    );
}


/*
 * =========================================================
 * TOPOLOGY
 * =========================================================
 */

function buildConnectionsFromTopology(
    system
) {

    const paths =
        system.topology?.paths ||
        [];


    if (
        paths.length === 0
    ) {

        return (
            system.connections ||
            []
        );
    }


    const componentMap =
        Object.fromEntries(

            (
                system.components ||
                []
            ).map(
                component => [
                    component.id,
                    component
                ]
            )
        );


    const generatedConnections =
        [];


    paths.forEach(
        path => {

            const pathComponentIds =
                path.components ||
                [];

            const sections =
                path.sections ||
                [];


            if (
                pathComponentIds.length <
                2
            ) {

                return;
            }


            const sectionStartMap =
                new Map(

                    sections.map(
                        section => [
                            section.from,
                            section.id
                        ]
                    )
                );


            let activeSection =
                null;


            const sectionByComponentId =
                new Map();


            pathComponentIds.forEach(
                componentId => {

                    if (
                        sectionStartMap.has(
                            componentId
                        )
                    ) {

                        activeSection =
                            sectionStartMap.get(
                                componentId
                            );
                    }


                    sectionByComponentId.set(
                        componentId,
                        activeSection
                    );
                }
            );


            const installedComponentIds =
                pathComponentIds.filter(
                    componentId => {

                        const component =
                            componentMap[
                                componentId
                            ];


                        return (
                            component &&
                            isComponentInstalled(
                                component
                            )
                        );
                    }
                );


            if (
                installedComponentIds.length <
                2
            ) {

                return;
            }


            for (
                let index = 0;
                index <
                installedComponentIds.length - 1;
                index += 1
            ) {

                const from =
                    installedComponentIds[
                        index
                    ];

                const to =
                    installedComponentIds[
                        index + 1
                    ];


                generatedConnections.push({
                    from,
                    to,

                    section:
                        sectionByComponentId.get(
                            from
                        ) || null
                });
            }


            if (
                path.closedLoop
            ) {

                const from =
                    installedComponentIds[
                        installedComponentIds
                            .length - 1
                    ];

                const to =
                    installedComponentIds[0];


                generatedConnections.push({
                    from,
                    to,

                    section:
                        sectionByComponentId.get(
                            from
                        ) || null
                });
            }
        }
    );


    return generatedConnections;
}


function rebuildSystemConnections() {

    if (!currentSystem) {
        return;
    }


    currentSystem.connections =
        buildConnectionsFromTopology(
            currentSystem
        );
}


/*
 * =========================================================
 * DIAGRAM
 * =========================================================
 */

function updateBoxTemperatureStatus() {

    if (!systemTitle) {
        return;
    }


    let status =
        document.getElementById(
            "box-temperature-status"
        );


    if (!status) {

        status =
            document.createElement(
                "div"
            );

        status.id =
            "box-temperature-status";

        status.style.marginTop = "7px";
        status.style.fontSize = "13px";
        status.style.color = "#5f7485";

        /*
         * Box temperature is a system/space condition, so keep
         * it with the system description instead of inside the
         * refrigeration diagram.
         */
        if (systemDescription) {
            systemDescription.insertAdjacentElement(
                "afterend",
                status
            );
        } else {
            systemTitle.insertAdjacentElement(
                "afterend",
                status
            );
        }
    }


    const value =
        measurementValues.get(
            measurementKey(
                "box_temperature",
                "temperature"
            )
        );


    const hasValue =
        value !== undefined &&
        value !== null &&
        String(value).trim() !== "";


    status.innerHTML =
        hasValue
            ? `Box Temperature&nbsp;&nbsp;<strong style="color:#277fb5; font-weight:600;">${value}°F</strong>`
            : `Box Temperature&nbsp;&nbsp;<span style="color:#8a9aa7;">—</span>`;
}


function renderCurrentSystem() {

    if (!currentSystem) {
        return;
    }


    updateBoxTemperatureStatus();


    renderSystemDiagram(
        diagramContainer,
        currentSystem,
        {

            activeMeasurementPointIds:
                new Set(
                    activeMeasurementPoints
                        .keys()
                ),

            addMeasurementMode,

            selectedComponentId:
                activeTool === "component"
                    ? selectedComponent?.id ||
                        null
                    : null,

            airMeasurementLocations:
                getAirMeasurementLocations(),

            airMeasurementValues:
                measurementValues,

            selectedAirMeasurementId:
                activeTool === "measurements" &&
                isAirMeasurementLocation(
                    selectedMeasurementPoint
                )
                    ? selectedMeasurementPoint.id
                    : null
        }
    );
}


/*
 * =========================================================
 * TOOL ICONS
 * =========================================================
 */

function measurementsIconSvg() {

    return `
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <circle
                cx="12"
                cy="12"
                r="7"
            ></circle>

            <line
                x1="12"
                y1="12"
                x2="16"
                y2="8"
            ></line>

            <circle
                cx="12"
                cy="12"
                r="1.5"
            ></circle>
        </svg>
    `;
}


function calculationsIconSvg() {

    return `
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <rect
                x="5"
                y="3"
                width="14"
                height="18"
                rx="2"
            ></rect>

            <line x1="8" y1="8" x2="16" y2="8"></line>
            <line x1="8" y1="12" x2="10" y2="12"></line>
            <line x1="14" y1="12" x2="16" y2="12"></line>
            <line x1="8" y1="16" x2="10" y2="16"></line>
            <line x1="14" y1="15" x2="16" y2="17"></line>
            <line x1="16" y1="15" x2="14" y2="17"></line>
        </svg>
    `;
}


function componentIconSvg() {

    return `
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <rect
                x="6"
                y="6"
                width="12"
                height="12"
                rx="2"
            ></rect>

            <line
                x1="9"
                y1="3"
                x2="9"
                y2="6"
            ></line>

            <line
                x1="15"
                y1="3"
                x2="15"
                y2="6"
            ></line>

            <line
                x1="9"
                y1="18"
                x2="9"
                y2="21"
            ></line>

            <line
                x1="15"
                y1="18"
                x2="15"
                y2="21"
            ></line>

            <line
                x1="3"
                y1="9"
                x2="6"
                y2="9"
            ></line>

            <line
                x1="3"
                y1="15"
                x2="6"
                y2="15"
            ></line>

            <line
                x1="18"
                y1="9"
                x2="21"
                y2="9"
            ></line>

            <line
                x1="18"
                y1="15"
                x2="21"
                y2="15"
            ></line>
        </svg>
    `;
}


/*
 * =========================================================
 * TOOL BAR
 * =========================================================
 */

function buildToolBar() {

    return `
        <div class="tool-selector">

            <div class="tool-selector-title">
                Tools
            </div>


            <div class="tool-selector-buttons">

                <button
                    class="
                        tool-icon-button
                        ${
                            activeTool ===
                            "measurements"
                                ? "active"
                                : ""
                        }
                    "
                    type="button"
                    data-tool="measurements"
                    aria-label="Measurements"
                    title="Measurements"
                >

                    <span class="tool-icon">
                        ${measurementsIconSvg()}
                    </span>

                    <span class="tool-icon-label">
                        Measurements
                    </span>

                </button>


                <button
                    class="
                        tool-icon-button
                        ${
                            activeTool ===
                            "component"
                                ? "active"
                                : ""
                        }
                    "
                    type="button"
                    data-tool="component"
                    aria-label="Component"
                    title="Component"
                >

                    <span class="tool-icon">
                        ${componentIconSvg()}
                    </span>

                    <span class="tool-icon-label">
                        Component
                    </span>

                </button>


                <button
                    class="
                        tool-icon-button
                        ${
                            activeTool ===
                            "calculations"
                                ? "active"
                                : ""
                        }
                    "
                    type="button"
                    data-tool="calculations"
                    aria-label="Calculations"
                    title="Calculations"
                >

                    <span class="tool-icon">
                        ${calculationsIconSvg()}
                    </span>

                    <span class="tool-icon-label">
                        Calculations
                    </span>

                </button>

            </div>

        </div>
    `;
}


/*
 * =========================================================
 * COMPONENT CONFIGURATION
 * =========================================================
 */

function buildComponentConfiguration(
    component
) {

    const allowedSubtypes =
        component.allowedSubtypes ||
        [];


    let subtypeHtml =
        "";


    if (
        allowedSubtypes.length >
        1
    ) {

        const options =
            allowedSubtypes
                .map(
                    subtype => `
                        <option
                            value="${subtype}"
                            ${
                                subtype ===
                                component.subtype
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${
                                formatSubtypeLabel(
                                    subtype
                                )
                            }
                        </option>
                    `
                )
                .join("");


        subtypeHtml = `
            <div class="component-configuration">

                <label
                    class="component-config-label"
                    for="component-subtype-select"
                >
                    Type
                </label>

                <select
                    id="component-subtype-select"
                    class="component-config-select"
                >
                    ${options}
                </select>

            </div>
        `;
    }


    const installationHtml =
        component.removable
            ? `
                <div
                    class="component-config-note"
                    style="margin-top: 12px;"
                >
                    Optional system component
                </div>
            `
            : `
                <div
                    class="component-config-note"
                    style="margin-top: 12px;"
                >
                    Required system component
                </div>
            `;


    return `
        ${subtypeHtml}
        ${installationHtml}
    `;
}


function bindComponentConfiguration(
    component
) {

    const select =
        document.getElementById(
            "component-subtype-select"
        );


    if (!select) {
        return;
    }


    select.addEventListener(
        "change",
        event => {

            const selectedSubtype =
                event.target.value;


            if (
                !(
                    component.allowedSubtypes ||
                    []
                ).includes(
                    selectedSubtype
                )
            ) {

                return;
            }


            component.subtype =
                selectedSubtype;


            component.label =
                componentDisplayLabel(
                    component
                );


            renderCurrentSystem();

            renderSidePanel();
        }
    );
}


/*
 * =========================================================
 * SYSTEM COMPONENT LIST
 * =========================================================
 */

function buildRequiredComponentRow(
    component
) {

    return `
        <div
            style="
                display: flex;
                align-items: center;
                gap: 9px;
                min-height: 30px;
            "
        >

            <span
                aria-hidden="true"
                style="
                    width: 18px;
                    text-align: center;
                    font-weight: 600;
                "
            >
                ✓
            </span>

            <span>
                ${
                    componentRoleLabel(
                        component
                    )
                }
            </span>

        </div>
    `;
}


function buildOptionalComponentRow(
    component
) {

    return `
        <label
            style="
                display: flex;
                align-items: center;
                gap: 9px;
                min-height: 30px;
                cursor: pointer;
            "
        >

            <input
                type="checkbox"

                data-component-installed="${component.id}"

                ${
                    isComponentInstalled(
                        component
                    )
                        ? "checked"
                        : ""
                }
            >

            <span>
                ${
                    componentRoleLabel(
                        component
                    )
                }
            </span>

        </label>
    `;
}


function buildSystemComponentConfiguration() {

    if (!currentSystem) {
        return "";
    }


    const requiredComponents =
        currentSystem.components.filter(
            component =>
                !component.removable
        );


    const optionalComponents =
        currentSystem.components.filter(
            component =>
                component.removable
        );


    const installedCount =
        currentSystem.components.filter(
            component =>
                isComponentInstalled(
                    component
                )
        ).length;


    const expandedContent =
        systemComponentsExpanded
            ? `
                <div
                    style="
                        padding:
                            2px 0 6px 22px;
                    "
                >

                    <div
                        class="component-config-note"
                        style="
                            margin-top: 10px;
                            margin-bottom: 5px;
                            font-weight: 600;
                        "
                    >
                        Required
                    </div>


                    <div>
                        ${
                            requiredComponents
                                .map(
                                    component =>
                                        buildRequiredComponentRow(
                                            component
                                        )
                                )
                                .join("")
                        }
                    </div>


                    ${
                        optionalComponents.length
                            ? `
                                <div
                                    class="component-config-note"
                                    style="
                                        margin-top: 14px;
                                        margin-bottom: 5px;
                                        font-weight: 600;
                                    "
                                >
                                    Optional
                                </div>

                                <div>
                                    ${
                                        optionalComponents
                                            .map(
                                                component =>
                                                    buildOptionalComponentRow(
                                                        component
                                                    )
                                            )
                                            .join("")
                                    }
                                </div>
                            `
                            : ""
                    }

                </div>
            `
            : "";


    return `
        <div class="selected-tool-item">

            <button
                type="button"
                data-toggle-system-components
                aria-expanded="${systemComponentsExpanded}"
                style="
                    width: 100%;
                    border: 0;
                    background: transparent;
                    padding: 2px 0 4px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    color: inherit;
                    text-align: left;
                    font: inherit;
                "
            >

                <span
                    aria-hidden="true"
                    style="
                        width: 14px;
                        font-size: 13px;
                        line-height: 1;
                        color: #277fb5;
                    "
                >
                    ${
                        systemComponentsExpanded
                            ? "▾"
                            : "▸"
                    }
                </span>


                <span
                    style="
                        font-weight: 600;
                    "
                >
                    System Components
                </span>


                <span
                    class="component-config-note"
                    style="
                        margin-left: auto;
                        white-space: nowrap;
                    "
                >
                    ${installedCount} installed
                </span>

            </button>


            ${expandedContent}

        </div>
    `;
}


/*
 * =========================================================
 * COMPONENT INSTALL / REMOVE
 * =========================================================
 */

function setComponentInstalled(
    componentId,
    installed
) {

    if (!currentSystem) {
        return;
    }


    const component =
        currentSystem.components.find(
            item =>
                item.id ===
                componentId
        );


    if (!component) {
        return;
    }


    if (
        !component.removable
    ) {

        component.installed =
            true;

        return;
    }


    component.installed =
        installed;


    if (
        selectedComponent &&
        selectedComponent.id ===
            component.id &&
        !installed
    ) {

        selectedComponent =
            null;

        activeComponentTab =
            "overview";
    }


    rebuildSystemConnections();

    renderCurrentSystem();

    renderSidePanel();
}


/*
 * =========================================================
 * MEASUREMENT FIELD
 * =========================================================
 */

function buildMeasurementField(
    item,
    measurement
) {

    const key =
        measurementKey(
            item.id,
            measurement.id
        );


    const savedValue =
        measurementValues.get(
            key
        ) ?? "";


    return `
        <div class="measurement-field">

            <label
                for="measurement-${item.id}-${measurement.id}"
            >
                ${measurement.label}
            </label>


            <div class="measurement-input-row">

                <input
                    id="measurement-${item.id}-${measurement.id}"

                    data-point-id="${item.id}"

                    data-measurement-id="${measurement.id}"

                    type="${
                        measurement.inputType ||
                        measurement.type ||
                        "number"
                    }"

                    inputmode="decimal"

                    step="any"

                    value="${savedValue}"
                >


                <span class="measurement-unit">
                    ${measurement.unit || ""}
                </span>

            </div>

        </div>
    `;
}


/*
 * =========================================================
 * MEASUREMENT CAPABILITIES
 * =========================================================
 */

function buildMeasurementFields(
    item
) {

    const measurements =
        item.measurements ||
        [];

    const capabilities =
        item.capabilities ||
        null;


    if (
        measurements.length ===
        0
    ) {

        return "";
    }


    if (!capabilities) {

        return measurements
            .map(
                measurement =>
                    buildMeasurementField(
                        item,
                        measurement
                    )
            )
            .join("");
    }


    const fields =
        [];


    measurements.forEach(
        measurement => {

            if (
                measurement.id ===
                "pressure"
            ) {

                const pressureCapability =
                    capabilities.pressure ||
                    "none";


                if (
                    pressureCapability ===
                    "available"
                ) {

                    fields.push(
                        buildMeasurementField(
                            item,
                            measurement
                        )
                    );

                    return;
                }


                if (
                    pressureCapability ===
                    "optional"
                ) {

                    const hasPressureAccess =
                        optionalPressureAccess.has(
                            item.id
                        );


                    if (
                        hasPressureAccess
                    ) {

                        fields.push(
                            buildMeasurementField(
                                item,
                                measurement
                            )
                        );


                        fields.push(`
                            <button
                                class="pressure-access-remove"
                                type="button"
                                data-remove-pressure-access="${item.id}"
                            >
                                Remove Pressure Access
                            </button>
                        `);

                    } else {

                        fields.push(`
                            <div class="pressure-access-option">

                                <div class="pressure-access-text">
                                    Pressure access at this location?
                                </div>

                                <button
                                    class="pressure-access-add"
                                    type="button"
                                    data-add-pressure-access="${item.id}"
                                >
                                    + Add Pressure
                                </button>

                            </div>
                        `);
                    }


                    return;
                }


                return;
            }


            if (
                measurement.id ===
                "temperature"
            ) {

                if (
                    capabilities.temperature ===
                    "available"
                ) {

                    fields.push(
                        buildMeasurementField(
                            item,
                            measurement
                        )
                    );
                }


                return;
            }


            fields.push(
                buildMeasurementField(
                    item,
                    measurement
                )
            );
        }
    );


    return fields.join("");
}


/*
 * =========================================================
 * AIR / SPACE MEASUREMENTS
 * =========================================================
 *
 * Air and space measurements are intentionally separate from
 * refrigerant-line measurement points. They are always
 * available from the Measurements tool and do not need to be
 * added to the refrigerant diagram.
 */

function getAirMeasurementLocations() {

    if (!currentSystem) {
        return [];
    }


    return (
        currentSystem
            .fieldData
            ?.airLocations ||
        []
    );
}


function isAirMeasurementLocation(
    point
) {

    if (!point) {
        return false;
    }


    return getAirMeasurementLocations()
        .some(
            location =>
                location.id === point.id
        );
}


function buildAirMeasurementList() {

    const locations =
        getAirMeasurementLocations();


    if (locations.length === 0) {
        return "";
    }


    const rows =
        locations.map(
            location => {

                const enteredCount =
                    (
                        location.measurements ||
                        []
                    ).filter(
                        measurement => {

                            const value =
                                measurementValues.get(
                                    measurementKey(
                                        location.id,
                                        measurement.id
                                    )
                                );


                            return (
                                value !== undefined &&
                                value !== null &&
                                String(value).trim() !== ""
                            );
                        }
                    ).length;


                const selected =
                    selectedMeasurementPoint?.id ===
                    location.id;


                return `
                    <button
                        type="button"
                        data-air-measurement-location="${location.id}"
                        style="
                            width: 100%;
                            border: 0;
                            border-bottom: 1px solid rgba(100, 120, 140, 0.12);
                            background: ${selected ? "rgba(22, 135, 201, 0.08)" : "transparent"};
                            padding: 9px 2px;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            text-align: left;
                            cursor: pointer;
                            color: inherit;
                            font: inherit;
                        "
                    >
                        <span
                            aria-hidden="true"
                            style="
                                width: 18px;
                                height: 18px;
                                border: 1.5px solid #4b93bd;
                                border-radius: 50%;
                                display: inline-flex;
                                align-items: center;
                                justify-content: center;
                                flex: 0 0 auto;
                                font-size: 11px;
                                color: #277fb5;
                            "
                        >
                            T
                        </span>

                        <span style="min-width: 0; flex: 1 1 auto;">
                            ${location.label}
                        </span>

                        ${
                            enteredCount > 0
                                ? `
                                    <span
                                        class="component-config-note"
                                        style="white-space: nowrap;"
                                    >
                                        entered
                                    </span>
                                `
                                : ""
                        }
                    </button>
                `;
            }
        ).join("");


    return `
        <div
            class="selected-tool-item"
            style="margin-top: 16px;"
        >
            <div class="selected-type">
                AIR / SPACE MEASUREMENTS
            </div>

            <div
                class="component-config-note"
                style="margin-top: 7px; margin-bottom: 5px;"
            >
                Temperature measurements used for air ΔT,
                evaporator TD, and condenser split calculations.
            </div>

            <div style="margin-top: 5px;">
                ${rows}
            </div>
        </div>
    `;
}


/*
 * =========================================================
 * MEASUREMENTS TOOL
 * =========================================================
 */

function buildMeasurementsTool() {

    if (
        addMeasurementMode
    ) {

        let pointContent = `
            <div class="tool-empty-state">

                <strong>
                    Adding measurement points
                </strong>

                <p>
                    Select a measurement location
                    on the system diagram.
                </p>

            </div>
        `;


        if (
            selectedMeasurementPoint
        ) {

            pointContent =
                buildMeasurementPointContent(
                    selectedMeasurementPoint
                );
        }


        return `
            <div class="active-tool-panel">

                <div class="active-tool-header">

                    <div>

                        <div class="active-tool-eyebrow">
                            MEASUREMENTS
                        </div>

                        <h2>
                            Measurements
                        </h2>

                    </div>


                    <button
                        id="add-point-button"
                        class="measurement-action-button"
                        type="button"
                    >
                        Done
                    </button>

                </div>


                ${pointContent}

            </div>
        `;
    }


    if (
        selectedMeasurementPoint
    ) {

        return `
            <div class="active-tool-panel">

                <div class="active-tool-header">

                    <div>

                        <div class="active-tool-eyebrow">
                            MEASUREMENTS
                        </div>

                        <h2>
                            Measurements
                        </h2>

                    </div>


                    <button
                        id="add-point-button"
                        class="measurement-action-button"
                        type="button"
                    >
                        Add Point
                    </button>

                </div>


                ${
                    buildMeasurementPointContent(
                        selectedMeasurementPoint
                    )
                }


                ${
                    isAirMeasurementLocation(
                        selectedMeasurementPoint
                    )
                        ? buildAirMeasurementList()
                        : ""
                }

            </div>
        `;
    }


    return `
        <div class="active-tool-panel">

            <div class="active-tool-header">

                <div>

                    <div class="active-tool-eyebrow">
                        MEASUREMENTS
                    </div>

                    <h2>
                        Measurements
                    </h2>

                </div>


                <button
                    id="add-point-button"
                    class="measurement-action-button"
                    type="button"
                >
                    Add Point
                </button>

            </div>


            <div class="tool-empty-state">

                <strong>
                    No refrigerant measurement point selected
                </strong>

                <p>
                    Click Add Point for a refrigerant-line
                    measurement, or choose an air / space
                    temperature below.
                </p>

            </div>


            ${buildAirMeasurementList()}

        </div>
    `;
}


function buildMeasurementPointContent(
    point
) {

    return `
        <div class="selected-tool-item">

            <div class="selected-type">
                MEASUREMENT POINT
            </div>


            <h3>
                ${point.label}
            </h3>


            <div class="component-measurements">

                ${
                    buildMeasurementFields(
                        point
                    )
                }

            </div>


            ${
                isAirMeasurementLocation(point)
                    ? ""
                    : `
                        <button
                            id="remove-measurement-point"
                            class="measurement-remove-button"
                            type="button"
                        >
                            Remove Measurement Point
                        </button>
                    `
            }

        </div>
    `;
}


/*
 * =========================================================
 * COMPONENT OBSERVATIONS
 * =========================================================
 */

function getComponentObservationDefinition(
    component
) {

    if (
        !currentSystem ||
        !component
    ) {

        return null;
    }


    return (
        currentSystem
            .fieldData
            ?.observations ||
        []
    ).find(
        definition =>
            definition.component ===
            component.id
    ) || null;
}


function observationFieldApplies(
    field,
    component
) {

    const allowedSubtypes =
        field.appliesToSubtypes;


    if (
        !allowedSubtypes ||
        allowedSubtypes.length === 0
    ) {

        return true;
    }


    return allowedSubtypes.includes(
        component.subtype
    );
}


function getApplicableObservationFields(
    component
) {

    const definition =
        getComponentObservationDefinition(
            component
        );


    if (!definition) {
        return [];
    }


    return (
        definition.fields ||
        []
    ).filter(
        field =>
            observationFieldApplies(
                field,
                component
            )
    );
}


function buildComponentObservations(
    component
) {

    const fields =
        getApplicableObservationFields(
            component
        );


    if (
        fields.length ===
        0
    ) {

        return "";
    }


    const fieldsHtml =
        fields.map(
            field => {

                const key =
                    observationKey(
                        component.id,
                        field.id
                    );


                const savedValue =
                    componentObservationValues.get(
                        key
                    ) || "";


                if (
                    field.type ===
                    "textarea"
                ) {

                    return `
                        <div
                            class="component-configuration"
                            style="margin-top: 12px;"
                        >

                            <label
                                class="component-config-label"
                                for="component-observation-${component.id}-${field.id}"
                            >
                                ${field.label}
                            </label>

                            <textarea
                                id="component-observation-${component.id}-${field.id}"
                                data-observation-component="${component.id}"
                                data-observation-field="${field.id}"
                                rows="3"
                                style="
                                    width: 100%;
                                    box-sizing: border-box;
                                    margin-top: 6px;
                                    resize: vertical;
                                "
                            >${savedValue}</textarea>

                        </div>
                    `;
                }


                if (
                    field.type ===
                    "select"
                ) {

                    const options =
                        (
                            field.options ||
                            []
                        ).map(
                            option => `
                                <option
                                    value="${option}"
                                    ${
                                        option ===
                                        savedValue
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    ${
                                        formatObservationOptionLabel(
                                            option
                                        )
                                    }
                                </option>
                            `
                        )
                        .join("");


                    return `
                        <div
                            class="component-configuration"
                            style="margin-top: 12px;"
                        >

                            <label
                                class="component-config-label"
                                for="component-observation-${component.id}-${field.id}"
                            >
                                ${field.label}
                            </label>

                            <select
                                id="component-observation-${component.id}-${field.id}"
                                class="component-config-select"
                                data-observation-component="${component.id}"
                                data-observation-field="${field.id}"
                            >

                                <option value="">
                                    Select...
                                </option>

                                ${options}

                            </select>

                        </div>
                    `;
                }


                return `
                    <div
                        class="component-configuration"
                        style="margin-top: 12px;"
                    >

                        <label
                            class="component-config-label"
                            for="component-observation-${component.id}-${field.id}"
                        >
                            ${field.label}
                        </label>

                        <input
                            id="component-observation-${component.id}-${field.id}"
                            class="component-config-select"
                            type="${field.type || "text"}"
                            data-observation-component="${component.id}"
                            data-observation-field="${field.id}"
                            value="${savedValue}"
                        >

                    </div>
                `;
            }
        ).join("");


    return `
        <div
            style="
                padding-top: 14px;
            "
        >

            <div class="selected-type">
                FIELD OBSERVATIONS
            </div>

            ${fieldsHtml}

        </div>
    `;
}


/*
 * =========================================================
 * OVERVIEW SUMMARY
 * =========================================================
 */

function getEnteredObservationValues(
    component
) {

    return getApplicableObservationFields(
        component
    )
        .map(
            field => {

                const value =
                    componentObservationValues.get(

                        observationKey(
                            component.id,
                            field.id
                        )
                    );


                if (
                    value === undefined ||
                    value === null ||
                    String(value).trim() === ""
                ) {

                    return null;
                }


                return {
                    field,
                    value
                };
            }
        )
        .filter(Boolean);
}


function buildObservationSummary(
    component
) {

    const enteredValues =
        getEnteredObservationValues(
            component
        );


    if (
        enteredValues.length ===
        0
    ) {

        return `
            <div
                style="
                    margin-top: 18px;
                "
            >

                <div class="selected-type">
                    FIELD SUMMARY
                </div>


                <div
                    class="component-config-note"
                    style="
                        margin-top: 9px;
                    "
                >
                    No field observations entered.
                </div>

            </div>
        `;
    }


    const rows =
        enteredValues
            .map(
                item => {

                    let displayValue =
                        item.value;


                    if (
                        item.field.type ===
                        "select"
                    ) {

                        displayValue =
                            formatObservationOptionLabel(
                                item.value
                            );
                    }


                    return `
                        <div
                            style="
                                display: grid;
                                grid-template-columns:
                                    minmax(0, 1fr)
                                    minmax(0, 1fr);
                                gap: 10px;
                                padding: 7px 0;
                                border-bottom:
                                    1px solid
                                    rgba(100, 120, 140, 0.12);
                            "
                        >

                            <div
                                style="
                                    color: #5f7180;
                                    min-width: 0;
                                "
                            >
                                ${item.field.label}
                            </div>


                            <div
                                style="
                                    text-align: right;
                                    font-weight: 500;
                                    min-width: 0;
                                    overflow-wrap: anywhere;
                                "
                            >
                                ${displayValue}
                            </div>

                        </div>
                    `;
                }
            )
            .join("");


    return `
        <div
            style="
                margin-top: 18px;
            "
        >

            <div class="selected-type">
                FIELD SUMMARY
            </div>


            <div
                style="
                    margin-top: 6px;
                "
            >
                ${rows}
            </div>

        </div>
    `;
}


function buildComponentOverview(
    component
) {

    return `
        <div
            style="
                padding-top: 14px;
            "
        >

            ${
                buildComponentConfiguration(
                    component
                )
            }


            ${
                buildObservationSummary(
                    component
                )
            }

            ${
                buildElectricalSummary(
                    component
                )
            }

        </div>
    `;
}


/*
 * =========================================================
 * COMPONENT TAB HELPERS
 * =========================================================
 */

function getComponentElectricalDefinition(
    component
) {

    if (
        !currentSystem ||
        !component
    ) {

        return null;
    }


    return (
        currentSystem
            .fieldData
            ?.electrical ||
        []
    ).find(
        definition =>
            definition.component ===
            component.id
    ) || null;
}


/*
 * Supports both electrical data formats:
 *
 * Legacy:
 *   definition.measurements = [ ... ]
 *
 * V2:
 *   definition.sections = [
 *       { id, label, fields: [ ... ] }
 *   ]
 */
function getComponentElectricalSections(
    component
) {

    const definition =
        getComponentElectricalDefinition(
            component
        );


    if (!definition) {
        return [];
    }


    if (
        Array.isArray(
            definition.sections
        ) &&
        definition.sections.length > 0
    ) {

        return definition.sections;
    }


    if (
        Array.isArray(
            definition.measurements
        ) &&
        definition.measurements.length > 0
    ) {

        return [
            {
                id:
                    "electrical_measurements",

                label:
                    "Electrical Measurements",

                fields:
                    definition.measurements
            }
        ];
    }


    return [];
}


function getElectricalFieldValue(
    component,
    fieldId
) {

    return componentElectricalValues.get(
        electricalKey(
            component.id,
            fieldId
        )
    ) ?? "";
}


function electricalFieldApplies(
    field,
    component
) {

    if (!field) {
        return false;
    }


    const allowedSubtypes =
        field.appliesToSubtypes;


    if (
        allowedSubtypes &&
        allowedSubtypes.length > 0 &&
        !allowedSubtypes.includes(
            component.subtype
        )
    ) {

        return false;
    }


    const conditions =
        field.appliesWhen;


    if (!conditions) {
        return true;
    }


    return Object.entries(
        conditions
    ).every(
        ([controllingFieldId, allowedValues]) => {

            const currentValue =
                getElectricalFieldValue(
                    component,
                    controllingFieldId
                );

            const acceptedValues =
                Array.isArray(
                    allowedValues
                )
                    ? allowedValues
                    : [allowedValues];


            return acceptedValues.includes(
                currentValue
            );
        }
    );
}


function getApplicableElectricalSections(
    component
) {

    return getComponentElectricalSections(
        component
    )
        .map(
            section => ({
                ...section,

                fields:
                    (
                        section.fields ||
                        section.measurements ||
                        []
                    ).filter(
                        field =>
                            electricalFieldApplies(
                                field,
                                component
                            )
                    )
            })
        )
        .filter(
            section =>
                section.fields.length > 0
        );
}


function electricalInputType(
    field
) {

    return (
        field.inputType ||
        field.type ||
        "number"
    );
}


function buildElectricalField(
    component,
    field
) {

    const savedValue =
        getElectricalFieldValue(
            component,
            field.id
        );

    const inputType =
        electricalInputType(
            field
        );

    const fieldId =
        `component-electrical-${component.id}-${field.id}`;


    let controlHtml = "";


    if (
        inputType ===
        "select"
    ) {

        const optionsHtml =
            (
                field.options ||
                []
            ).map(
                option => {

                    const optionValue =
                        typeof option === "object"
                            ? option.value
                            : option;

                    const optionLabel =
                        typeof option === "object"
                            ? (
                                option.label ||
                                formatObservationOptionLabel(
                                    optionValue
                                )
                            )
                            : formatObservationOptionLabel(
                                optionValue
                            );


                    return `
                        <option
                            value="${optionValue}"
                            ${
                                optionValue ===
                                savedValue
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${optionLabel}
                        </option>
                    `;
                }
            ).join("");


        controlHtml = `
            <select
                id="${fieldId}"
                class="component-config-select"
                data-electrical-component="${component.id}"
                data-electrical-field="${field.id}"
                data-electrical-select="true"
            >
                <option value="">
                    Select...
                </option>

                ${optionsHtml}
            </select>
        `;

    } else {

        controlHtml = `
            <div
                class="measurement-input-row"
                style="margin-top: 6px;"
            >
                <input
                    id="${fieldId}"
                    class="component-config-select"
                    data-electrical-component="${component.id}"
                    data-electrical-field="${field.id}"
                    type="${inputType}"
                    ${
                        inputType === "number"
                            ? 'inputmode="decimal" step="any"'
                            : ""
                    }
                    value="${savedValue}"
                >

                <span class="measurement-unit">
                    ${field.unit || ""}
                </span>
            </div>
        `;
    }


    let conditionNote = "";

    if (
        field.measurementCondition
    ) {

        conditionNote = `
            <div
                class="component-config-note"
                style="margin-top: 4px;"
            >
                ${
                    formatObservationOptionLabel(
                        field.measurementCondition
                    )
                }
            </div>
        `;
    }


    return `
        <div
            class="component-configuration"
            style="margin-top: 12px;"
        >
            <label
                class="component-config-label"
                for="${fieldId}"
            >
                ${field.label}
            </label>

            ${controlHtml}
            ${conditionNote}
        </div>
    `;
}


function buildComponentElectrical(
    component
) {

    const sections =
        getApplicableElectricalSections(
            component
        );


    if (
        sections.length === 0
    ) {

        return `
            <div
                class="component-config-note"
                style="padding-top: 14px;"
            >
                No electrical fields are defined for this component.
            </div>
        `;
    }


    const sectionsHtml =
        sections.map(
            section => `
                <div
                    style="
                        margin-top: 16px;
                        padding-top: 12px;
                        border-top:
                            1px solid
                            rgba(100, 120, 140, 0.16);
                    "
                >
                    <div class="selected-type">
                        ${
                            section.label ||
                            formatObservationOptionLabel(
                                section.id ||
                                "Electrical"
                            )
                        }
                    </div>

                    ${
                        section.fields
                            .map(
                                field =>
                                    buildElectricalField(
                                        component,
                                        field
                                    )
                            )
                            .join("")
                    }
                </div>
            `
        ).join("");


    return `
        <div style="padding-top: 2px;">
            ${sectionsHtml}
        </div>
    `;
}


function getEnteredElectricalValues(
    component
) {

    const enteredValues = [];


    getApplicableElectricalSections(
        component
    ).forEach(
        section => {

            section.fields.forEach(
                field => {

                    const value =
                        getElectricalFieldValue(
                            component,
                            field.id
                        );


                    if (
                        value === undefined ||
                        value === null ||
                        String(value).trim() === ""
                    ) {

                        return;
                    }


                    enteredValues.push({
                        section,
                        field,
                        value
                    });
                }
            );
        }
    );


    return enteredValues;
}


function buildElectricalSummary(
    component
) {

    const enteredValues =
        getEnteredElectricalValues(
            component
        );


    if (
        enteredValues.length === 0
    ) {

        return "";
    }


    const rows =
        enteredValues.map(
            item => {

                const inputType =
                    electricalInputType(
                        item.field
                    );

                const displayValue =
                    inputType === "select"
                        ? formatObservationOptionLabel(
                            item.value
                        )
                        : item.value;


                return `
                    <div
                        style="
                            display: grid;
                            grid-template-columns:
                                minmax(0, 1fr)
                                minmax(0, 1fr);
                            gap: 10px;
                            padding: 7px 0;
                            border-bottom:
                                1px solid
                                rgba(100, 120, 140, 0.12);
                        "
                    >
                        <div
                            style="
                                color: #5f7180;
                                min-width: 0;
                            "
                        >
                            ${item.field.label}
                        </div>

                        <div
                            style="
                                text-align: right;
                                font-weight: 500;
                                min-width: 0;
                                overflow-wrap: anywhere;
                            "
                        >
                            ${displayValue}${
                                item.field.unit
                                    ? ` ${item.field.unit}`
                                    : ""
                            }
                        </div>
                    </div>
                `;
            }
        ).join("");


    return `
        <div style="margin-top: 18px;">
            <div class="selected-type">
                ELECTRICAL SUMMARY
            </div>

            <div style="margin-top: 6px;">
                ${rows}
            </div>
        </div>
    `;
}


function componentHasObservations(
    component
) {

    return (
        getApplicableObservationFields(
            component
        ).length >
        0
    );
}


function componentHasElectrical(
    component
) {

    return Boolean(
        getComponentElectricalDefinition(
            component
        )
    );
}


function getAvailableComponentTabs(
    component
) {

    const tabs = [
        {
            id:
                "overview",

            label:
                "Overview"
        }
    ];


    if (
        componentHasObservations(
            component
        )
    ) {

        tabs.push({
            id:
                "observations",

            label:
                "Observations"
        });
    }


    if (
        componentHasElectrical(
            component
        )
    ) {

        tabs.push({
            id:
                "electrical",

            label:
                "Electrical"
        });
    }


    return tabs;
}


/*
 * =========================================================
 * COMPONENT TABS
 * =========================================================
 *
 * No overflow scrolling.
 *
 * Tabs divide the available width evenly. This prevents
 * browser horizontal scrollbars and the small vertical
 * scrollbar arrows that appeared in the previous version.
 */

function buildComponentTabs(
    component
) {

    const tabs =
        getAvailableComponentTabs(
            component
        );


    if (
        !tabs.some(
            tab =>
                tab.id ===
                activeComponentTab
        )
    ) {

        activeComponentTab =
            "overview";
    }


    return `
        <div
            role="tablist"
            aria-label="Component information"
            style="
                display: flex;
                width: 100%;
                margin-top: 14px;
                border-bottom:
                    1px solid
                    rgba(100, 120, 140, 0.22);
                overflow: hidden;
            "
        >

            ${
                tabs.map(
                    tab => `

                        <button
                            type="button"
                            role="tab"
                            data-component-tab="${tab.id}"
                            aria-selected="${
                                activeComponentTab ===
                                tab.id
                            }"
                            style="
                                flex:
                                    1 1 0;

                                min-width:
                                    0;

                                border:
                                    0;

                                border-bottom:
                                    2px solid ${
                                        activeComponentTab ===
                                        tab.id
                                            ? "#1687c9"
                                            : "transparent"
                                    };

                                background:
                                    transparent;

                                color: ${
                                    activeComponentTab ===
                                    tab.id
                                        ? "#096ca7"
                                        : "inherit"
                                };

                                padding:
                                    8px 4px 7px;

                                margin-bottom:
                                    -1px;

                                cursor:
                                    pointer;

                                font:
                                    inherit;

                                font-size:
                                    0.88em;

                                font-weight: ${
                                    activeComponentTab ===
                                    tab.id
                                        ? "600"
                                        : "400"
                                };

                                white-space:
                                    nowrap;

                                overflow:
                                    hidden;

                                text-overflow:
                                    clip;
                            "
                        >
                            ${tab.label}
                        </button>

                    `
                ).join("")
            }

        </div>
    `;
}


function buildComponentTabContent(
    component
) {

    if (
        activeComponentTab ===
        "observations"
    ) {

        return buildComponentObservations(
            component
        );
    }


    if (
        activeComponentTab ===
        "electrical"
    ) {

        return buildComponentElectrical(
            component
        );
    }


    return buildComponentOverview(
        component
    );
}


/*
 * =========================================================
 * COMPONENT TOOL
 * =========================================================
 */

function buildComponentTool() {

    let selectedComponentHtml =
        "";


    if (
        selectedComponent
    ) {

        selectedComponentHtml = `

            <div
                style="
                    margin: 16px 0;
                    border-top:
                        1px solid
                        rgba(100, 120, 140, 0.22);
                "
            ></div>


            <div class="selected-tool-item">

                <div class="selected-type">
                    SELECTED COMPONENT
                </div>


                <h3
                    style="
                        margin-bottom: 0;
                    "
                >
                    ${
                        componentRoleLabel(
                            selectedComponent
                        )
                    }
                </h3>


                ${
                    buildComponentTabs(
                        selectedComponent
                    )
                }


                ${
                    buildComponentTabContent(
                        selectedComponent
                    )
                }

            </div>
        `;

    } else {

        selectedComponentHtml = `

            <div
                class="tool-empty-state"
                style="
                    margin-top: 16px;
                "
            >

                <strong>
                    No component selected
                </strong>

                <p>
                    Select a component on the
                    system diagram to view its
                    information.
                </p>

            </div>
        `;
    }


    return `
        <div class="active-tool-panel">

            <div class="active-tool-header">

                <div>

                    <div class="active-tool-eyebrow">
                        COMPONENT
                    </div>

                    <h2>
                        Component
                    </h2>

                </div>

            </div>


            ${
                buildSystemComponentConfiguration()
            }


            ${selectedComponentHtml}

        </div>
    `;
}


/*
 * =========================================================
 * REFRIGERANT / P-T DATA
 * =========================================================
 *
 * Loads data/refrigerants/refrigerants.json and the selected
 * refrigerant CSV. Linear interpolation is used only inside
 * the available table range; no silent extrapolation.
 * Zeotropic callers explicitly choose dew or bubble.
 */

function parseRefrigerantCsv(text) {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(value => value.trim());

    return lines.slice(1).map(line => {
        const values = line.split(",").map(value => value.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = Number(values[index]);
        });
        return row;
    }).filter(row => Object.values(row).every(Number.isFinite));
}

async function loadRefrigerantJson(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return response.json();
}

async function loadRefrigerantCsv(path) {
    if (refrigerantDataCache.has(path)) {
        return refrigerantDataCache.get(path);
    }

    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${path}`);

    const rows = parseRefrigerantCsv(await response.text());
    refrigerantDataCache.set(path, rows);
    return rows;
}

function refrigerantCsvPath(refrigerant) {
    const file = String(refrigerant?.file || "").trim();
    if (!file) return null;
    if (file.startsWith("data/")) return file;
    if (file.startsWith("refrigerants/")) return `data/${file}`;
    return `data/refrigerants/${file}`;
}

function normalizeRefrigerantName(value) {
    return String(value || "")
        .toUpperCase()
        .replaceAll("-", "")
        .replaceAll(" ", "");
}

function populateRefrigerantSelect() {
    if (!refrigerantSelect) return;

    const previousValue = normalizeRefrigerantName(refrigerantSelect.value);
    refrigerantSelect.innerHTML = "";

    refrigerants.forEach(refrigerant => {
        const option = document.createElement("option");
        option.value = refrigerant.id;
        option.textContent = refrigerant.available
            ? refrigerant.label
            : `${refrigerant.label} (data pending)`;
        option.disabled = !refrigerant.available;
        refrigerantSelect.append(option);
    });

    const preferred = refrigerants.find(refrigerant =>
        refrigerant.available && (
            normalizeRefrigerantName(refrigerant.id) === previousValue ||
            normalizeRefrigerantName(refrigerant.label) === previousValue
        )
    ) || refrigerants.find(refrigerant => refrigerant.available);

    if (preferred) refrigerantSelect.value = preferred.id;
}

async function selectRefrigerantData() {
    if (!refrigerantSelect) return;

    selectedRefrigerant = refrigerants.find(
        refrigerant => refrigerant.id === refrigerantSelect.value
    ) || null;

    currentRefrigerantRows = [];

    if (!selectedRefrigerant || !selectedRefrigerant.available) return;

    const path = refrigerantCsvPath(selectedRefrigerant);
    if (!path) return;

    try {
        currentRefrigerantRows = await loadRefrigerantCsv(path);
        console.info(
            `[HVAC/R Field Tool] ${selectedRefrigerant.label}: ` +
            `${currentRefrigerantRows.length} P-T points loaded.`
        );
    } catch (error) {
        console.error("Unable to load refrigerant P-T data:", error);
        currentRefrigerantRows = [];
    }
}

function interpolateRefrigerantValue(x, rows, xKey, yKey) {
    const points = rows.map(row => ({
        x: Number(row[xKey]),
        y: Number(row[yKey])
    })).filter(point =>
        Number.isFinite(point.x) && Number.isFinite(point.y)
    ).sort((a, b) => a.x - b.x);

    if (points.length < 2) {
        throw new Error("Not enough P-T data points are available.");
    }

    if (x < points[0].x || x > points[points.length - 1].x) {
        throw new RangeError(
            `Value is outside the available P-T range ` +
            `(${points[0].x} to ${points[points.length - 1].x}).`
        );
    }

    const exact = points.find(point => point.x === x);
    if (exact) return exact.y;

    for (let index = 1; index < points.length; index += 1) {
        const a = points[index - 1];
        const b = points[index];
        if (x <= b.x) {
            const ratio = (x - a.x) / (b.x - a.x);
            return a.y + ratio * (b.y - a.y);
        }
    }

    throw new Error("Unable to interpolate this P-T value.");
}

function refrigerantPressureColumn(saturationReference = "dew") {
    if (!selectedRefrigerant) return null;
    if (selectedRefrigerant.glide) {
        return saturationReference === "bubble"
            ? "bubble_psig"
            : "dew_psig";
    }
    return "pressure_psig";
}

function saturationTemperatureFromPressure(
    pressurePsig,
    saturationReference = "dew"
) {
    if (!Number.isFinite(pressurePsig) || currentRefrigerantRows.length < 2) {
        return null;
    }

    const pressureColumn = refrigerantPressureColumn(saturationReference);
    if (!pressureColumn) return null;

    try {
        return interpolateRefrigerantValue(
            pressurePsig,
            currentRefrigerantRows,
            pressureColumn,
            "temperature_f"
        );
    } catch (error) {
        if (error instanceof RangeError) return null;
        throw error;
    }
}

async function initializeRefrigerantData() {
    if (!refrigerantSelect) return;

    try {
        refrigerants = await loadRefrigerantJson(
            "data/refrigerants/refrigerants.json"
        );
        populateRefrigerantSelect();
        await selectRefrigerantData();
    } catch (error) {
        console.error("Unable to initialize refrigerant data:", error);
    }
}




/*
 * =========================================================
 * REFERENCE / DESIGN DATA
 * =========================================================
 *
 * reference_values.csv contains sourced rating/design values.
 * These are references, not universal normal values.
 */
function parseReferenceCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];

        if (character === '"') {
            if (quoted && text[index + 1] === '"') {
                field += '"';
                index += 1;
            } else {
                quoted = !quoted;
            }
        } else if (character === "," && !quoted) {
            row.push(field);
            field = "";
        } else if ((character === "\n" || character === "\r") && !quoted) {
            if (character === "\r" && text[index + 1] === "\n") index += 1;
            row.push(field);
            field = "";
            if (row.some(value => String(value).trim() !== "")) rows.push(row);
            row = [];
        } else {
            field += character;
        }
    }

    if (field !== "" || row.length > 0) {
        row.push(field);
        if (row.some(value => String(value).trim() !== "")) rows.push(row);
    }

    if (rows.length < 2) return [];
    const headers = rows[0].map(value => String(value).trim());

    return rows.slice(1).map(values => {
        const result = {};
        headers.forEach((header, index) => {
            result[header] = String(values[index] ?? "").trim();
        });
        return result;
    });
}

async function initializeReferenceData() {
    try {
        const response = await fetch("data/reference_values.csv", { cache: "no-store" });
        if (!response.ok) throw new Error("Could not load data/reference_values.csv");
        referenceValues = parseReferenceCsv(await response.text());

        if (activeTool === "calculations") {
            renderSidePanel();
        }
    } catch (error) {
        console.error("Unable to initialize reference data:", error);
        referenceValues = [];
    }
}

function currentApplicationId() {
    const applicationBySystem = {
        walk_in_cooler: "APP_WIC",
        ac_split: "APP_AC_SPLIT"
    };
    return applicationBySystem[systemSelect?.value] || null;
}

function referenceRows(parameterId, includeGlobal = false) {
    const applicationId = currentApplicationId();
    return referenceValues.filter(row =>
        row.parameter_id === parameterId &&
        (
            row.application_id === applicationId ||
            (includeGlobal && !row.application_id)
        )
    );
}

function referenceMatchesSelectedRefrigerant(row) {
    const conditions = normalizeRefrigerantName(row?.conditions);
    const refrigerant = normalizeRefrigerantName(selectedRefrigerant?.label || selectedRefrigerant?.id);
    if (!conditions || !refrigerant) return true;

    /* If a reference explicitly names a refrigerant, require a match. */
    const namedRefrigerants = conditions.match(/R\d+[A-Z]?/g) || [];
    return namedRefrigerants.length === 0 || namedRefrigerants.includes(refrigerant);
}

function numericReferenceValue(row) {
    if (!row) return null;
    const value = Number(row.value);
    return Number.isFinite(value) ? value : null;
}

function evaporatorReferenceTd() {
    const row = referenceRows("PAR_EVAP_TD")
        .find(referenceMatchesSelectedRefrigerant);
    const value = numericReferenceValue(row);
    return value === null ? null : { value, row };
}

function condenserReferenceTdRange() {
    const rows = referenceRows("PAR_COND_TD", true);
    const lowRow = rows.find(row => row.value_role === "DESIGN_RANGE_MIN");
    const highRow = rows.find(row => row.value_role === "DESIGN_RANGE_MAX");
    const low = numericReferenceValue(lowRow);
    const high = numericReferenceValue(highRow);

    if (low === null || high === null) return null;
    return { low, high, lowRow, highRow };
}

function formatTemperatureRange(low, high) {
    if (!Number.isFinite(low) || !Number.isFinite(high)) return "—";
    const roundedLow = Math.round(low * 10) / 10;
    const roundedHigh = Math.round(high * 10) / 10;
    return `${roundedLow}–${roundedHigh}°F`;
}


/*
 * =========================================================
 * CALCULATIONS TOOL
 * =========================================================
 */

function getNumericMeasurementValue(
    pointId,
    measurementId
) {

    const value =
        measurementValues.get(
            measurementKey(
                pointId,
                measurementId
            )
        );


    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {

        return null;
    }


    const number =
        Number(value);


    return Number.isFinite(number)
        ? number
        : null;
}


function formatCalculatedTemperature(
    value
) {

    if (value === null) {
        return "—";
    }


    const rounded =
        Math.round(value * 10) / 10;


    return `${rounded}°F`;
}


function formatCalculatedRatio(
    value
) {

    if (value === null) {
        return "—";
    }

    return `${(Math.round(value * 100) / 100).toFixed(2)}:1`;
}


function buildCalculationsTool() {

    const enteringAir = getNumericMeasurementValue("evaporator_entering_air", "temperature");
    const leavingAir = getNumericMeasurementValue("evaporator_leaving_air", "temperature");
    const evaporatorAirDeltaT =
        enteringAir !== null && leavingAir !== null
            ? enteringAir - leavingAir
            : null;

    const condenserEnteringAir = getNumericMeasurementValue("condenser_entering_air", "temperature");
    const condenserLeavingAir = getNumericMeasurementValue("condenser_leaving_air", "temperature");
    const condenserAirDeltaT =
        condenserEnteringAir !== null && condenserLeavingAir !== null
            ? condenserLeavingAir - condenserEnteringAir
            : null;

    /* Reference/design saturation temperatures.
       Evaporator reference uses the application-specific TD when available.
       Box temperature is preferred; entering air is the fallback.
       Condenser reference uses the sourced design TD range. */
    const boxTemperature = getNumericMeasurementValue("box_temperature", "temperature");
    const evaporatorReferenceAir = boxTemperature !== null ? boxTemperature : enteringAir;
    const evaporatorTdReference = evaporatorReferenceTd();
    const expectedEvaporatorSaturationTemperature =
        evaporatorReferenceAir !== null && evaporatorTdReference !== null
            ? evaporatorReferenceAir - evaporatorTdReference.value
            : null;

    const condenserTdReference = condenserReferenceTdRange();
    const expectedCondenserSaturationLow =
        condenserEnteringAir !== null && condenserTdReference !== null
            ? condenserEnteringAir + condenserTdReference.low
            : null;
    const expectedCondenserSaturationHigh =
        condenserEnteringAir !== null && condenserTdReference !== null
            ? condenserEnteringAir + condenserTdReference.high
            : null;

    /* EVAPORATOR: keep pressure, saturation temperature, line temperature,
       and superheat together. For glide refrigerants, SH uses dew. */
    const evaporatorOutletPressure = getNumericMeasurementValue("evaporator_outlet", "pressure");
    const evaporatorOutletTemperature = getNumericMeasurementValue("evaporator_outlet", "temperature");
    const evaporatorSaturationTemperature =
        evaporatorOutletPressure !== null
            ? saturationTemperatureFromPressure(evaporatorOutletPressure, "dew")
            : null;
    const evaporatorSuperheat =
        evaporatorOutletTemperature !== null && evaporatorSaturationTemperature !== null
            ? evaporatorOutletTemperature - evaporatorSaturationTemperature
            : null;
    const evaporatorReferenceLabel = selectedRefrigerant?.glide ? "Dew" : "Saturation";

    /* COMPRESSOR:
       Total/compressor superheat uses compressor suction pressure and
       compressor suction-line temperature at the same service location.
       For glide refrigerants, superheat uses dew temperature.

       Compression ratio must use absolute pressure, not gauge pressure:
       discharge psia / suction psia. */
    const compressorSuctionPressure = getNumericMeasurementValue("compressor_suction", "pressure");
    const compressorSuctionTemperature = getNumericMeasurementValue("compressor_suction", "temperature");
    const compressorDischargePressure = getNumericMeasurementValue("compressor_discharge", "pressure");
    const compressorDischargeTemperature = getNumericMeasurementValue("compressor_discharge", "temperature");

    const compressorSuctionSaturationTemperature =
        compressorSuctionPressure !== null
            ? saturationTemperatureFromPressure(compressorSuctionPressure, "dew")
            : null;

    const compressorTotalSuperheat =
        compressorSuctionTemperature !== null && compressorSuctionSaturationTemperature !== null
            ? compressorSuctionTemperature - compressorSuctionSaturationTemperature
            : null;

    /* Temperature rise from the evaporator outlet to the compressor suction.
       When pressure drop is negligible this is also equal to Total SH - Evaporator SH,
       but calculate it directly from the two measured temperatures so the meaning stays
       tied to the physical locations. */
    const suctionLineTemperatureRise =
        compressorSuctionTemperature !== null && evaporatorOutletTemperature !== null
            ? compressorSuctionTemperature - evaporatorOutletTemperature
            : null;

    const atmosphericPressurePsia = 14.7;
    const compressionRatio =
        compressorSuctionPressure !== null &&
        compressorDischargePressure !== null &&
        compressorSuctionPressure + atmosphericPressurePsia > 0
            ? (compressorDischargePressure + atmosphericPressurePsia) /
              (compressorSuctionPressure + atmosphericPressurePsia)
            : null;

    const compressorReferenceLabel = selectedRefrigerant?.glide ? "Dew" : "Saturation";

    /* CONDENSER: prefer a pressure measured at the condenser outlet.
       If it is not available, still show the useful high-side saturation
       temperature from the receiver outlet / king valve. Subcooling itself
       remains location-matched and therefore requires condenser-outlet pressure. */
    const condenserOutletPressure = getNumericMeasurementValue("condenser_outlet", "pressure");
    const condenserOutletTemperature = getNumericMeasurementValue("condenser_outlet", "temperature");
    const kingValvePressure = getNumericMeasurementValue("receiver_outlet", "pressure");

    const condenserOutletSaturationTemperature =
        condenserOutletPressure !== null
            ? saturationTemperatureFromPressure(condenserOutletPressure, "bubble")
            : null;
    const kingValveSaturationTemperature =
        kingValvePressure !== null
            ? saturationTemperatureFromPressure(kingValvePressure, "bubble")
            : null;

    const condenserDisplayPressure =
        condenserOutletPressure !== null ? condenserOutletPressure : kingValvePressure;
    const condenserDisplayPressureLocation =
        condenserOutletPressure !== null
            ? "Condenser Outlet"
            : kingValvePressure !== null
                ? "Receiver Outlet / King Valve"
                : "Condenser Outlet";
    const condenserSaturationTemperature =
        condenserOutletSaturationTemperature !== null
            ? condenserOutletSaturationTemperature
            : kingValveSaturationTemperature;

    const condenserOutletSubcooling =
        condenserOutletTemperature !== null && condenserOutletSaturationTemperature !== null
            ? condenserOutletSaturationTemperature - condenserOutletTemperature
            : null;
    const condenserReferenceLabel = selectedRefrigerant?.glide ? "Bubble" : "Saturation";

    const valueRow = (label, value, emphasize = false) => `
        <div style="color: #5f7180;">${label}</div>
        <div style="white-space: nowrap; ${emphasize ? "font-weight: 600; color: #277fb5;" : ""}">${value}</div>
    `;

    const groupHeader = label => `
        <div style="font-weight: 700; margin-top: 12px; padding: 10px 0 8px; border-bottom: 1px solid rgba(100, 120, 140, 0.16);">
            ${label}
        </div>
    `;

    return `
        <div class="active-tool-panel">
            <div class="active-tool-header">
                <div>
                    <div class="active-tool-eyebrow">CALCULATIONS</div>
                    <h2>Calculations</h2>
                </div>
            </div>

            <div class="selected-tool-item" style="margin-top: 14px;">
                <div class="selected-type">REFRIGERANT</div>

                <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; padding:8px 0 2px;">
                    ${valueRow("Refrigerant", selectedRefrigerant?.label || "—")}
                </div>

                ${groupHeader("EVAPORATOR")}
                <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; padding:9px 0 4px;">
                    ${valueRow("Outlet Pressure", evaporatorOutletPressure !== null ? `${evaporatorOutletPressure} psig` : "—")}
                    ${valueRow("Saturation Temperature", formatCalculatedTemperature(evaporatorSaturationTemperature))}
                    ${valueRow("Reference SAT", formatCalculatedTemperature(expectedEvaporatorSaturationTemperature))}
                    ${valueRow("Outlet Temperature", formatCalculatedTemperature(evaporatorOutletTemperature))}
                    ${valueRow("Superheat", formatCalculatedTemperature(evaporatorSuperheat), true)}
                </div>
                <details style="margin-top:6px; font-size:0.92em; color:#5f7180;">
                    <summary style="cursor:pointer; color:#277fb5;">Details</summary>
                    <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:8px 10px; padding:8px 0 3px;">
                        ${valueRow("Pressure Location", "Evaporator Outlet")}
                        ${valueRow("P-T Reference", evaporatorReferenceLabel)}
                        ${valueRow("Refrigerant", selectedRefrigerant?.label || "—")}
                        ${evaporatorTdReference !== null ? valueRow("Reference TD", `${evaporatorTdReference.value}°F`) : ""}
                        ${evaporatorTdReference !== null ? valueRow("Reference Basis", evaporatorTdReference.row.value_role === "RATING_POINT" ? "Manufacturer rating" : evaporatorTdReference.row.value_role || "Reference") : ""}
                    </div>
                    ${expectedEvaporatorSaturationTemperature === null
                        ? `<div style="margin-top:6px; line-height:1.35; color:#7b8b97;">Reference SAT needs Box Temperature or Evaporator Entering Air.</div>`
                        : ""}
                </details>

                ${groupHeader("COMPRESSOR")}
                <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; padding:9px 0 4px;">
                    ${valueRow("Suction Pressure", compressorSuctionPressure !== null ? `${compressorSuctionPressure} psig` : "—")}
                    ${valueRow("Suction Saturation Temperature", formatCalculatedTemperature(compressorSuctionSaturationTemperature))}
                    ${valueRow("Suction Temperature", formatCalculatedTemperature(compressorSuctionTemperature))}
                    ${valueRow("Total Superheat", formatCalculatedTemperature(compressorTotalSuperheat), true)}
                    ${valueRow("Suction-Line Temp Rise", formatCalculatedTemperature(suctionLineTemperatureRise))}
                    ${valueRow("Discharge Pressure", compressorDischargePressure !== null ? `${compressorDischargePressure} psig` : "—")}
                    ${valueRow("Discharge Temperature", formatCalculatedTemperature(compressorDischargeTemperature))}
                    ${valueRow("Compression Ratio", formatCalculatedRatio(compressionRatio), true)}
                </div>
                <details style="margin-top:6px; font-size:0.92em; color:#5f7180;">
                    <summary style="cursor:pointer; color:#277fb5;">Details</summary>
                    <div style="padding:8px 0 3px;">
                        <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:8px 10px;">
                            ${valueRow("Pressure Location", "Compressor Suction")}
                            ${valueRow("P-T Reference", compressorReferenceLabel)}
                        </div>
                        <div style="margin-top:8px; line-height:1.35;">
                            <div><strong>Compression Ratio</strong></div>
                            <div>Discharge psia ÷ Suction psia</div>
                        </div>
                        <div style="margin-top:8px; line-height:1.35;">
                            <div><strong>Suction-Line Temp Rise</strong></div>
                            <div>Compressor suction temp − Evaporator outlet temp</div>
                        </div>
                    </div>
                </details>

                ${groupHeader("CONDENSER")}
                <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; padding:9px 0 4px;">
                    ${valueRow("Outlet / High-Side Pressure", condenserDisplayPressure !== null ? `${condenserDisplayPressure} psig` : "—")}
                    ${valueRow("Saturation Temperature", formatCalculatedTemperature(condenserSaturationTemperature))}
                    ${valueRow("Reference SAT Range", formatTemperatureRange(expectedCondenserSaturationLow, expectedCondenserSaturationHigh))}
                    ${valueRow("Outlet Temperature", formatCalculatedTemperature(condenserOutletTemperature))}
                    ${valueRow("Subcooling", formatCalculatedTemperature(condenserOutletSubcooling), true)}
                </div>
                <details style="margin-top:6px; font-size:0.92em; color:#5f7180;">
                    <summary style="cursor:pointer; color:#277fb5;">Details</summary>
                    <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:8px 10px; padding:8px 0 3px;">
                        ${valueRow("Pressure Location", condenserDisplayPressureLocation)}
                        ${valueRow("P-T Reference", condenserReferenceLabel)}
                        ${valueRow("Refrigerant", selectedRefrigerant?.label || "—")}
                        ${condenserTdReference !== null ? valueRow("Reference CTOA", `${condenserTdReference.low}–${condenserTdReference.high}°F`) : ""}
                        ${condenserOutletPressure === null && kingValvePressure !== null
                            ? valueRow("Subcooling Pressure", "Condenser outlet pressure required")
                            : ""}
                    </div>
                    ${expectedCondenserSaturationLow === null || expectedCondenserSaturationHigh === null
                        ? `<div style="margin-top:6px; line-height:1.35; color:#7b8b97;">Reference SAT Range needs Condenser Entering Air / Ambient.</div>`
                        : ""}
                </details>
            </div>

            <div class="selected-tool-item" style="margin-top: 14px;">
                <div class="selected-type">AIR SIDE</div>

                <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; align-items:center; margin-top:12px; padding-bottom:9px; border-bottom:1px solid rgba(100,120,140,0.16);">
                    <div style="font-weight:600;">Evaporator Air ΔT</div>
                    <div style="font-weight:600; color:#277fb5; white-space:nowrap;">${formatCalculatedTemperature(evaporatorAirDeltaT)}</div>
                </div>
                <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; padding:8px 0 4px;">
                    ${valueRow("Entering Air", formatCalculatedTemperature(enteringAir))}
                    ${valueRow("Leaving Air", formatCalculatedTemperature(leavingAir))}
                </div>

                <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; align-items:center; margin-top:14px; padding-top:12px; padding-bottom:9px; border-top:1px solid rgba(100,120,140,0.16); border-bottom:1px solid rgba(100,120,140,0.16);">
                    <div style="font-weight:600;">Condenser Air ΔT</div>
                    <div style="font-weight:600; color:#277fb5; white-space:nowrap;">${formatCalculatedTemperature(condenserAirDeltaT)}</div>
                </div>
                <div style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:10px; padding:8px 0 4px;">
                    ${valueRow("Entering Air", formatCalculatedTemperature(condenserEnteringAir))}
                    ${valueRow("Leaving Air", formatCalculatedTemperature(condenserLeavingAir))}
                </div>
            </div>
        </div>
    `;
}


function buildActiveToolContent() {

    if (
        activeTool ===
        "component"
    ) {

        return buildComponentTool();
    }


    if (
        activeTool ===
        "calculations"
    ) {

        return buildCalculationsTool();
    }


    return buildMeasurementsTool();
}


/*
 * =========================================================
 * SIDE PANEL
 * =========================================================
 */

function renderSidePanel() {

    if (
        originalPanelTitle
    ) {

        originalPanelTitle
            .style
            .display =
            "none";
    }


    if (
        originalPanelHelp
    ) {

        originalPanelHelp
            .style
            .display =
            "none";
    }


    measurementContent.innerHTML = `

        ${buildToolBar()}


        <div class="tool-workspace">

            ${buildActiveToolContent()}

        </div>
    `;


    bindSidePanelControls();
}


/*
 * =========================================================
 * TOOL SWITCHING
 * =========================================================
 */

function switchTool(
    toolName
) {

    if (
        toolName !==
            "measurements" &&
        toolName !==
            "component" &&
        toolName !==
            "calculations"
    ) {

        return;
    }


    addMeasurementMode =
        false;


    activeTool =
        toolName;


    selectedComponent =
        null;

    selectedMeasurementPoint =
        null;

    activeComponentTab =
        "overview";


    if (
        toolName ===
        "component"
    ) {

        systemComponentsExpanded =
            false;
    }


    renderCurrentSystem();

    renderSidePanel();
}


/*
 * =========================================================
 * SIDE PANEL EVENTS
 * =========================================================
 */

function bindSidePanelControls() {

    /*
     * Tool buttons
     */
    measurementContent
        .querySelectorAll(
            "[data-tool]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        switchTool(
                            button.dataset.tool
                        );
                    }
                );
            }
        );


    /*
     * Optional component checkboxes
     */
    measurementContent
        .querySelectorAll(
            "[data-component-installed]"
        )
        .forEach(
            input => {

                input.addEventListener(
                    "change",
                    event => {

                        setComponentInstalled(

                            event.target
                                .dataset
                                .componentInstalled,

                            event.target
                                .checked
                        );
                    }
                );
            }
        );


    /*
     * System Components expand/collapse
     */
    const systemComponentsToggle =
        measurementContent.querySelector(
            "[data-toggle-system-components]"
        );


    if (
        systemComponentsToggle
    ) {

        systemComponentsToggle.addEventListener(
            "click",
            () => {

                systemComponentsExpanded =
                    !systemComponentsExpanded;


                renderSidePanel();
            }
        );
    }


    /*
     * Component tabs
     */
    measurementContent
        .querySelectorAll(
            "[data-component-tab]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        activeComponentTab =
                            button.dataset
                                .componentTab;


                        renderSidePanel();
                    }
                );
            }
        );


    /*
     * Air / space measurement locations
     */
    measurementContent
        .querySelectorAll(
            "[data-air-measurement-location]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const locationId =
                            button.dataset
                                .airMeasurementLocation;


                        const location =
                            getAirMeasurementLocations()
                                .find(
                                    item =>
                                        item.id === locationId
                                );


                        if (!location) {
                            return;
                        }


                        addMeasurementMode =
                            false;

                        activeTool =
                            "measurements";

                        selectedComponent =
                            null;

                        selectedMeasurementPoint =
                            location;


                        renderCurrentSystem();

                        renderSidePanel();


                        /*
                         * renderSidePanel() creates a new input element.
                         * Focus the selected air/space temperature field
                         * immediately so the technician can type without
                         * clicking the text box a second time.
                         */
                        const input =
                            document.getElementById(
                                `measurement-${location.id}-temperature`
                            );


                        if (input) {

                            input.focus({
                                preventScroll: true
                            });

                            input.select();
                        }
                    }
                );
            }
        );


    /*
     * Add Point / Done
     */
    const addPointButton =
        document.getElementById(
            "add-point-button"
        );


    if (
        addPointButton
    ) {

        addPointButton.addEventListener(
            "click",
            () => {

                if (
                    !addMeasurementMode
                ) {

                    activeTool =
                        "measurements";

                    addMeasurementMode =
                        true;

                    selectedMeasurementPoint =
                        null;

                    selectedComponent =
                        null;

                } else {

                    addMeasurementMode =
                        false;

                    selectedMeasurementPoint =
                        null;
                }


                renderCurrentSystem();

                renderSidePanel();
            }
        );
    }


    /*
     * Measurement inputs
     */
    measurementContent
        .querySelectorAll(
            "[data-point-id][data-measurement-id]"
        )
        .forEach(
            input => {

                input.addEventListener(
                    "input",
                    event => {

                        const pointId =
                            event.target
                                .dataset
                                .pointId;

                        const measurementId =
                            event.target
                                .dataset
                                .measurementId;


                        measurementValues.set(

                            measurementKey(
                                pointId,
                                measurementId
                            ),

                            event.target.value
                        );
                    }
                );


                /*
                 * Air / space temperature fields:
                 * pressing Enter commits the current value and
                 * refreshes the list so the "entered" indicator
                 * appears immediately. Refrigerant fields keep
                 * their existing behavior.
                 */
                input.addEventListener(
                    "keydown",
                    event => {

                        if (event.key !== "Enter") {
                            return;
                        }


                        const pointId =
                            event.target
                                .dataset
                                .pointId;

                        const measurementId =
                            event.target
                                .dataset
                                .measurementId;


                        const isAirLocation =
                            getAirMeasurementLocations()
                                .some(
                                    location =>
                                        location.id === pointId
                                );


                        if (!isAirLocation) {
                            return;
                        }


                        event.preventDefault();


                        measurementValues.set(

                            measurementKey(
                                pointId,
                                measurementId
                            ),

                            event.target.value
                        );


                        renderCurrentSystem();
                        renderSidePanel();
                    }
                );
            }
        );


    /*
     * Add optional pressure access
     */
    measurementContent
        .querySelectorAll(
            "[data-add-pressure-access]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            !selectedMeasurementPoint
                        ) {

                            return;
                        }


                        optionalPressureAccess.add(
                            selectedMeasurementPoint.id
                        );


                        renderSidePanel();
                    }
                );
            }
        );


    /*
     * Remove optional pressure access
     */
    measurementContent
        .querySelectorAll(
            "[data-remove-pressure-access]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            !selectedMeasurementPoint
                        ) {

                            return;
                        }


                        optionalPressureAccess.delete(
                            selectedMeasurementPoint.id
                        );


                        measurementValues.delete(

                            measurementKey(
                                selectedMeasurementPoint.id,
                                "pressure"
                            )
                        );


                        renderSidePanel();
                    }
                );
            }
        );


    /*
     * Remove measurement point
     */
    const removeButton =
        document.getElementById(
            "remove-measurement-point"
        );


    if (
        removeButton &&
        selectedMeasurementPoint
    ) {

        removeButton.addEventListener(
            "click",
            () => {

                const point =
                    selectedMeasurementPoint;


                activeMeasurementPoints.delete(
                    point.id
                );


                optionalPressureAccess.delete(
                    point.id
                );


                (
                    point.measurements ||
                    []
                ).forEach(
                    measurement => {

                        measurementValues.delete(

                            measurementKey(
                                point.id,
                                measurement.id
                            )
                        );
                    }
                );


                selectedMeasurementPoint =
                    null;


                renderCurrentSystem();

                renderSidePanel();
            }
        );
    }


    /*
     * Observation fields
     *
     * Values are stored immediately.
     * The next time Overview is rendered,
     * FIELD SUMMARY reads from the same Map.
     */
    measurementContent
        .querySelectorAll(
            "[data-observation-component][data-observation-field]"
        )
        .forEach(
            input => {

                const saveObservation =
                    event => {

                        const componentId =
                            event.target
                                .dataset
                                .observationComponent;

                        const fieldId =
                            event.target
                                .dataset
                                .observationField;


                        componentObservationValues.set(

                            observationKey(
                                componentId,
                                fieldId
                            ),

                            event.target.value
                        );
                    };


                input.addEventListener(
                    "input",
                    saveObservation
                );

                input.addEventListener(
                    "change",
                    saveObservation
                );
            }
        );


    /*
     * Electrical fields
     */

    measurementContent
        .querySelectorAll(
            "[data-electrical-component][data-electrical-field]"
        )
        .forEach(
            input => {

                const saveElectrical =
                    event => {

                        const componentId =
                            event.target
                                .dataset
                                .electricalComponent;

                        const fieldId =
                            event.target
                                .dataset
                                .electricalField;

                        componentElectricalValues.set(
                            electricalKey(
                                componentId,
                                fieldId
                            ),
                            event.target.value
                        );
                    };

                input.addEventListener(
                    "input",
                    saveElectrical
                );

                input.addEventListener(
                    "change",
                    event => {

                        saveElectrical(
                            event
                        );


                        if (
                            event.target
                                .dataset
                                .electricalSelect ===
                            "true"
                        ) {

                            renderSidePanel();
                        }
                    }
                );
            }
        );


    /*
     * Component subtype
     */
    if (
        activeTool ===
            "component" &&
        selectedComponent
    ) {

        bindComponentConfiguration(
            selectedComponent
        );
    }
}


/*
 * =========================================================
 * SYSTEM LOADING
 * =========================================================
 */

function loadSystem(
    systemId
) {

    const systemDefinition =
        systems[systemId];


    if (
        !systemDefinition
    ) {

        return;
    }


    currentSystem =
        structuredClone(
            systemDefinition
        );


    initializeComponentInstallationState(
        currentSystem
    );


    rebuildSystemConnections();


    activeTool =
        "measurements";

    addMeasurementMode =
        false;

    selectedComponent =
        null;

    selectedMeasurementPoint =
        null;

    systemComponentsExpanded =
        false;

    activeComponentTab =
        "overview";


    activeMeasurementPoints.clear();

    measurementValues.clear();

    optionalPressureAccess.clear();

    componentObservationValues.clear();

    componentElectricalValues.clear();


    systemTitle.textContent =
        currentSystem.name;


    systemDescription.textContent =
        currentSystem.description;


    renderCurrentSystem();

    renderSidePanel();
}


/*
 * =========================================================
 * REFRIGERANT SELECTOR
 * =========================================================
 */

if (refrigerantSelect) {
    refrigerantSelect.addEventListener(
        "change",
        async () => {
            await selectRefrigerantData();
            if (activeTool === "calculations") {
                renderSidePanel();
            }
        }
    );
}


/*
 * =========================================================
 * SYSTEM SELECTOR
 * =========================================================
 */

systemSelect.addEventListener(
    "change",
    event => {

        loadSystem(
            event.target.value
        );
    }
);


/*
 * =========================================================
 * DIAGRAM EVENTS
 * =========================================================
 */

document.addEventListener(
    "system-component-selected",
    event => {

        addMeasurementMode =
            false;


        activeTool =
            "component";


        selectedMeasurementPoint =
            null;


        const nextComponent =
            event.detail;


        /*
         * A different component always starts
         * on Overview.
         */
        if (
            !selectedComponent ||
            selectedComponent.id !==
                nextComponent.id
        ) {

            activeComponentTab =
                "overview";
        }


        selectedComponent =
            nextComponent;


        renderCurrentSystem();

        renderSidePanel();
    }
);


document.addEventListener(
    "system-air-measurement-selected",
    event => {

        const location =
            event.detail;


        if (!location) {
            return;
        }


        addMeasurementMode =
            false;


        activeTool =
            "measurements";


        selectedComponent =
            null;


        selectedMeasurementPoint =
            location;


		renderCurrentSystem();

		renderSidePanel();

		const input =
			measurementContent.querySelector(
				`[data-point-id="${location.id}"][data-measurement-id]`
			);

		if (input) {
			input.focus();
			input.select();
		}
    }
);


document.addEventListener(
    "system-measurement-point-toggle",
    event => {

        if (
            !addMeasurementMode
        ) {

            return;
        }


        const point =
            event.detail;


        activeTool =
            "measurements";


        selectedComponent =
            null;


        activeMeasurementPoints.set(
            point.id,
            point
        );


        selectedMeasurementPoint =
            point;


        renderCurrentSystem();

        renderSidePanel();
    }
);


document.addEventListener(
    "system-measurement-point-selected",
    event => {

        const point =
            event.detail;


        if (
            !activeMeasurementPoints.has(
                point.id
            )
        ) {

            return;
        }


        activeTool =
            "measurements";


        selectedComponent =
            null;


        selectedMeasurementPoint =
            point;


        renderCurrentSystem();

        renderSidePanel();
    }
);


/*
 * =========================================================
 * START
 * =========================================================
 */

loadSystem(
    systemSelect.value
);

initializeRefrigerantData();
initializeReferenceData();
