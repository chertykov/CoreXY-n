// -*- mode: js; electric-indent-mode: t; indent-tabs-mode: nil -*-

var params;                        // parameter definitions.
var FN;                            // global resolution
var nema;                          // nema object. 14 or 17
var idler;                         // idler object (initialized in main)

// TODO remove all this vars.
var _rod_x_length = 300; // will be calculated in main from parameters.
var _rod_y_length = 300; // will be calculated in main from parameters.
var _rod_z_length = 300; // will be calculated in main from parameters.


function getParameterDefinitions() {
    return [
        {name: 'version', caption: 'Version', type: 'text', initial: "0.0"},
        { 
            name: 'output', 
            caption: 'What to show :', 
            type: 'choice', 
            values: [0, 1, 2, 3, 4, 5, -1, 6, 7, 8, 9, 10, 11, 12], 
            initial: 3,
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
        {
            name: 'debug',
            caption: 'Look inside (debug)',
            type: 'choice',
            values: [0, 1],
            initial: 1,
            captions: ["No", "Yes"]
        },
        {
            name: 'fn',
            caption: 'output resolution (16, 24, 32)',
            type: 'int',
            initial: 8
        },
        {
            name: 'area',
            caption: 'Print area (x,y,z):',
            type: 'text',
            initial: '200,200,150'
        },
        {
            name: 'position',
            caption: 'Position (x,y,z):',
            type: 'text',
            initial: '20,0,0'
        },
        {
            name: 'box_wall',
            caption: 'Box wood thickness:',
            type: 'int',
            initial: 10
        },        
        {
            name: 'idler',
            caption: 'Idler bearing',
            type: 'choice',
            values: ["3x10x4", "4x10x4", "5x10x4", "608"],
            initial: "5x10x4",
            captions: ["3x10x4", "4x10x4", "5x10x4", "608"]
        },
        {
            name: 'xy_rods_d',
            caption: 'X Y Rods diameter (6 or 8 ):',
            type: 'int',
            initial: 8
        },
        {
            name: 'z_rods_d',
            caption: 'Z Rods diameter (6,8,10,12):',
            type: 'int',
            initial: 8
        },
        {
            name: 'z_rods_option',
            caption: 'Z threaded rods:',
            type: 'choice',
            initial: 0,
            values:[0,1,2],
            captions: ["false", "true", "true-2sides"]
        },        
        {
            name: 'nema_size', 
            caption: 'Motor size',
            type: 'choice',
            values: ["nema14","nema17"],
            captions: ["nema14","nema17"],
            initial: "nema17"
        }
    ]; 
}


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
        r: 4.4 / 2.0,            // M4 screw hole radius
        screw_r: 4.1 / 2.0,      // Screw without nut. Tight. Self tap.
        washer_h: 0.8,           //
        washer_r_o: 9.4 / 2,
        head_r: 7.3 / 2,         //  max 7.22 min 6.78
        head_h: 4
    },
    m5: {
        wall: 3,                // plastic wall for m3 screw support
        r: 5.3 / 2.0,           // M5 screw hole radius
        screw_r: 5 / 2.0,       // Screw without nut. Tight. Self tap.
        washer_h: 1,            //
        washer_r_o: 10 / 2,
        head_r: 8.72 / 2,       // max 8.72 min 8.28
        head_h: 5
    },
    rod_wall: 3,
    rod_x: {},
    rod_y: {},
    rod_z: {},
    lmuu_x: {},
    lmuu_y: {},
    lmuu_z: {},

    rod_x_base_dy: 30,          // Base distance between two X rods.
    // Belts 
    belt1_dz: 4, // belt height above gantry base (motor mount surface).

    idler_support_h: 0.4,       // Height of builtin washer
    lmuu_fix_plate: 6,          // Width of LM_UU fix plate for M3 screws.

    calc: function () {
        this.rod_x_d = params.xy_rods_d;
        this.rod_x_r = params.xy_rods_d / 2;
        this.rod_x_l = _rod_x_length;

        this.rod_y_d = params.xy_rods_d;
        this.rod_y_r = params.xy_rods_d / 2;
        this.rod_y_l = _rod_y_length;

        this.rod_z_d = params.z_rods_d;
        this.rod_z_r = params.z_rods_d / 2;
        this.rod_z_l = _rod_z_length;

        
        if (params.xy_rods_d == 6) {
            this.lmuu_x = lm6uu;
            this.lmuu_y = lm6uu;
        }
        if (params.xy_rods_d == 8) {
            this.lmuu_x = lm8uu;
            this.lmuu_y = lm8uu;
        }
        if (params.xy_rods_d == 10) {
            this.lmuu_x = lm10uu;
            this.lmuu_y = lm10uu;
        }
        
        if (params.z_rods_d == 6) this.lmuu_z = lm6uu;
        if (params.z_rods_d == 8) this.lmuu_z = lm8uu;
        if (params.z_rods_d == 10) this.lmuu_z = lm10uu;
        if (params.z_rods_d == 12) this.lmuu_z = lm12uu;

        // Distances calculation
        // X distances

        // X distance from wall to Y rod axis
        this.rod_y_wall_dx = 2 + this.lmuu_y.ro;
        this.wall_belt_outer_dx = nema.side_size / 2 + gt2_pulley.belt_ro;
        this.wall_belt_inner_dx = this.wall_belt_outer_dx - belt.thickness;
        this.rod_y_car_idler_dx = this.wall_belt_outer_dx + idler.r_w - this.rod_y_wall_dx;
        

        // Z distance from base (motor mount surface).
        this.belt2_dz = this.belt1_dz + belt.width + idler.belt_offset;
        this.rod_x_dz = this.belt1_dz - 1 - Size.rod_x_r;
        this.rod_y_dz = this.rod_x_dz - Size.rod_x_r - Size.lmuu_y.ro;
        
        this.idler1_dz = this.belt1_dz - idler.h_f;
        this.idler2_dz = this.belt2_dz - idler.h_f;

        this.idler1_slot_dz = this.idler1_dz - Size.idler_support_h;
        this.idler2_slot_dz = this.idler2_dz - Size.idler_support_h;
        this.idler_slot_size_dz = idler.h + Size.idler_support_h + idler.shaft.washer_h;

        // Calculate printer size inside box.
        // TODO need precise calculation.
        this.size_x = params.area_x + 3 * nema.side_size;
        this.size_y = params.area_y + 3 * nema.side_size;
        this.size_z = params.area_z + 4 * nema.side_size;
    }
};


