import { walkInCooler } from "./systems/walk_in_cooler.js";
import { acSplit } from "./systems/ac_split.js";
import { renderSystemDiagram } from "./components/system_diagram.js";

const systems = {
    walk_in_cooler: walkInCooler,
    ac_split: acSplit
};

const systemSelect = document.getElementById("system-select");
const diagramContainer = document.getElementById("system-diagram");
const systemTitle = document.getElementById("system-title");
const systemDescription = document.getElementById("system-description");
const measurementContent = document.getElementById("measurement-content");

let currentSystem = null;
let addMeasurementMode = false;

/*
 * State is kept outside the SVG so re-rendering the diagram
 * does not erase activated points or entered readings.
 */
const activeMeasurementPoints = new Map();
const measurementValues = new Map();

function measurementKey(pointId, measurementId) {
    return `${pointId}:${measurementId}`;
}

function renderCurrentSystem() {
    if (!currentSystem) return;

    renderSystemDiagram(
        diagramContainer,
        currentSystem,
        {
            activeMeasurementPointIds:
                new Set(activeMeasurementPoints.keys()),
            addMeasurementMode
        }
    );
}

function addMeasurementButtonHtml() {
    return `
        <div class="measurement-toolbar">
            <button
                id="add-measurement-button"
                class="measurement-action-button"
                type="button"
            >
                ${addMeasurementMode ? "Done Adding" : "+ Measurement"}
            </button>
        </div>
    `;
}

function bindAddMeasurementButton() {
    const button = document.getElementById("add-measurement-button");
    if (!button) return;

    button.addEventListener("click", () => {
        addMeasurementMode = !addMeasurementMode;
        renderCurrentSystem();
        showEmptyMeasurements();
    });
}

function showEmptyMeasurements() {
    measurementContent.innerHTML = `
        ${addMeasurementButtonHtml()}

        <div class="empty-state">
            ${
                addMeasurementMode
                    ? "Select an available measurement location on the diagram."
                    : "Select a component or active measurement point."
            }
        </div>
    `;

    bindAddMeasurementButton();
}

function loadSystem(systemId) {
    const system = systems[systemId];
    if (!system) return;

    currentSystem = system;
    addMeasurementMode = false;

    /*
     * 0.3C keeps state while working within one system.
     * Switching system starts a fresh measurement session.
     */
    activeMeasurementPoints.clear();
    measurementValues.clear();

    systemTitle.textContent = system.name;
    systemDescription.textContent = system.description;

    renderCurrentSystem();
    showEmptyMeasurements();
}

function buildMeasurementFields(item) {
    const measurements = item.measurements || [];

    if (measurements.length === 0) {
        return `
            <div class="measurement-none">
                No measurements defined for this location.
            </div>
        `;
    }

    return measurements
        .map(measurement => {
            const key = measurementKey(item.id, measurement.id);
            const savedValue = measurementValues.get(key) ?? "";

            return `
                <div class="measurement-field">
                    <label for="measurement-${item.id}-${measurement.id}">
                        ${measurement.label}
                    </label>

                    <div class="measurement-input-row">
                        <input
                            id="measurement-${item.id}-${measurement.id}"
                            data-point-id="${item.id}"
                            data-measurement-id="${measurement.id}"
                            type="${measurement.inputType || "number"}"
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
        })
        .join("");
}

function bindMeasurementInputs() {
    measurementContent
        .querySelectorAll("[data-point-id][data-measurement-id]")
        .forEach(input => {
            input.addEventListener("input", event => {
                const pointId = event.target.dataset.pointId;
                const measurementId = event.target.dataset.measurementId;

                measurementValues.set(
                    measurementKey(pointId, measurementId),
                    event.target.value
                );
            });
        });
}

function showComponentMeasurements(component) {
    measurementContent.innerHTML = `
        ${addMeasurementButtonHtml()}

        <div class="selected-component">
            <div class="selected-type">
                ${component.selectionType || "COMPONENT"}
            </div>

            <h3>${component.label}</h3>

            <div class="component-measurements">
                ${buildMeasurementFields(component)}
            </div>
        </div>
    `;

    bindAddMeasurementButton();
    bindMeasurementInputs();
}

function showMeasurementPoint(point) {
    measurementContent.innerHTML = `
        ${addMeasurementButtonHtml()}

        <div class="selected-component">
            <div class="selected-type">
                MEASUREMENT POINT
            </div>

            <h3>${point.label}</h3>

            <div class="component-measurements">
                ${buildMeasurementFields(point)}
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

    bindAddMeasurementButton();
    bindMeasurementInputs();

    const removeButton =
        document.getElementById("remove-measurement-point");

    removeButton.addEventListener("click", () => {
        activeMeasurementPoints.delete(point.id);

        (point.measurements || []).forEach(measurement => {
            measurementValues.delete(
                measurementKey(point.id, measurement.id)
            );
        });

        renderCurrentSystem();
        showEmptyMeasurements();
    });
}

systemSelect.addEventListener("change", event => {
    loadSystem(event.target.value);
});

document.addEventListener(
    "system-component-selected",
    event => {
        showComponentMeasurements(event.detail);
    }
);

document.addEventListener(
    "system-measurement-point-toggle",
    event => {
        const point = event.detail;

        activeMeasurementPoints.set(point.id, point);

        /*
         * Stay in Add mode so several locations can be
         * activated without repeatedly pressing + Measurement.
         */
        renderCurrentSystem();
        showMeasurementPoint(point);
    }
);

document.addEventListener(
    "system-measurement-point-selected",
    event => {
        showMeasurementPoint(event.detail);
    }
);

loadSystem(systemSelect.value);
