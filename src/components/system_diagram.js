import {
    drawComponentGraphic,
    getComponentPort
} from "./component_graphics.js";


const SVG_NS =
    "http://www.w3.org/2000/svg";


function el(name, attrs = {}) {

    const node =
        document.createElementNS(
            SVG_NS,
            name
        );


    for (
        const [key, value]
        of Object.entries(attrs)
    ) {

        node.setAttribute(
            key,
            value
        );
    }


    return node;
}


const sectionColors = {

    discharge: "#ef6255",
    liquid: "#e7a62b",
    expansion: "#4aabc8",
    suction: "#3b82c4"
};


function isComponentInstalled(
    component
) {

    return component.installed !== false;
}


function drawConnection(
    svg,
    connection,
    start,
    end
) {

    const color =
        sectionColors[
            connection.section
        ] || "#778899";


    const pipe = el(
        "path",
        {
            d:
                `M ${start.x} ${start.y} ` +
                `L ${end.x} ${end.y}`,

            fill: "none",

            stroke: color,

            "stroke-width": "0.48",

            "stroke-linecap":
                "round"
        }
    );


    svg.appendChild(
        pipe
    );


    const midX =
        (start.x + end.x) / 2;

    const midY =
        (start.y + end.y) / 2;


    const angle =
        Math.atan2(
            end.y - start.y,
            end.x - start.x
        ) *
        180 /
        Math.PI;


    const flow = el(
        "path",
        {
            d:
                "M -0.9 -0.7 " +
                "L 0 0 " +
                "L -0.9 0.7",

            transform:
                `translate(${midX} ${midY}) ` +
                `rotate(${angle})`,

            fill: "none",

            stroke: color,

            "stroke-width": "0.35",

            "stroke-linecap":
                "round",

            "stroke-linejoin":
                "round"
        }
    );


    svg.appendChild(
        flow
    );
}


function getPointCoordinates(
    point,
    componentMap
) {

    const from =
        componentMap[
            point.connectionFrom
        ];

    const to =
        componentMap[
            point.connectionTo
        ];


    if (
        !from ||
        !to ||
        !isComponentInstalled(from) ||
        !isComponentInstalled(to)
    ) {

        return null;
    }


    const start =
        getComponentPort(
            from,
            "outlet"
        );

    const end =
        getComponentPort(
            to,
            "inlet"
        );


    const position =
        point.position ?? 0.5;


    return {

        x:
            start.x +
            (
                end.x -
                start.x
            ) *
            position,

        y:
            start.y +
            (
                end.y -
                start.y
            ) *
            position
    };
}


function drawMeasurementPoint(
    svg,
    point,
    componentMap,
    active
) {

    const coordinates =
        getPointCoordinates(
            point,
            componentMap
        );


    if (!coordinates) {
        return;
    }


    const {
        x,
        y
    } = coordinates;


    const group = el(
        "g",
        {
            class:
                active
                    ? "measurement-point measurement-point-active"
                    : "measurement-point measurement-point-available",

            cursor: "pointer"
        }
    );


    const hitArea = el(
        "circle",
        {
            cx: x,
            cy: y,

            r:
                active
                    ? 2.8
                    : 2.4,

            fill: "transparent",

            stroke: "none",

            "pointer-events":
                "all"
        }
    );


    const marker = el(
        "circle",
        {
            cx: x,
            cy: y,

            r:
                active
                    ? 0.82
                    : 0.62,

            fill: "#ffffff",

            stroke:
                active
                    ? "#245f8f"
                    : "#6f8495",

            "stroke-width":
                active
                    ? "0.38"
                    : "0.28",

            "stroke-dasharray":
                active
                    ? "none"
                    : "0.55 0.45",

            "pointer-events":
                "none"
        }
    );


    group.append(
        hitArea,
        marker
    );


    if (active) {

        const center = el(
            "circle",
            {
                cx: x,
                cy: y,

                r: 0.26,

                fill: "#245f8f",

                "pointer-events":
                    "none"
            }
        );


        group.appendChild(
            center
        );
    }


    group.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            document.dispatchEvent(

                new CustomEvent(

                    active
                        ? "system-measurement-point-selected"
                        : "system-measurement-point-toggle",

                    {
                        detail: point
                    }
                )
            );
        }
    );


    svg.appendChild(
        group
    );
}


/*
 * =========================================================
 * AIR / SPACE TEMPERATURE MARKERS
 * =========================================================
 *
 * Air measurements are intentionally drawn differently from
 * refrigerant measurement points. They are not attached to
 * refrigerant piping.
 */

function getAirMarkerPosition(location, componentMap) {

    /*
     * Box temperature is shown with the system description.
     * Coil air temperatures are drawn outside the refrigerant
     * loop so they do not compete with piping or service points.
     */

    const supported = new Set([
        "evaporator_entering_air",
        "evaporator_leaving_air",
        "condenser_entering_air",
        "condenser_leaving_air"
    ]);


    if (!supported.has(location.id)) {
        return null;
    }


    const component =
        componentMap[
            location.anchor?.component
        ];


    if (!component || !isComponentInstalled(component)) {
        return null;
    }


    /*
     * Evaporator markers sit below the evaporator.
     * Condenser markers sit above the condenser.
     * The labels come from the semantic measurement definition;
     * these positions describe air-side locations, not refrigerant
     * inlet/outlet ports.
     */

    switch (location.id) {

        case "evaporator_entering_air":
            return {
                x: component.x + 7.2,
                y: component.y + 7.0,
                shortLabel: "Air In"
            };

        case "evaporator_leaving_air":
            return {
                x: component.x - 7.2,
                y: component.y + 7.0,
                shortLabel: "Air Out"
            };

        case "condenser_entering_air":
            return {
                x: component.x - 7.2,
                y: component.y - 7.0,
                shortLabel: "Air In"
            };

        case "condenser_leaving_air":
            return {
                x: component.x + 7.2,
                y: component.y - 7.0,
                shortLabel: "Air Out"
            };

        default:
            return null;
    }
}