var belt = {
    width: 6,
    thickness: 1.5,
    pitch: 2,

    mesh: function (len, round) {
        var mesh = cube ([len, this.thickness, this.width]);
        if (round == "back")
            mesh = mesh.translate ([0, -this.thickness, 0]);
        return color ([0.2, 0.2, 0.2], mesh);
    }
};

var idler3 = new Idler (3, 10, 8, 11.5, 1, 6); // Two 3x10x4 mm flanged bearings
var idler4 = new Idler (4, 10, 8, 11.65, 0.85, 7); // Two 4x10x4 mm flanged bearings
var idler5 = new Idler (5, 10, 8, 11.65, 0.85, 8); // Two 5x10x4 mm flanged bearings
var idler8 = new Idler (8, 22, 7, 22, 0.5, 10);     // One 608 bearing

function Idler (d_i, d_w, h, d_f, h_f, d_s) {
    this.r_i = d_i / 2;         // bore D
    this.r_w = d_w / 2;         // working D
    this.h = h;                 // full height
    this.r_f = d_f / 2;         // flange D
    this.h_f = h_f;             // flange height
    this.r_s = d_s / 2;         // Support (builtin waser) D

    if (d_i == 3) {
        this.shaft = Size.m3;
        this.belt_offset = this.shaft.washer_h + h_f * 2;
    }
    if (d_i == 4) {
        this.shaft = Size.m4;
        this.belt_offset = this.shaft.washer_h + h_f * 2;
    }
    if (d_i == 5) {
        this.shaft = Size.m5;
        this.belt_offset = this.shaft.washer_h + h_f * 2;
    }
    
    if (d_i == 8) {
        this.shaft = Size.m8;
        this.belt_offset = 4;   // TODO correct plastic washer height.
    }

    this.mesh = function () {
        var mesh = difference (
            union (
                cylinder ({r: this.r_f, h: this.h_f, fn: FN}),
                cylinder ({r: this.r_w, h: this.h, fn: FN}),
                cylinder ({r: this.r_f, h: this.h_f, fn: FN})
                    .translate ([0, 0, this.h - this.h_f])
            ),
            cylinder ({r: this.r_i, h: this.h + 2, fn: FN})
                .translate ([0, 0, -1])
        );
        return color ([0.7, 0.7, 0.7], mesh);
    };
}


