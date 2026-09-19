import { walkInCooler } from "./systems/walk_in_cooler.js";
import { acSplit } from "./systems/ac_split.js";
import { renderSystemDiagram } from "./components/system_diagram.js";


const systems = {
    walk_in_cooler: walkInCooler,
    ac_split: acSplit
};


const systemSelect =
    document.getElementById("system-select");

const diagramContainer =
    document.getElementById("system-diagram");

const systemTitle =
    document.getElementById("system-title");

const systemDescription =
    document.getElementById("system-description");

const measurementContent =
    document.getElementById("measurement-content");

const originalPanelTitle =
    document.querySelector(".measurement-panel h2");

const originalPanelHelp =
    document.querySelector(".measurement-help");


/*
 * =========================================================
 * APPLICATION STATE
 * =========================================================
 */

let currentSystem = null;


/*
 * Active tool:
 *
 * measurements
 * component
 */
let activeTool = "measurements";


/*
 * Measurement Add Point mode.
 */
let addMeasurementMode = false;


/*
 * Currently displayed objects.
 *
 * These are intentionally cleared when the user manually
 * switches tools so each tool opens at its default screen.
 */
let selectedComponent = null;
let selectedMeasurementPoint = null;


/*
 * =========================================================
 * MEASUREMENT STATE
 * =========================================================
 */

const activeMeasurementPoints =
    new Map();

const measurementValues =
    new Map();


/*
 * Tracks optional pressure access confirmed
 * by the technician.
 */
const optionalPressureAccess =
    new Set();


function measurementKey(
    pointId,
    measurementId
) {

    return `${pointId}:${measurementId}`;
}


/*
 * =========================================================
 * LABEL HELPERS
 * =========================================================
 */

function formatSubtypeLabel(subtype) {

    const labels = {

        reciprocating: "Reciprocating",
        scroll: "Scroll",
        rotary: "Rotary",
        screw: "Screw",

        air_cooled: "Air-Cooled",
        water_cooled: "Water-Cooled",
        evaporative: "Evaporative",

        txv: "TXV",
        eev: "EEV",
        fixed_orifice:
            "Fixed Orifice / Piston",
        capillary_tube:
            "Capillary Tube",

        forced_air: "Forced-Air",
        natural_convection:
            "Natural-Convection",
        plate: "Plate",

        standard: "Standard",
        liquid_line: "Liquid Line",
        sight_glass: "Sight Glass",
        moisture_indicator:
            "Moisture Indicator"
    };


    return (
        labels[subtype] ||
        subtype
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                character =>
                    character.toUpperCase()
            )
    );
}


function componentRoleLabel(component) {

    const labels = {

        compressor: "Compressor",
        condenser: "Condenser",

        metering_device:
            "Metering Device",

        evaporator: "Evaporator",

        receiver: "Receiver",

        filter_drier:
            "Filter Drier",

        sight_glass:
            "Sight Glass",

        solenoid_valve:
            "Solenoid Valve"
    };


    return (
        labels[component.role] ||
        component.label
    );
}


function componentDisplayLabel(component) {

    /*
     * Metering-device subtype is useful
     * directly on the system diagram.
     */

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
                    activeMeasurementPoints.keys()
                ),

            addMeasurementMode
        }
    );
}


/*
 * =========================================================
 * TOOL ICONS
 * =========================================================
 *
 * These are intentionally simple placeholder SVG icons.
 *
 * Later we can replace only these graphics with a polished
 * icon library without changing the tool architecture.
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
                    class="tool-icon-button
                        ${
                            activeTool ===
                            "measurements"
                                ? "active"
                                : ""
                        }"

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
                    class="tool-icon-button
                        ${
                            activeTool ===
                            "component"
                                ? "active"
                                : ""
                        }"

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
        component.allowedSubtypes || [];


    if (allowedSubtypes.length <= 1) {

        if (component.required) {

            return `
                <div class="component-config-note">
                    Required system component
                </div>
            `;
        }


        return "";
    }


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


    return `
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


            ${
                component.required
                    ? `
                        <div
                            class="component-config-note"
                        >
                            Required system component
                        </div>
                    `
                    : ""
            }

        </div>
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


            /*
             * Keep component ID and functional role
             * unchanged.
             */

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
        measurementValues.get(key) ??
        "";


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

