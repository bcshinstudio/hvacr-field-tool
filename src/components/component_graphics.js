const SVG_NS = "http://www.w3.org/2000/svg";

function el(name, attrs = {}) {
    const node = document.createElementNS(SVG_NS, name);

    for (const [key, value] of Object.entries(attrs)) {
        node.setAttribute(key, value);
    }

    return node;
}


/*
 * All dimensions and ports belong to the graphic.
 * Coordinates are relative to component center.
 */
const geometry = {

    compressor: {
        // Vertical service/refrigerant connection layout:
        // suction enters at the bottom; discharge leaves at the top.
        inlet:  { x: 0, y:  3.2 },
        outlet: { x: 0, y: -3.2 }
    },

    condenser: {
        inlet:  { x: -5, y: 0 },
        outlet: { x:  5, y: 0 }
    },

    evaporator: {
        inlet:  { x:  5, y: 0 },
        outlet: { x: -5, y: 0 }
    },

    receiver: {
        inlet:  { x: 0, y: -3.2 },
        outlet: { x: 0, y:  3.2 }
    },

    filter_drier: {
        inlet:  { x: -3.5, y: 0 },
        outlet: { x:  3.5, y: 0 }
    },

    sight_glass: {
        inlet:  { x: 0, y: -1.8 },
        outlet: { x: 0, y:  1.8 }
    },

    solenoid: {
        inlet:  { x: 0, y: -2.2 },
        outlet: { x: 0, y:  2.2 }
    },

    metering_device: {
        inlet:  { x: 0, y: -2.3 },
        outlet: { x: 0, y:  2.3 }
    }

};


function bodyStyle(node) {
    node.setAttribute("fill", "#ffffff");
    node.setAttribute("stroke", "#327caf");
    node.setAttribute("stroke-width", "0.45");
}


function detailStyle(node) {
    node.setAttribute("fill", "none");
    node.setAttribute("stroke", "#327caf");
    node.setAttribute("stroke-width", "0.35");
}


function addLabel(group, component, defaultOffset) {

    const position =
        component.labelPosition || "bottom";

    const offset =
        component.labelOffset ?? defaultOffset;

    let x = component.x;
    let y = component.y + offset;

    let anchor = "middle";


    switch (position) {

        case "top":
            x = component.x;
            y = component.y - offset;
            anchor = "middle";
            break;


        case "bottom":
            x = component.x;
            y = component.y + offset;
            anchor = "middle";
            break;


        case "left":
            x = component.x - offset;
            y = component.y + 0.5;
            anchor = "end";
            break;


        case "right":
            x = component.x + offset;
            y = component.y + 0.5;
            anchor = "start";
            break;
    }


    const text = el("text", {
        x,
        y,
        "text-anchor": anchor,
        "dominant-baseline": "middle",
        "font-size": "1.35",
        "font-weight": "600",
        fill: "#263746"
    });
	

    text.textContent = component.label;

    group.appendChild(text);
}

function addHitArea(group, component) {

	const hitArea = el("circle", {
		cx: component.x,
		cy: component.y,
		r: 5.5,
		fill: "transparent",
		stroke: "none",
		"pointer-events": "all"
	});

	/*
	 * Must be first so visible component graphics
	 * are drawn on top of it.
	 */
	group.appendChild(hitArea);
}	


function addPort(group, x, y, type) {

    const port = el("circle", {
        cx: x,
        cy: y,
        r: 0.42,
        stroke: "#34495e",
        "stroke-width": "0.28"
    });

    if (type === "inlet") {
        port.setAttribute("fill", "#ffffff");
    } else {
        port.setAttribute("fill", "#34495e");
    }

    group.appendChild(port);
}


function addPorts(group, component) {

    const g = geometry[component.type];

    if (!g) return;

    addPort(
        group,
        component.x + g.inlet.x,
        component.y + g.inlet.y,
        "inlet"
    );

    addPort(
        group,
        component.x + g.outlet.x,
        component.y + g.outlet.y,
        "outlet"
    );
}


/* COMPRESSOR */

function compressor(group, c) {

    const body = el("circle", {
        cx: c.x,
        cy: c.y,
        r: 2.8
    });

    bodyStyle(body);


    const detail = el("path", {
        d: `
            M ${c.x - 1.1} ${c.y + 1.4}
            Q ${c.x + 1.6} ${c.y}
              ${c.x - 1.1} ${c.y - 1.4}
            Z
        `
    });

    detailStyle(detail);


    group.append(body, detail);

    addPorts(group, c);
    addLabel(group, c, 4.6);
}


