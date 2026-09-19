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
    walk_in_cooler:
        walkInCooler,

    ac_split:
        acSplit
};


const systemSelect =
    document.getElementById(
        "system-select"
    );

const diagramContainer =
    document.getElementById(
        "system-diagram"
    );

const systemTitle =
    document.getElementById(
        "system-title"
    );

const systemDescription =
    document.getElementById(
        "system-description"
    );

const measurementContent =
    document.getElementById(
        "measurement-content"
    );

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

let currentSystem =
    null;

let activeTool =
    "measurements";

let addMeasurementMode =
    false;

let selectedComponent =
    null;

let selectedMeasurementPoint =
    null;


/*
 * =========================================================
 * MEASUREMENT STATE
 * =========================================================
 */

const activeMeasurementPoints =
    new Map();

const measurementValues =
    new Map();

const optionalPressureAccess =
    new Set();


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
        labels[
            component.role
        ] ||
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
 * COMPONENT INSTALLATION STATE
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
                component.removable ===
                    false
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
 * TOPOLOGY / CONNECTION BUILDER
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


            pathComponentIds
                .forEach(
                    componentId => {

                        if (
                            sectionStartMap
                                .has(
                                    componentId
                                )
                        ) {

                            activeSection =
                                sectionStartMap
                                    .get(
                                        componentId
                                    );
                        }


                        sectionByComponentId
                            .set(
                                componentId,
                                activeSection
                            );
                    }
                );


            const installedComponentIds =
                pathComponentIds
                    .filter(
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
                installedComponentIds
                    .length <
                2
            ) {

                return;
            }


            for (
                let index = 0;
                index <
                installedComponentIds.length -
                    1;
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
                        sectionByComponentId
                            .get(
                                from
                            ) ||
                        null
                });
            }


            if (
                path.closedLoop
            ) {

                const from =
                    installedComponentIds[
                        installedComponentIds
                            .length -
                        1
                    ];

                const to =
                    installedComponentIds[
                        0
                    ];


                generatedConnections.push({
                    from,
                    to,

                    section:
                        sectionByComponentId
                            .get(
                                from
                            ) ||
                        null
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

function renderCurrentSystem() {

    if (!currentSystem) {
        return;
    }


    renderSystemDiagram(
        diagramContainer,
        currentSystem,
        {

            activeMeasurementPointIds:
                new Set(
                    activeMeasurementPoints
                        .keys()
                ),

            addMeasurementMode
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
                <div class="component-config-note">
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
                    component
                        .allowedSubtypes ||
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
 * COMPONENT LIST
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
        currentSystem.components
            .filter(
                component =>
                    !component.removable
            );


    const optionalComponents =
        currentSystem.components
            .filter(
                component =>
                    component.removable
            );


    return `
        <div class="selected-tool-item">

            <div class="selected-type">
                SYSTEM COMPONENTS
            </div>

            <h3>
                Installed Components
            </h3>


            <div
                class="component-config-note"
                style="
                    margin-top: 14px;
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
                                margin-top: 16px;
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
    `;
}


/*
 * =========================================================
 * COMPONENT INSTALLATION
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
        currentSystem.components
            .find(
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


    /*
     * If we just removed the component currently
     * selected in the detail area, remove only its
     * detail panel.
     *
     * The system component checklist remains visible.
     */

    if (
        selectedComponent &&
        selectedComponent.id ===
            component.id &&
        !installed
    ) {

        selectedComponent =
            null;
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
 * SMART MEASUREMENT CAPABILITIES
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
                        optionalPressureAccess
                            .has(
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
                    No measurement point selected
                </strong>

                <p>
                    Click Add Point to create a new
                    measurement point, or select an
                    existing point on the diagram.
                </p>

            </div>

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


            <button
                id="remove-measurement-point"
                class="measurement-remove-button"
                type="button"
            >
                Remove Measurement Point
            </button>

        </div>
    `;
}


/*
 * =========================================================
 * COMPONENT TOOL
 * =========================================================
 */

function buildComponentTool() {

    /*
     * IMPORTANT:
     *
     * System component configuration is always present.
     *
     * Selecting a diagram component adds its detail
     * underneath rather than replacing the checklist.
     */

    let selectedComponentHtml =
        "";


    if (
        selectedComponent
    ) {

        selectedComponentHtml = `

            <div
                style="
                    margin: 18px 0;
                    border-top: 1px solid rgba(100, 120, 140, 0.22);
                "
            ></div>


            <div class="selected-tool-item">

                <div class="selected-type">
                    SELECTED COMPONENT
                </div>


                <h3>
                    ${
                        componentRoleLabel(
                            selectedComponent
                        )
                    }
                </h3>


                ${
                    buildComponentConfiguration(
                        selectedComponent
                    )
                }

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
 * ACTIVE TOOL CONTENT
 * =========================================================
 */

function buildActiveToolContent() {

    if (
        activeTool ===
        "component"
    ) {

        return buildComponentTool();
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
            "component"
    ) {

        return;
    }


    addMeasurementMode =
        false;


    activeTool =
        toolName;


    /*
     * Clicking a tool icon opens its default state.
     */

    selectedComponent =
        null;

    selectedMeasurementPoint =
        null;


    renderCurrentSystem();

    renderSidePanel();
}


/*
 * =========================================================
 * SIDE PANEL CONTROLS
 * =========================================================
 */

function bindSidePanelControls() {

    /*
     * Tool buttons.
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
     * Optional component checkboxes.
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
     * Add Point / Done.
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
     * Measurement inputs.
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
            }
        );


    /*
     * Add optional pressure access.
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


                        optionalPressureAccess
                            .add(
                                selectedMeasurementPoint
                                    .id
                            );


                        renderSidePanel();
                    }
                );
            }
        );


    /*
     * Remove optional pressure access.
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


                        optionalPressureAccess
                            .delete(
                                selectedMeasurementPoint
                                    .id
                            );


                        measurementValues
                            .delete(

                                measurementKey(
                                    selectedMeasurementPoint
                                        .id,

                                    "pressure"
                                )
                            );


                        renderSidePanel();
                    }
                );
            }
        );


    /*
     * Remove measurement point.
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


                activeMeasurementPoints
                    .delete(
                        point.id
                    );


                optionalPressureAccess
                    .delete(
                        point.id
                    );


                (
                    point.measurements ||
                    []
                ).forEach(
                    measurement => {

                        measurementValues
                            .delete(

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
     * Component subtype.
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
        systems[
            systemId
        ];


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


    activeMeasurementPoints
        .clear();

    measurementValues
        .clear();

    optionalPressureAccess
        .clear();


    systemTitle.textContent =
        currentSystem.name;


    systemDescription.textContent =
        currentSystem.description;


    renderCurrentSystem();

    renderSidePanel();
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


        selectedComponent =
            event.detail;


        renderCurrentSystem();

        renderSidePanel();
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


        activeMeasurementPoints
            .set(
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
            !activeMeasurementPoints
                .has(
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


        renderSidePanel();
    }
);


/*
 * =========================================================
 * START APPLICATION
 * =========================================================
 */

loadSystem(
    systemSelect.value
);