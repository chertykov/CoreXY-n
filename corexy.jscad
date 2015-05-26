// -*- mode: js; electric-indent-mode: t; indent-tabs-mode: nil -*-

var params;                        // parameter definitions.
var FN;                            // global resolution
var nema;                          // nema object. 14 or 17


// Different constant dimentions.

// Variable suffixes:
// dx - distance across X axis
// dy - distance across Y axis
// dz - distance across Z axis
var Size = {
    clr: {                      // Clearances:
        free: 0.2,              // - radial clearance for free mount;
        tight: 0.1,              // - tight mount.
        minimal: 0.05
    },
    
    m3: {
        wall: 3,                 // plastic wall for m3 screw support
        r: 3.4 / 2.0,            // M3 screw hole radius
        screw_r: 3.2 / 2.0,      // Screw without nut. Tight. Self tap.
        washer_h: 0.5,           // really it 0.5
        washer_r_o: 7 / 2,
        nut_r: 6.7 / 2,
        nut_h: 2.5,
        head_r: 5.7 / 2,         // real 5.4
        head_h: 3
    },
    
    m4: {
        wall: 3,                 // plastic wall for m3 screw support
        r: 4.4 / 2.0,            // M3 screw hole radius
        screw_r: 4.1 / 2.0,      // Screw without nut. Tight. Self tap.
        washer_h: 0.8,           //
        washer_r_o: 9.4 / 2,
        head_r: 7.3 / 2,         // real 5.4
        head_h: 4
    },
    rod_wall: 3,
    rod_x: {},
    rod_y: {},
    rod_z: {},
    lmuu_x: {},
    lmuu_y: {},
    lmuu_z: {},

    rod_y_wall_dist: 20,        // distance from wall to Y rod axis
    
    calc: function () {
        this.rod_x.d = rod_x_d;
        this.x.rod.r = _XYrodsDiam / 2;
        this.x.rod.l =  XrodLength;
        
        this.y.rod.d = _XYrodsDiam;
        this.y.rod.r = _XYrodsDiam / 2;
        this.y.rod.l =  YrodLength;
        
        this.z.rod.d = _ZrodsDiam;
        this.z.rod.r = _ZrodsDiam / 2;
        this.z.rod.l =  ZrodLength;
        
        if (_XYrodsDiam == 6) {
            this.x.lmuu = lm6uu;
            this.y.lmuu = lm6uu;
        }
        if (_XYrodsDiam == 8) {
            this.x.lmuu = lm8uu;
            this.y.lmuu = lm8uu;
        }
        if (_XYrodsDiam == 10) {
            this.x.lmuu = lm10uu;
            this.y.lmuu = lm10uu;
        }
        
        if (_ZrodsDiam == 6) this.z.lmuu = lm6uu;
        if (_ZrodsDiam == 8) this.z.lmuu = lm8uu;
        if (_ZrodsDiam == 10) this.z.lmuu = lm10uu;
        if (_ZrodsDiam == 12) this.z.lmuu = lm12uu;

        // Distances calculation
        // X distances
        dist.x.wall_belt_outer = nema.side_size / 2 + Size.gt2_pulley.belt_ro;
        dist.x.wall_belt_inner = dist.x.wall_belt_outer.belt_ro - belt.thickness;
        dist.x.rod_y_idler_axis = dist.x.wall_belt_outer + idler.r_w - Size.rod_y_wall_dist;

        dist.y.belt_offset = 22;  // Diameter of 608 bearing.
        dist.y.idler1_idler2 = dist.y.belt_offset - idler.r_i * 2; // Y distance between idlers.

        // Z distance form base (motor mount surface).
        dist.z.rod_y = Size.y.rod.r;
        dist.z.belt_offset = 3;               // Z distance from belt1 to belt2
        dist.z.belt1 = Size.rod_xy_wall + 0.2 + Size.y.rod.d + 2;
        dist.z.belt2 = dist.z.belt1 + belt.width + dist.z.belt_offset;
        dist.z.idler1 = dist.z.belt1 - idler.h_f;
        dist.z.idler2 = dist.z.belt2 - idler.h_f;
        dist.z.idler1_slot = dist.z.idler1 - Size.idler_support_h;
        dist.z.idler2_slot = dist.z.idler2 - Size.idler_support_h;
        dist.z.idler_slot_size = idler.h + Size.idler_support_h * 2;
        dist.z.rod_x1_rod_x2 = 18;
        dist.z.rod_x1 = 5 + Size.x.rod.r;
        dist.z.rod_x2 = dist.z.rod_x1 + dist.z.rod_x1_rod_x2;
        
    }

};


