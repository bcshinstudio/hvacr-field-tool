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


/*
 * =========================================================
 * CONNECTION DRAWING
 * =========================================================
 */

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


/*
 * =========================================================
 * ACTIVE CONNECTION LOOKUP
 * =========================================================
 *
 * Measurement locations are no longer permanently tied to a
 * specific pair such as:
 *
 *     condenser -> receiver
 *
 * Instead, they belong semantically to a component port:
 *
 *     condenser outlet
 *
 * We then inspect the CURRENT active system.connections to
 * determine which pipe is actually attached to that port.
 *
 * Example:
 *
 * Receiver installed:
 *
 *     condenser -> receiver
 *
 * Receiver removed:
 *
 *     condenser -> filter_drier
 *
 * condenser_outlet remains valid in both cases.
 */


/*
 * Find the active connection leaving a component.
 */

function findOutgoingConnection(
    componentId,
    connections
) {

    return connections.find(
        connection =>
            connection.from ===
            componentId
    ) || null;
}


/*
 * Find the active connection entering a component.
 */

function findIncomingConnection(
    componentId,
    connections
) {

    return connections.find(
        connection =>
            connection.to ===
            componentId
    ) || null;
}


/*
 * =========================================================
 * SEMANTIC MEASUREMENT LOCATION AVAILABILITY
 * =========================================================
 */

function isMeasurementLocationAvailable(
    point,
    componentMap
) {

    /*
     * Some field locations only exist when a particular
     * optional component is installed.
     *
     * Examples:
     *
     * receiver_inlet
     * receiver_outlet
     * filter_drier_inlet
     * solenoid_outlet
     */

    if (point.requiresComponent) {

        const requiredComponent =
            componentMap[
                point.requiresComponent
            ];


        if (
            !requiredComponent ||
            !isComponentInstalled(
                requiredComponent
            )
        ) {

            return false;
        }
    }


    /*
     * A semantic refrigerant location must have an anchor.
     */

    if (
        !point.anchor ||
        !point.anchor.component ||
        !point.anchor.side
    ) {

        return false;
    }


    const anchorComponent =
        componentMap[
            point.anchor.component
        ];


    if (
        !anchorComponent ||
        !isComponentInstalled(
            anchorComponent
        )
    ) {

        return false;
    }


    return true;
}


/*
 * =========================================================
 * SEMANTIC POINT COORDINATES
 * =========================================================
 *
 * Resolve a semantic location against the ACTIVE topology.
 *
 * anchor.side = "outlet"
 *
 *     Find the active connection leaving the anchor component.
 *
 * anchor.side = "inlet"
 *
 *     Find the active connection entering the anchor component.
 *
 *
 * Position meaning:
 *
 * For an outlet location:
 *
 *     0.0 = anchor component outlet
 *     1.0 = next component inlet
 *
 *
 * For an inlet location we want the semantic position to remain
 * relative to the anchor component.
 *
 * Example:
 *
 *     position: 0.82
 *
 * means "close to the component inlet."
 *
 * Because active connections are stored in refrigerant-flow
 * direction, the same 0..1 interpolation can be used.
 */

function getSemanticPointCoordinates(
    point,
    componentMap,
    connections
) {

    if (
        !isMeasurementLocationAvailable(
            point,
            componentMap
        )
    ) {

        return null;
    }


    const anchorComponent =
        componentMap[
            point.anchor.component
        ];


    const side =
        point.anchor.side;


    let connection = null;


    if (side === "outlet") {

        connection =
            findOutgoingConnection(
                anchorComponent.id,
                connections
            );

    } else if (side === "inlet") {

        connection =
            findIncomingConnection(
                anchorComponent.id,
                connections
            );

    } else {

        return null;
    }


    /*
     * If there is no active pipe attached to the requested
     * component side, the point cannot currently be drawn.
     */

    if (!connection) {

        return null;
    }


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


/*
 * =========================================================
 * LEGACY POINT COORDINATES
 * =========================================================
 *
 * Temporary compatibility fallback.
 *
 * Other system profiles may still use the old:
 *
 *     connectionFrom
 *     connectionTo
 *
 * format.
 *
 * Walk-In Cooler V2 will use semantic anchors, but keeping this
 * fallback prevents this diagram engine from unnecessarily
 * breaking older system definitions while we migrate them.
 */

function getLegacyPointCoordinates(
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


/*
 * =========================================================
 * GENERAL POINT COORDINATE RESOLVER
 * =========================================================
 */

function getPointCoordinates(
    point,
    componentMap,
    connections
) {

    /*
     * V2 semantic model.
     */

    if (
        point.anchor &&
        point.anchor.component &&
        point.anchor.side
    ) {

        return getSemanticPointCoordinates(
            point,
            componentMap,
            connections
        );
    }


    /*
     * Temporary V1 compatibility.
     */

    if (
        point.connectionFrom &&
        point.connectionTo
    ) {

        return getLegacyPointCoordinates(
            point,
            componentMap
        );
    }


    return null;
}


/*
 * =========================================================
 * MEASUREMENT POINT DRAWING
 * =========================================================
 */

function drawMeasurementPoint(
    svg,
    point,
    componentMap,
    connections,
    active
) {

    const coordinates =
        getPointCoordinates(
            point,
            componentMap,
            connections
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
 * FIELD-DATA SOURCE
 * =========================================================
 *
 * Prefer the V2 semantic refrigerant-location model.
 *
 * During migration, fall back to measurementPoints for system
 * profiles that have not yet been converted.
 */

function getRefrigerantMeasurementLocations(
    system
) {

    const semanticLocations =
        system.fieldData
            ?.refrigerantLocations;


    if (
        Array.isArray(
            semanticLocations
        )
    ) {

        return semanticLocations;
    }


    return (
        system.measurementPoints ||
        []
    );
}


/*
 * =========================================================
 * SYSTEM DIAGRAM
 * =========================================================
 */

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


    /*
     * Wider left/right margins prevent component labels
     * near the edge of the system from being clipped.
     */

    const svg = el(
        "svg",
        {
            viewBox:
                "0 7 100 82",

            class:
                "system-svg",

            preserveAspectRatio:
                "xMidYMid meet"
        }
    );


    /*
     * =====================================================
     * COMPONENT LOOKUP
     * =====================================================
     */

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
     * =====================================================
     * ACTIVE CONNECTIONS
     * =====================================================
     *
     * app.js currently rebuilds system.connections when
     * optional components are added or removed.
     *
     * Therefore this list represents the current active
     * refrigerant topology.
     */

    const activeConnections =
        system.connections || [];


    /*
     * =====================================================
     * REFRIGERANT CONNECTIONS
     * =====================================================
     */

    activeConnections
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
     * =====================================================
     * INSTALLED COMPONENTS
     * =====================================================
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
     * =====================================================
     * REFRIGERANT MEASUREMENT LOCATIONS
     * =====================================================
     *
     * Walk-In Cooler now comes from:
     *
     *     fieldData.refrigerantLocations
     *
     * Other systems can temporarily continue using:
     *
     *     measurementPoints
     *
     * Semantic points automatically follow the active
     * connection attached to their component inlet/outlet.
     */

    const measurementLocations =
        getRefrigerantMeasurementLocations(
            system
        );


    measurementLocations
        .forEach(
            point => {

                /*
                 * Do not offer a location belonging to an
                 * optional component that is not installed.
                 */

                if (
                    !isMeasurementLocationAvailable(
                        point,
                        componentMap
                    ) &&
                    point.anchor
                ) {

                    return;
                }


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
                        activeConnections,
                        active
                    );
                }
            }
        );


    container.appendChild(
        svg
    );
}