function drawAirMeasurementMarker(
    svg,
    location,
    componentMap,
    measurementValues,
    selected
) {

    const position =
        getAirMarkerPosition(
            location,
            componentMap
        );


    if (!position) {
        return;
    }


    const key =
        `${location.id}:temperature`;


    const savedValue =
        measurementValues?.get?.(key);


    const hasValue =
        savedValue !== undefined &&
        savedValue !== null &&
        String(savedValue).trim() !== "";


    const group = el(
        "g",
        {
            class:
                selected
                    ? "air-measurement-marker air-measurement-marker-selected"
                    : "air-measurement-marker",
            cursor: "pointer"
        }
    );


    const hitArea = el(
        "circle",
        {
            cx: position.x,
            cy: position.y,
            r: 4.1,
            fill: "transparent",
            stroke: "none",
            "pointer-events": "all"
        }
    );


    const marker = el(
        "circle",
        {
            cx: position.x,
            cy: position.y,
            r: selected ? 2.25 : 2.0,
            fill: hasValue ? "#e9f6fd" : "#ffffff",
            stroke: selected ? "#0b78bd" : "#4b93bd",
            "stroke-width": selected ? "0.48" : "0.34",
            "pointer-events": "none"
        }
    );


    const t = el(
        "text",
        {
            x: position.x,
            y: position.y,
            "text-anchor": "middle",
            "dominant-baseline": "central",
            "font-size": "1.4",
            "font-family": "Arial, sans-serif",
            "font-weight": "600",
            fill: "#277fb5",
            "pointer-events": "none"
        }
    );

    t.textContent =
        hasValue
            ? String(savedValue)
            : "T";


    const label = el(
        "text",
        {
            x: position.x,
            y:
                location.id.startsWith("condenser_")
                    ? position.y - 3.4
                    : position.y + 3.9,
            "text-anchor": "middle",
            "font-size": "1.4",
            "font-family": "Arial, sans-serif",
            fill: "#536b7c",
            "pointer-events": "none"
        }
    );

    label.textContent = position.shortLabel;


    group.append(
        hitArea,
        marker,
        t,
        label
    );


    group.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            document.dispatchEvent(
                new CustomEvent(
                    "system-air-measurement-selected",
                    { detail: location }
                )
            );
        }
    );


    svg.appendChild(group);
}


export function renderSystemDiagram(
    container,
    system,
    options = {}
) {

    container.innerHTML = "";


    const activeMeasurementPointIds =
        options
            .activeMeasurementPointIds ||
        new Set();


    const addMeasurementMode =
        options.addMeasurementMode ||
        false;


    const airMeasurementLocations =
        options.airMeasurementLocations ||
        [];


    const airMeasurementValues =
        options.airMeasurementValues ||
        new Map();


    const selectedAirMeasurementId =
        options.selectedAirMeasurementId ||
        null;


    /*
     * Wider left/right margins prevent component labels
     * near the edge of the system from being clipped.
     */

    const svg = el(
        "svg",
        {
            viewBox:
                "0 2 100 94",

            class:
                "system-svg",

            preserveAspectRatio:
                "xMidYMid meet"
        }
    );


    const componentMap = {};


    system.components
        .forEach(
            component => {

                componentMap[
                    component.id
                ] = component;
            }
        );


    /*
     * Refrigerant connections.
     */

    system.connections
        .forEach(
            connection => {

                const from =
                    componentMap[
                        connection.from
                    ];

                const to =
                    componentMap[
                        connection.to
                    ];


                if (
                    !from ||
                    !to ||
                    !isComponentInstalled(from) ||
                    !isComponentInstalled(to)
                ) {

                    return;
                }


                drawConnection(

                    svg,

                    connection,

                    getComponentPort(
                        from,
                        "outlet"
                    ),

                    getComponentPort(
                        to,
                        "inlet"
                    )
                );
            }
        );


    /*
     * Installed components only.
     */

    system.components
        .forEach(
            component => {

                if (
                    !isComponentInstalled(
                        component
                    )
                ) {

                    return;
                }


                const group = el(
                    "g",
                    {
                        class:
                            "system-component"
                    }
                );


                group.dataset.componentId =
                    component.id;


                drawComponentGraphic(
                    group,
                    component
                );


                group.addEventListener(
                    "click",
                    () => {

                        document.dispatchEvent(

                            new CustomEvent(
                                "system-component-selected",
                                {
                                    detail:
                                        component
                                }
                            )
                        );
                    }
                );


                svg.appendChild(
                    group
                );
            }
        );


    /*
     * Air / space temperature markers.
     * These remain visible because they represent physical
     * air-temperature locations rather than refrigerant taps.
     */

    airMeasurementLocations
        .forEach(
            location => {

                drawAirMeasurementMarker(
                    svg,
                    location,
                    componentMap,
                    airMeasurementValues,
                    selectedAirMeasurementId ===
                        location.id
                );
            }
        );


    /*
     * Measurement points.
     *
     * Topology-aware rebinding will be the next step.
     */

    (
        system.measurementPoints ||
        []
    ).forEach(
        point => {

            const active =
                activeMeasurementPointIds
                    .has(
                        point.id
                    );


            if (
                active ||
                addMeasurementMode
            ) {

                drawMeasurementPoint(
                    svg,
                    point,
                    componentMap,
                    active
                );
            }
        }
    );


    container.appendChild(
        svg
    );
}