function getParameterDefinitions() {
    return [
        {name: 'version', caption: 'Version', type: 'text', initial: "0.0"},
        { 
            name: 'output', 
            caption: 'What to show :', 
            type: 'choice', 
            values: [0, 1, 2, 3, 4, 5, -1, 6, 7, 8, 9, 10, 11, 12], 
            initial: 0,
            captions: ["-----",                // 0
                       "All printer assembly", // 1
                       "Assembly, no walls",   // 2
                       "Gantry assembly",      // 3
                       "parts only",           // 4
                       "Walls and rods sizes", // 5
                       "-----",                // nope
                       "Motor mount",          // 6
                       "Idler mount",          // 7
                       "Carriage Y",           // 8
                       "Z top",                // 9
                       "Z bottom",             // 10
                       "Z slide",              // 11
                       "Carriage X",           // 12
                      ]
        },
        { name: 'fn', caption: 'output resolution (16, 24, 32)', type: 'int', initial: 8 },   
        
        { name: 'print_width', caption: 'Print width:', type: 'int', initial: 200 },
        { name: 'print_height', caption: 'Print height :', type: 'int', initial: 150 },
        { name: 'print_depth', caption: 'Print depth :', type: 'int', initial: 200 },
        {
            caption: 'Position (x,y,z):',
            name: '_position',
            type: 'text',
            initial: '20,0,0'
        },
        { name: 'box_wall', caption: 'Box wood thickness:', type: 'int', initial: 10 },
        { name: 'xy_rod_d', caption: 'X Y Rods diameter (6 or 8 ):', type: 'int', initial: 8},
        { name: 'z_rods_d', caption: 'Z Rods diameter (6,8,10,12):', type: 'int', initial: 8},
        {
            caption: 'Z threaded rods:',
            name: 'z_rods_option',
            type: 'choice',
            initial: 0,
            values:[0,1,2],
            captions: ["false", "true", "true-2sides"]
        },        
        {
            caption: 'Motor size',
            name: 'nema_size', 
            type: 'choice',
            values: ["nema14","nema17"],
            captions: ["nema14","nema17"],
            initial: "nema17"
        }
    ]; 
}


var draw_axis = 1;              // DEB.

// Nema 17 x 39 parameters.
// XXX TODO nema 14
var nema14 = {
    len: 28.0,              // Motor length [26,28,34]
    side_size: 35.3,        // Motor width
    body_chamfer: 5.0,      // Motor chamfer
    
    cap_len: 7.0,           // Motor cap length
    cap_thickness: 0.0,     // Motor cap thickness
    cap_chamfer: 2.5,       // Motor cap chamfer

    shaft_h: 18.0,              // Shaft length
    shaft_r: 2.5,               // Shaft radius

    ring_r: 22.0 / 2,       // Ring radius
    ring_h: 1.9,            // Ring height

    mount_dist: 26.0 / 2,      // Mounting hole offset
    mounting_holes_radius: 1.5, // Mounting hole radius
    mounting_holes_depth: 3.5,  // Mounting hole depth

    mesh: function () {
        return _nema ("base mount");
    }
};