function Gt2_Pulley_16 () {
    this.ri = 5.0 / 2;
    this.ro = 9.8 / 2;
    this.belt_ro = 11.2 / 2.0;
    this.h_base = 6;
    this.h_work = 7;
    this.h_flange = 1;
    this.h = 6 + 7 + 1;
    
    this.mesh = function (base) {
        var mesh =
            difference (
                union (
                    cylinder ({r: 13 / 2, h: this.h_base}),
                    cylinder ({r: this.ro, h: this.h}),
                    cylinder ({r: 13 / 2, h: this.h_flange})
                        .translate ([0, 0, this.h - this.h_flange])
                ),
                cylinder ({r: this.ri, h: this.h + 2})
                    .translate ([0, 0, -1])
            );

        // Look inside
        if (params.debug)
            mesh = mesh.subtract (cube ([40, 40, 40]).rotateZ (180));
        
        if (base == "belt")
            mesh = mesh.translate ([0, 0, -this.h_base]);
        
        return mesh.setColor ([0.85, 0.85, 0.85]);
    };
}

// TODO Gt2 20 tooths.
var gt2_pulley = new Gt2_Pulley_16 ();

// Nema 17 x 39 parameters.
// XXX TODO nema 14
var nema14 = {
    len: 28.0,              // Motor length [26,28,34]
    side_size: 35.3,        // Motor width
    half_size: 35.3 / 2,    // Motor width
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
        return stepper (this);
    }
};

// Nema 17 x 39 parameters.
var nema17 = {
    len: 39.0,                  // Motor length
    side_size: 42.2,            // Motor width
    half_size: 42.2 / 2,        // Motor width
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
        return stepper (this);
    }
};


// Nema 17 stepper motor.
function stepper (nema)
{
    var length = nema.len / 2;
    var width = nema.side_size / 2;
    var z = width;
    var ch = sqrt (2.0) * width - sqrt (0.5) * nema.body_chamfer;
    var ch2 = sqrt (2.0) * width - sqrt (0.5) * nema.cap_chamfer;
    var depth = nema.mounting_holes_depth;
    var offset = nema.mount_dist;

    var cube = new CSG.roundedCube ({
        center: [0, 0, 0],
        radius: [length - nema.cap_len,
                 width - nema.cap_thickness,
                 width - nema.cap_thickness],
        roundradius: 0.2,
        resolution: 16
    });
    cube = cube.setColor (0.67843137254901960784313725490196,
                          0.70588235294117647058823529411765,
                          0.70588235294117647058823529411765);
    var xcube = new CSG.cube ({
        center: [0, 0, 0],
        radius: [length, ch, ch]
    });
    xcube = xcube.setColor (0.67843137254901960784313725490196,
                            0.70588235294117647058823529411765,
                            0.70588235294117647058823529411765);
    cube = cube.intersect (xcube.rotateX(45));

    var cube2 = new CSG.roundedCube ({
        center: [length - (nema.cap_len / 2.0), 0, 0],
        radius: [(nema.cap_len / 2.0), width, width],
        roundradius: 0.2,
        resolution: 16
    });
    cube2 = cube2.setColor (0.87058823529411764705882352941176,
                            0.89803921568627450980392156862745,
                            0.90588235294117647058823529411765);
    var cube3 = cube2.translate([-(nema.len - nema.cap_len), 0, 0]);
    xcube = new CSG.cube ({
        center: [0, 0, 0],
        radius: [length, ch2, ch2]
    });
    xcube = xcube.setColor (0.87058823529411764705882352941176,
                            0.89803921568627450980392156862745,
                            0.90588235294117647058823529411765);
    xcube = xcube.rotateX(45);
    cube2 = cube2.intersect (xcube);
    cube3 = cube3.intersect (xcube);

    var ring = new CSG.cylinder ({
        start: [length, 0, 0],
        end: [length + nema.ring_h, 0, 0],
        radius: nema.ring_r,
        resolution: FN
    });
    ring = ring.setColor (0.81176470588235294117647058823529,
                          0.84313725490196078431372549019608,
                          0.85098039215686274509803921568627);

    var shaft = new CSG.cylinder ({
        start: [length + nema.ring_h, 0, 0],
        end: [length + nema.ring_h + nema.shaft_h, 0, 0],
        radius: nema.shaft_r,
        resolution: FN
    });
    shaft = shaft.setColor (0.9, 0.91, 0.91);
    var motor = cube.union ([cube2, cube3, ring, shaft]);  

    var mountinghole = new CSG.cylinder ({
        start: [-depth, 0, 0],
        end: [0, 0, 0],
        radius: nema.mounting_holes_radius,
        resolution: FN
    });
    mountinghole = mountinghole.setColor (0.2,0.2,0.2);
    motor = motor.subtract (mountinghole.translate ([length, offset, offset]));
    motor = motor.subtract (mountinghole.translate ([length, offset, -offset]));
    motor = motor.subtract (mountinghole.translate ([length, -offset, offset]));
    motor = motor.subtract (mountinghole.translate ([length, -offset, -offset]));

    return motor.rotateY (-90).translate ([0, 0, -length]);
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
        cube ([Size.rod_y_wall_dx, size_y, this.thickness + 2]),
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
};


