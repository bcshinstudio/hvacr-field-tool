import {
    drawComponentGraphic,
    getComponentPort
} from "./component_graphics.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function el(name, attrs = {}) {
    const node = document.createElementNS(SVG_NS, name);
    for (const [key, value] of Object.entries(attrs)) {
        node.setAttribute(key, value);
    }
    return node;
}

const sectionColors = {
    discharge: "#ef6255",
    liquid: "#e7a62b",
    expansion: "#4aabc8",
    suction: "#3b82c4"
};

function drawConnection(svg, connection, start, end) {
    const color = sectionColors[connection.section] || "#778899";

    const pipe = el("path", {
        d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
        fill: "none",
        stroke: color,
        "stroke-width": "0.48",
        "stroke-linecap": "round"
    });
    svg.appendChild(pipe);

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;

    const flow = el("path", {
        d: "M -0.9 -0.7 L 0 0 L -0.9 0.7",
        transform: `translate(${midX} ${midY}) rotate(${angle})`,
        fill: "none",
        stroke: color,
        "stroke-width": "0.35",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
    });
    svg.appendChild(flow);
}

function getPointCoordinates(point, componentMap) {
    const from = componentMap[point.connectionFrom];
    const to = componentMap[point.connectionTo];
    if (!from || !to) return null;

    const start = getComponentPort(from, "outlet");
    const end = getComponentPort(to, "inlet");
    const position = point.position ?? 0.5;

    return {
        x: start.x + (end.x - start.x) * position,
        y: start.y + (end.y - start.y) * position
    };
}

function drawMeasurementPoint(svg, point, componentMap, active) {
    const coordinates = getPointCoordinates(point, componentMap);
    if (!coordinates) return;

    const { x, y } = coordinates;

    const group = el("g", {
        class: active
            ? "measurement-point measurement-point-active"
            : "measurement-point measurement-point-available",
        cursor: "pointer"
    });

    const hitArea = el("circle", {
        cx: x,
        cy: y,
        r: active ? 2.8 : 2.4,
        fill: "transparent",
        stroke: "none",
        "pointer-events": "all"
    });

    const marker = el("circle", {
        cx: x,
        cy: y,
        r: active ? 0.82 : 0.62,
        fill: "#ffffff",
        stroke: active ? "#245f8f" : "#6f8495",
        "stroke-width": active ? "0.38" : "0.28",
        "stroke-dasharray": active ? "none" : "0.55 0.45",
        "pointer-events": "none"
    });

    group.append(hitArea, marker);

    if (active) {
        const center = el("circle", {
            cx: x,
            cy: y,
            r: 0.26,
            fill: "#245f8f",
            "pointer-events": "none"
        });
        group.appendChild(center);
    }

    group.addEventListener("click", event => {
        event.stopPropagation();

        document.dispatchEvent(
            new CustomEvent(
                active
                    ? "system-measurement-point-selected"
                    : "system-measurement-point-toggle",
                { detail: point }
            )
        );
    });

    svg.appendChild(group);
}

export function renderSystemDiagram(container, system, options = {}) {
    container.innerHTML = "";

    const activeMeasurementPointIds =
        options.activeMeasurementPointIds || new Set();

    const addMeasurementMode =
        options.addMeasurementMode || false;

    const svg = el("svg", {
        viewBox: "8 7 84 82",
        class: "system-svg",
        preserveAspectRatio: "xMidYMid meet"
    });

    const componentMap = {};
    system.components.forEach(component => {
        componentMap[component.id] = component;
    });

    system.connections.forEach(connection => {
        const from = componentMap[connection.from];
        const to = componentMap[connection.to];
        if (!from || !to) return;

        drawConnection(
            svg,
            connection,
            getComponentPort(from, "outlet"),
            getComponentPort(to, "inlet")
        );
    });

    system.components.forEach(component => {
        const group = el("g", {
            class: "system-component"
        });

        group.dataset.componentId = component.id;
        drawComponentGraphic(group, component);

        group.addEventListener("click", () => {
            document.dispatchEvent(
                new CustomEvent("system-component-selected", {
                    detail: component
                })
            );
        });

        svg.appendChild(group);
    });

    (system.measurementPoints || []).forEach(point => {
        const active = activeMeasurementPointIds.has(point.id);

        if (active || addMeasurementMode) {
            drawMeasurementPoint(
                svg,
                point,
                componentMap,
                active
            );
        }
    });

    container.appendChild(svg);
}