function buildMeasurementFields(item) {

    const measurements =
        item.measurements || [];


    const capabilities =
        item.capabilities || null;


    if (measurements.length === 0) {
        return "";
    }


    /*
     * Backward compatibility for older
     * system definitions.
     */

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


    const fields = [];


    measurements.forEach(
        measurement => {

            /*
             * -------------------------
             * PRESSURE
             * -------------------------
             */

            if (
                measurement.id ===
                "pressure"
            ) {

                const pressureCapability =
                    capabilities.pressure ||
                    "none";


                /*
                 * Known pressure access.
                 */

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


                /*
                 * Optional pressure access.
                 */

                if (
                    pressureCapability ===
                    "optional"
                ) {

                    const hasPressureAccess =
                        optionalPressureAccess
                            .has(item.id);


                    if (hasPressureAccess) {

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
                            <div
                                class="pressure-access-option"
                            >

                                <div
                                    class="pressure-access-text"
                                >
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


            /*
             * -------------------------
             * TEMPERATURE
             * -------------------------
             */

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


            /*
             * Future measurement types.
             */

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

    /*
     * ADD POINT MODE
     */

    if (addMeasurementMode) {

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


        /*
         * After the user selects a new point,
         * immediately show its data-entry fields
         * while Add Point mode remains active.
         */

        if (selectedMeasurementPoint) {

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


    /*
     * SELECTED ACTIVE POINT
     */

    if (selectedMeasurementPoint) {

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


    /*
     * DEFAULT MEASUREMENTS SCREEN
     */

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


function buildMeasurementPointContent(point) {

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
     * DEFAULT COMPONENT SCREEN
     *
     * This is deliberately shown whenever the user
     * manually clicks the Component tool icon.
     */

    if (!selectedComponent) {

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


                <div class="tool-empty-state">

                    <strong>
                        No component selected
                    </strong>

                    <p>
                        Select a component on the
                        system diagram to view or
                        configure it.
                    </p>

                </div>

            </div>
        `;
    }


    /*
     * SELECTED COMPONENT
     */

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


            <div class="selected-tool-item">

                <div class="selected-type">
                    COMPONENT
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

        </div>
    `;
}


/*
 * =========================================================
 * ACTIVE TOOL CONTENT
 * =========================================================
 */

function buildActiveToolContent() {

    if (activeTool === "component") {

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

    /*
     * Hide the old static Measurements heading/help
     * from index.html.
     *
     * The new tool workspace owns the complete
     * right-side interface.
     */

    if (originalPanelTitle) {
        originalPanelTitle.style.display =
            "none";
    }


    if (originalPanelHelp) {
        originalPanelHelp.style.display =
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

function switchTool(toolName) {

    if (
        toolName !== "measurements" &&
        toolName !== "component"
    ) {

        return;
    }


    /*
     * Tool icon selection always opens that tool's
     * DEFAULT screen.
     *
     * We deliberately do not preserve the previous
     * selected object in the visible panel.
     */


    /*
     * Leaving measurement work always exits
     * Add Point mode.
     */

    addMeasurementMode =
        false;


    if (toolName === "measurements") {

        activeTool =
            "measurements";


        /*
         * Default Measurements screen.
         */

        selectedMeasurementPoint =
            null;


        /*
         * Component selection is also cleared so
         * returning later to Component via its icon
         * gives the default Component screen.
         */

        selectedComponent =
            null;
    }


    else if (toolName === "component") {

        activeTool =
            "component";


        /*
         * Default Component screen.
         */

        selectedComponent =
            null;


        /*
         * Measurement selection is not part of the
         * Component workspace.
         */

        selectedMeasurementPoint =
            null;
    }


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
     * TOOL ICONS
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
     * ADD POINT / DONE
     */

    const addPointButton =
        document.getElementById(
            "add-point-button"
        );


    if (addPointButton) {

        addPointButton.addEventListener(
            "click",
            () => {

                /*
                 * ENTER ADD POINT MODE
                 */

                if (!addMeasurementMode) {

                    activeTool =
                        "measurements";

                    addMeasurementMode =
                        true;

                    selectedMeasurementPoint =
                        null;

                    selectedComponent =
                        null;
                }


                /*
                 * DONE ADDING
                 */

                else {

                    addMeasurementMode =
                        false;


                    /*
                     * Return to the default
                     * Measurements screen.
                     */

                    selectedMeasurementPoint =
                        null;
                }


                renderCurrentSystem();

                renderSidePanel();
            }
        );
    }


    /*
     * MEASUREMENT INPUTS
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
     * ADD OPTIONAL PRESSURE ACCESS
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
     * REMOVE OPTIONAL PRESSURE ACCESS
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
     * REMOVE MEASUREMENT POINT
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


                /*
                 * Remove all readings associated
                 * with this point.
                 */

                (point.measurements || [])
                    .forEach(
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
     * COMPONENT SUBTYPE
     */

    if (
        activeTool === "component" &&
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

function loadSystem(systemId) {

    const systemDefinition =
        systems[systemId];


    if (!systemDefinition) {
        return;
    }


    /*
     * Never modify the imported master
     * system definition.
     */

    currentSystem =
        structuredClone(
            systemDefinition
        );


    /*
     * New system starts at the default
     * Measurements tool.
     */

    activeTool =
        "measurements";

    addMeasurementMode =
        false;

    selectedComponent =
        null;

    selectedMeasurementPoint =
        null;


    activeMeasurementPoints.clear();

    measurementValues.clear();

    optionalPressureAccess.clear();


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


/*
 * COMPONENT CLICK
 *
 * Diagram interaction automatically opens
 * the Component tool.
 */

document.addEventListener(
    "system-component-selected",
    event => {

        /*
         * Component selection takes priority over
         * Add Point mode.
         */

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


/*
 * NEW MEASUREMENT POINT
 *
 * Only available while Add Point mode is active.
 */

document.addEventListener(
    "system-measurement-point-toggle",
    event => {

        if (!addMeasurementMode) {
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


        /*
         * Immediately display the newly added
         * point so readings can be entered.
         */

        selectedMeasurementPoint =
            point;


        renderCurrentSystem();

        renderSidePanel();
    }
);


/*
 * EXISTING ACTIVE MEASUREMENT POINT
 *
 * Diagram interaction automatically opens
 * the Measurements tool.
 */

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