function gantry_mesh () {
    var half_x = Size.size_x / 2;
    var half_y = Size.size_y / 2;

    var bounds = union (cube ([1, 1, 100]).translate ([half_x, half_y, -20]),
                        cube ([1, 1, 100]).translate ([-half_x, half_y, -20]),
                        cube ([1, 1, 100]).translate ([half_x, -half_y, -20]),
                        cube ([1, 1, 100]).translate ([-half_x, -half_y, -20]));
    bounds = color ("red", bounds);
    
    var motor1 = nema.mesh ()
        .translate ([-half_x + nema.half_size, -half_y + nema.half_size, 0]);
    var motor2 = nema.mesh ()
        .translate ([half_x - nema.half_size, -half_y + nema.half_size, 0]);

    var rod_y1 = cylinder ({r: Size.rod_y_r, h: Size.rod_y_l, fn: FN})
        .rotateX (-90)
        .translate ([-half_x + Size.rod_y_wall_dx, -half_y + nema.side_size, Size.rod_y_dz]);
    rod_y1 = color ("gray", rod_y1);

    var rod_y2 = rod_y1.mirroredX();
    
    return union (bounds,
                  motor1,
                  motor2,
                  rod_y1, rod_y2);
}


// Convert comma separated numbers to array.
// It's used for parsing X,Y,Z parameters.

function read_nums (s) {
    // Split it up into numbers and spaces
    var array = s.split(/(\d+)/);

    // Keep just the numbers
    array = array.filter(function(i) {return "" + +i == i;});

    // Convert back to a number
    array = array.map(function(i) {return +i;});
    return array; 
}

function main (parameters) {
    params = parameters;

    // Convert parameters to numbers
    params.fn = +params.fn;
    params.box_wall = +params.box_wall;
    params.xy_rods_d = +params.xy_rods_d;
    params.z_rods_d = +params.z_rods_d;
    // Parse head position.
    var pos = read_nums (params.position);
    if (pos.length > 0) params.pos_x = pos[0];
    if (pos.length > 1) params.pos_y = pos[1];
    if (pos.length > 2) params.pos_z = pos[2];
    // Parse printable area.
    var area = read_nums (params.area);
    if (area.length > 0) params.area_x = area[0];
    if (area.length > 1) params.area_y = area[1];
    if (area.length > 2) params.area_z = area[2];
    // Parse Idler
    if (params.idler == "3x10x4") idler = idler3;
    if (params.idler == "4x10x4") idler = idler4;
    if (params.idler == "5x10x4") idler = idler5;
    if (params.idler == "608") idler = idler8;
    
    CSG.defaultResolution2D = params.fn;
    FN = params.fn;

    var mesh = [];

    if (params.nema_size == "nema14")
        nema = nema14;
    if (params.nema_size == "nema17")
        nema = nema17;

    // Calculate all printer dimensions.
    Size.calc ();
    
    switch (+params.output) {
    case 0:                 // Test output
        if (params.debug)
            mesh.push (nema.mesh ()
                       .translate([nema.half_size, nema.half_size, 0]));
        mesh.push (nema_mount.mesh ());
        break;
    case 3:                     // Gantry assembly
        mesh.push (gantry_mesh ());
        break;
    default:
        mesh.push (idler.mesh ());
        break;
    }

    // Draw axis.
    if (params.debug) {
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