// Nema 17 x 39 parameters.
var nema17 = {
    len: 39.0,                  // Motor length
    side_size: 42.2,            // Motor width
    body_chamfer: 5.0,          // Motor chamfer
    
    cap_len: 8.0,               // Motor cap length
    cap_thickness: 0.0,         // Motor cap thickness
    cap_chamfer: 2.5,           // Motor cap chamfer

    shaft_h: 22.0,              // Shaft length
    shaft_r: 2.5,               // Shaft radius

    ring_r: 22.0 / 2,           // Ring radius
    ring_h: 1.9,                // Ring height

    mount_dist: 31.04 / 2,      // Mounting hole offset
    mounting_holes_radius: 1.5, // Mounting hole radius
    mounting_holes_depth: 4.5,  // Mounting hole depth

    mesh: function () {
        return _nema ("base mount");
    }
};

function _nema(base) {
    var mesh = union (
        color ("DarkSlateGray",
               cube ({size: [nema.side_size, nema.side_size, nema.len]})),
        color ("gray",
               cylinder ({r: nema.ring_r, h: nema.ring_h, fn: FN})
               .translate ([nema.side_size / 2, nema.side_size / 2, nema.len])),
        color ("LightSlateGray",
               cylinder ({r: nema.shaft_r, h: nema.shaft_h, fn: FN}))
            .translate ([nema.side_size / 2, nema.side_size / 2, nema.len + nema.ring_h])
    );
    if (base && base == "base mount")
        mesh = mesh.translate ([-nema.side_size / 2, -nema.side_size / 2, -nema.len]);
    return mesh;
}


var Lm_uu = function (dim) {
    this.ri = dim.ri;
    this.ro = dim.ro;
    this.l = dim.l;
    this.mesh = function () {
        return difference (
            cylinder ({r: this.ro, h: this.l}),
            cylinder ({r: this.ri, h: this.l + 2}).translate ([0, 0, -1])
        ).setColor (0.5, 0.55, 0.55, 0.6);
    };
};

var lm6uu = new Lm_uu ({
    ri: 6 / 2,
    ro: 12 / 2,
    l: 19
});

var lm8uu = new Lm_uu ({
    ri: 8 / 2,
    ro: 15 / 2,
    l: 24.2
});

var lm10uu = new Lm_uu ({
    ri: 10 / 2,
    ro: 19 / 2,
    l: 29
});

var lm12uu = new Lm_uu ({
    ri: 12 / 2,
    ro: 21 / 2,
    l: 57
});


var nema_mount = {

    wall_trap_h: 20,            // height of wall inside support (trap height)
    thickness: 5,               // thickness of top wall support
    thickness_x: 9,             // thickness of X wall support

    rod_support_wall: 8,
    
};

nema_mount.mesh = function () {
    var nema_screw_offset = nema.side_size / 2 - nema.mount_dist;
    var height = this.thickness + this.wall_trap_h;
    var size_y = nema.side_size + this.rod_support_wall;

    return union (
        // base
        cube ([Size.rod_y_wall_dist, size_y, this.thickness + 2]),
        // wall support
        color ("red", cube ([this.thickness_x, size_y, this.wall_trap_h])),
        //top fix
        cube ([params.box_wall + this.thickness_x, size_y, this.thickness])
            .translate([-params.box_wall, 0, this.wall_trap_h]),
        // back fix
        cube ([this.thickness,
               size_y,
               this.wall_trap_h / 2  + this.thickness])
            .translate([-params.box_wall - this.thickness,
                        0,
                        this.wall_trap_h / 2])
        
    );
}




function main (parameters) {
    params = parameters;
    CSG.defaultResolution2D = params.fn;
    FN = params.fn;

    var mesh = [];

    if (params.nema_size == "nema14")
        nema = nema14;
    if (params.nema_size == "nema17")
        nema = nema14;

    switch (+params.output) {
    case 0:                 // Test output
        mesh.push (nema17.mesh ());
        mesh.push (nema_mount.mesh ());
        break;
    default:
        mesh.push (cube ([10,10,20]));
        break;
    }
    
    if (draw_axis) {
        var thickness = 0.2;
        var axis = union (
            color ("red", cube ([10, thickness, thickness])),
            color ("green", cube ([thickness, 10, thickness])),
            color ("blue", cube ([thickness, thickness, 10]))
        );

        mesh.push (axis.translate ([-100, -100, 0]));
    }

    return mesh;
}