/* CONDENSER / EVAPORATOR */

function coil(group, c) {

    const body = el("rect", {
        x: c.x - 5,
        y: c.y - 2.4,
        width: 10,
        height: 4.8,
        rx: 0.8
    });

    bodyStyle(body);


    const detail = el("path", {
        d: `
            M ${c.x - 3.8} ${c.y}
            l 1 -1.1
            l 1 2.2
            l 1 -2.2
            l 1 2.2
            l 1 -2.2
            l 1 2.2
            l 0.8 -1.1
        `
    });

    detailStyle(detail);


    group.append(body, detail);

    addPorts(group, c);
    addLabel(group, c, 4);
}


/* RECEIVER */

function receiver(group, c) {

    const body = el("rect", {
        x: c.x - 1.8,
        y: c.y - 3.2,
        width: 3.6,
        height: 6.4,
        rx: 1.8
    });

    bodyStyle(body);

    group.appendChild(body);

    addPorts(group, c);
    addLabel(group, c, 4.8);
}


/* FILTER DRIER */

function filterDrier(group, c) {

    const body = el("rect", {
        x: c.x - 3.5,
        y: c.y - 1.4,
        width: 7,
        height: 2.8,
        rx: 1.4
    });

    bodyStyle(body);


    const left = el("line", {
        x1: c.x - 1.8,
        y1: c.y - 1,
        x2: c.x - 1.8,
        y2: c.y + 1
    });

    const right = el("line", {
        x1: c.x + 1.8,
        y1: c.y - 1,
        x2: c.x + 1.8,
        y2: c.y + 1
    });

    detailStyle(left);
    detailStyle(right);


    group.append(body, left, right);

    addPorts(group, c);
    addLabel(group, c, 3.4);
}


/* SIGHT GLASS */

function sightGlass(group, c) {

    const outer = el("circle", {
        cx: c.x,
        cy: c.y,
        r: 1.8
    });

    bodyStyle(outer);


    const inner = el("circle", {
        cx: c.x,
        cy: c.y,
        r: 0.8,
        fill: "#dcecf6",
        stroke: "#327caf",
        "stroke-width": "0.3"
    });


    group.append(outer, inner);

    addPorts(group, c);
    addLabel(group, c, 3.4);
}


/* SOLENOID */

function solenoid(group, c) {

    const body = el("rect", {
        x: c.x - 2.6,
        y: c.y - 2.2,
        width: 5.2,
        height: 4.4,
        rx: 0.6
    });

    bodyStyle(body);


    const detail = el("path", {
        d: `
            M ${c.x - 1.4} ${c.y + 1}
            L ${c.x} ${c.y - 1}
            L ${c.x + 1.4} ${c.y + 1}
        `
    });

    detailStyle(detail);


    group.append(body, detail);

    addPorts(group, c);
    addLabel(group, c, 3.6);
}


/* METERING DEVICE */

function meteringDevice(group, c) {

    const body = el("path", {
        d: `
            M ${c.x - 2.5} ${c.y - 2.3}
            L ${c.x} ${c.y}
            L ${c.x - 2.5} ${c.y + 2.3}
            Z

            M ${c.x + 2.5} ${c.y - 2.3}
            L ${c.x} ${c.y}
            L ${c.x + 2.5} ${c.y + 2.3}
            Z
        `
    });

    bodyStyle(body);

    group.appendChild(body);

    addPorts(group, c);
    addLabel(group, c, 3.8);
}


const renderers = {
    compressor,
    condenser: coil,
    evaporator: coil,
    receiver,
    filter_drier: filterDrier,
    sight_glass: sightGlass,
    solenoid,
    metering_device: meteringDevice
};


export function drawComponentGraphic(group, component) {

    /*
     * Larger invisible click/touch target.
     */
    addHitArea(
        group,
        component
    );


    const renderer =
        renderers[component.type];


    if (renderer) {

        renderer(
            group,
            component
        );

    }
}


export function getComponentPort(component, name) {

    const g = geometry[component.type];

    if (!g) {
        return {
            x: component.x,
            y: component.y
        };
    }

    return {
        x: component.x + g[name].x,
        y: component.y + g[name].y
    };
}