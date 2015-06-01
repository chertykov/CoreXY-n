// -*- mode: js; electric-indent-mode: t; indent-tabs-mode: nil -*-

var params;                        // parameter definitions.
var FN;                            // global resolution
var nema;                          // nema object. 14 or 17
var idler;                         // idler object (initialized in main)
// Linear bearing objects.
var lmuu_x;
var lmuu_y;
var lmuu_z;
// Smooth rods.
var rod_x = {};
var rod_y = {};
var rod_z = {};
// GT2 belt
var belt;
// GT2 pulley
var gt2_pulley;

// Plastic parts

// Motor mount
var nema_mount;
// Idlers
var idler_mount;
// X carriage
var carriage_x;
// Y carriage
var carriage_y;


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
                       "Carriage X"            // 12
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

    rod_wall: 3,                // wall thickness around rods

    rod_x_base_dy: 30,          // Base distance between two X rods.
    // Belts
    motor_mount_base_h: 4,      // height of base above stepper mount surface.

    idler_support_h: 0.4,       // Height of builtin washer
    lmuu_fix_plate: 6,          // Width of LM_UU fix plate for M3 screws.

    calc: function () {
        rod_x.d = params.xy_rods_d;
        rod_x.r = params.xy_rods_d / 2;
        rod_x.l = _rod_x_length;

        rod_y.d = params.xy_rods_d;
        rod_y.r = params.xy_rods_d / 2;
        rod_y.l = _rod_y_length;

        rod_z.d = params.z_rods_d;
        rod_z.r = params.z_rods_d / 2;
        rod_z.l = _rod_z_length;

        var lm6uu = new Lm_uu ({ri: 6 / 2, ro: 12 / 2, l: 19});
        var lm8uu = new Lm_uu ({ri: 8 / 2, ro: 15 / 2, l: 24.2});
        var lm10uu = new Lm_uu ({ri: 10 / 2, ro: 19 / 2, l: 29});
        var lm12uu = new Lm_uu ({ri: 12 / 2, ro: 21 / 2, l: 57});

        
        if (params.xy_rods_d == 6) {
            lmuu_x = lm6uu;
            lmuu_y = lm6uu;
        }
        if (params.xy_rods_d == 8) {
            lmuu_x = lm8uu;
            lmuu_y = lm8uu;
        }
        if (params.xy_rods_d == 10) {
            lmuu_x = lm10uu;
            lmuu_y = lm10uu;
        }
        
        if (params.z_rods_d == 6) lmuu_z = lm6uu;
        if (params.z_rods_d == 8) lmuu_z = lm8uu;
        if (params.z_rods_d == 10) lmuu_z = lm10uu;
        if (params.z_rods_d == 12) lmuu_z = lm12uu;

        // Distances calculation

        // X distances

        // X distance from wall to Y rod axis
        this.rod_y_wall_dx = 5 + lmuu_y.ro;
        
        this.wall_belt_outer_dx = nema.side_size / 2 + gt2_pulley.belt_ro;
        this.wall_belt_inner_dx = this.wall_belt_outer_dx - belt.thickness;
        this.rod_y_car_idler_dx = this.wall_belt_outer_dx + idler.r_w -
            this.rod_y_wall_dx;
        

        // Z distances from base (motor mount surface).
        // belt height above gantry base (motor mount surface).
        this.belt1_dz = this.motor_mount_base_h + 1;
        this.belt2_dz = this.belt1_dz + belt.width + idler.belt_offset;
        this.rod_x_dz = this.belt1_dz - 1 - rod_x.r;
        this.rod_y_dz = this.rod_x_dz - rod_x.r - lmuu_y.ro;
        
        this.idler1_dz = this.belt1_dz - idler.h_f;
        this.idler2_dz = this.belt2_dz - idler.h_f;

        this.idler1_slot_dz = this.idler1_dz - idler.shaft.washer_h;
        this.idler2_slot_dz = this.idler2_dz - idler.shaft.washer_h;
        this.idler_slot_size_dz = idler.h + Size.idler_support_h +
            idler.shaft.washer_h;

        // Calculate printer size inside box.
        // TODO need precise calculation.
        this.size_x = params.area_x + 3 * nema.side_size;
        this.size_y = params.area_y + 3 * nema.side_size;
        this.size_z = params.area_z + 4 * nema.side_size;
    }
};


function Belt () {
    this.width = 6;
    this.thickness = 1.5;
    this.pitch = 2;

    this.mesh = function (len, round) {
        var mesh = cube ([len, this.thickness, this.width]);
        if (round == "back")
            mesh = mesh.translate ([0, -this.thickness, 0]);
        return color ([0.2, 0.2, 0.2], mesh);
    };
}

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
                    cylinder ({r: 13 / 2, h: this.h_base, fn: FN}),
                    cylinder ({r: this.ro, h: this.h, fn: FN}),
                    cylinder ({r: 13 / 2, h: this.h_flange, fn: FN})
                        .up (this.h - this.h_flange)
                ),
                cylinder ({r: this.ri, h: this.h + 2, fn: FN})
                    .down (1)
            );

        // Look inside
        if (params.debug)
            mesh = mesh.subtract (cube ([40, 40, 40]).rotateZ (180));
        
        if (base == "belt")
            mesh = mesh.down (this.h_base);
        
        return color ("SlateGray", mesh);
    };
}

// Nema 17 x 39 parameters.
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
    var width = nema.half_size;
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
    motor = motor.subtract ([
        mountinghole.translate ([length, offset, offset]),
        mountinghole.translate ([length, offset, -offset]),
        mountinghole.translate ([length, -offset, offset]),
        mountinghole.translate ([length, -offset, -offset])
    ]);

    return motor.rotateY (-90).translate ([0, 0, -length]);
}


function Lm_uu (dim) {
    this.ri = dim.ri;
    this.ro = dim.ro;
    this.l = dim.l;
    
    this.mesh = function () {
        return difference (
            cylinder ({r: this.ro, h: this.l, fn: FN}),
            cylinder ({r: this.ri, h: this.l + 2, fn: FN})
                .translate ([0, 0, -1])
        ).setColor (0.5, 0.55, 0.55, 0.6);
    };
}

function Idler_mount () {
    this.wall_idler_dy = idler.r_w + belt.thickness + 5;
    this.wall_idler1_dx = (2 + nema_mount.thickness_x + idler.r_w +
                           belt.thickness);
    this.wall_idler2_dx = nema.half_size + idler.r_w * 2 + belt.thickness;
    this.idler_ear_h = 5;
    this.idler_ear_r = idler.shaft.head_r + Size.rod_wall;
}

Idler_mount.prototype.mesh = function () {
        var height = nema_mount.thickness + nema_mount.wall_trap_h;
        var c_dx = this.wall_idler2_dx + params.box_wall +
            nema_mount.thickness + idler.shaft.head_r + Size.rod_wall;
        var c_dy = this.wall_idler_dy + params.box_wall + nema_mount.thickness;
        var mesh = union (
            cube ([c_dx, c_dy, height])
                .left (params.box_wall + nema_mount.thickness)
                .back (this.wall_idler_dy),
            cylinder ({r: this.idler_ear_r,
                       h: height, fn: FN})
                .translate ([this.wall_idler1_dx,
                             -this.wall_idler_dy,
                             0]),
            cylinder ({r: this.idler_ear_r,
                       h: height, fn: FN})
                .translate ([this.wall_idler2_dx,
                             -this.wall_idler_dy,
                             0]),
            cube ([abs (this.wall_idler2_dx - this.wall_idler1_dx),
                   this.idler_ear_r,
                   height])
                .translate ([this.wall_idler1_dx,
                            -this.wall_idler_dy - this.idler_ear_r,
                            0])
        );

    var slot = cube ({size: [this.idler_ear_r * 2,
                             this.idler_ear_r * 2,
                             Size.idler_slot_size_dz],
                      center: [1, 0, 0]
                     })
        .mirroredY ();

    var slot1 = cylinder ({r: idler.r_f + 1,
                           h: Size.idler_slot_size_dz,
                           fn: FN});
    var screw_head = cylinder ({r: idler.shaft.head_r,
                                h: idler.shaft.head_h + 1,
                                fn: FN})
        .up (height - idler.shaft.head_h);

    mesh = mesh.subtract ([
        slot.translate ([this.wall_idler1_dx,
                         -this.wall_idler_dy,
                         Size.idler1_slot_dz]),
        slot.translate ([this.wall_idler2_dx,
                         -this.wall_idler_dy,
                         Size.idler2_slot_dz]),
        slot1.translate ([this.wall_idler1_dx,
                          -this.wall_idler_dy,
                          Size.idler1_slot_dz]),
        slot1.translate ([this.wall_idler2_dx,
                          -this.wall_idler_dy,
                          Size.idler2_slot_dz]),
        screw_head.translate ([this.wall_idler2_dx,
                               -this.wall_idler_dy,
                               0]),
        screw_head.translate ([this.wall_idler2_dx,
                               -this.wall_idler_dy,
                               0]),
        screw_head.mirroredX ().translate ([this.wall_idler1_dx,
                               -this.wall_idler_dy,
                               0])
    ]);

        return mesh;
};

function Nema_mount () {
    // height of wall inside support (trap height)
    this.wall_trap_h = 20;
    // thickness of top wall support
    this.thickness = 5;
    // thickness of X wall support
    this.thickness_x = (nema.half_size - nema.mount_dist) * 2;
    // thickness of Y rod support.
    this.rod_support_dy = 8;
    // groove for internal corners.
    this.groove_d = 0.6;
}

Nema_mount.prototype.mesh = function () {
    var nema_screw_offset = nema.side_size / 2 - nema.mount_dist;
    var height = this.thickness + this.wall_trap_h;
    var size_y = nema.side_size + this.rod_support_dy;
    var rod_support_r = rod_y.r + Size.rod_wall;

    var mesh = union (
        // base
        cube ([Size.rod_y_wall_dx + rod_support_r,
               size_y,
               Size.motor_mount_base_h]),
        // wall support
        cube ([this.thickness_x, size_y, this.wall_trap_h]),
        //top fix
        cube ([params.box_wall + this.thickness_x, size_y, this.thickness])
            .translate([-params.box_wall, 0, this.wall_trap_h]),
        // back fix
        cube ([this.thickness,
               size_y,
               this.wall_trap_h / 2  + this.thickness])
            .translate([-params.box_wall - this.thickness,
                        0,
                        this.wall_trap_h / 2]),
        cylinder ({r: rod_support_r, h: this.rod_support_dy, fn: FN})
            .rotateX (-90)
            .translate ([Size.rod_y_wall_dx, nema.side_size, Size.rod_y_dz]),
        difference (
            cube ([Size.rod_y_wall_dx + rod_support_r,
                   this.rod_support_dy,
                   abs (Size.rod_y_dz) + rod_support_r]),
            cube ([rod_support_r, this.rod_support_dy, rod_support_r])
                .translate ([Size.rod_y_wall_dx, 0, 0])
        )
            .translate ([0, nema.side_size, Size.rod_y_dz - rod_support_r])
    );
    mesh = difference (
        mesh,
        // round
        roundBoolean2(this.thickness, size_y, "br")
            .translate([-params.box_wall - this.thickness, 0, this.wall_trap_h]),
        // holes to fix on the wood side
        // wood screw holes
        cylinder({r: Size.m4.screw_r, h: 20, fn: 8})
            .rotateX(-90)
            .rotateZ(90)
            .translate([-params.box_wall, 7, this.wall_trap_h - 5]),
        cylinder ({r: Size.m4.screw_r, h: 20, fn: 8})
            .rotateX(-90)
            .rotateZ(90)
            .translate([-params.box_wall, size_y - 7, this.wall_trap_h - 5]),
        // Corner grooves
        cylinder ({d: this.groove_d, h: size_y + 2, fn: 8})
            .rotateX(-90)
            .translate ([-0.2, -1, this.wall_trap_h - 0.2]),
        cylinder ({d: this.groove_d, h: size_y + 2, fn: 8})
            .rotateX(-90)
            .translate ([-params.box_wall + 0.2, -1, this.wall_trap_h - 0.2]),
        // Screw head traps.
        cylinder ({r: Size.m3.head_r, h: 10, fn: FN})
            .translate ([nema_screw_offset,
                         nema_screw_offset,
                         height - Size.m3.head_h]),
        cylinder ({r: Size.m3.head_r, h: 10, fn: FN})
            .translate ([nema_screw_offset,
                         nema.side_size - nema_screw_offset,
                         height - Size.m3.head_h]),
        // Screw holes.
        cylinder ({r: Size.m3.r, h: height, fn: FN})
            .translate ([nema_screw_offset,
                         nema_screw_offset,
                         0]),
        cylinder ({r: Size.m3.r, h: height, fn: FN})
            .translate ([nema_screw_offset,
                         nema.side_size - nema_screw_offset,
                         0]),
        // Motor ring.
        cylinder ({r: nema.ring_r+0.5, h: height, fn: FN})
            .translate ([nema.half_size, nema.half_size, 0]),
        // Y rod hole.
        cylinder ({r: rod_y.r + Size.clr.tight, h: rod_y.l, fn: FN})
            .rotateX (-90)
            .translate ([Size.rod_y_wall_dx,
                         0,
                         Size.rod_y_dz]),
        // Y rod hole bevel.
        cylinder ({r1: rod_y.r, r2: rod_y.r + 1, h: 1, fn: FN})
            .rotateX (-90)
            .translate ([Size.rod_y_wall_dx,
                         size_y - 0.5,
                         Size.rod_y_dz])
    );
    return mesh;
};


// Core XY gantry.
function gantry_mesh () {
    var half_x = Size.size_x / 2;
    var half_y = Size.size_y / 2;
    var motor_dx = half_x - nema.half_size;
    var motor_dy  = -half_y + nema.half_size;

    var bounds = union (cube ([1, 1, 100]).translate ([half_x, half_y, -20]),
                        cube ([1, 1, 100]).translate ([-half_x, half_y, -20]),
                        cube ([1, 1, 100]).translate ([half_x, -half_y, -20]),
                        cube ([1, 1, 100]).translate ([-half_x, -half_y, -20]));
    bounds = color ("red", bounds);
    // Motors
    var motor1 = union (
        nema.mesh (),
        gt2_pulley.mesh ("belt")
            .translate ([0, 0, Size.belt1_dz])
    )
        .translate ([-motor_dx, motor_dy, 0]);

    
    var motor2 = union (
        nema.mesh (),
        gt2_pulley.mesh ("belt")
            .translate ([0, 0, Size.belt2_dz])
    )
        .translate ([motor_dx, motor_dy, 0]);

    // Y rods
    var rod_y1 = cylinder ({r: rod_y.r, h: rod_y.l, fn: FN})
        .rotateX (-90)
        .translate ([-half_x + Size.rod_y_wall_dx,
                     -half_y + nema.side_size,
                     Size.rod_y_dz]);
    rod_y1 = color ("gray", rod_y1);

    var rod_y2 = rod_y1.mirroredX();
    // X rods
    var head_dy = 20;           // TODO head offset Y from rod_x1

    var rod_x1_pos = function (param_y) {
        return (param_y - half_y + nema.side_size + nema_mount.rod_support_dy +
                head_dy);
    };

    var rod_x1 = color ("gray",
                        cylinder ({r: rod_x.r, h: rod_x.l, fn: FN}));
    rod_x1 = rod_x1.rotateY (90).translate ([-half_x + Size.rod_y_wall_dx,
                                             rod_x1_pos (params.pos_y),
                                             Size.rod_x_dz]);
    var rod_x2 = rod_x1.translate ([0, Size.rod_x_base_dy, 0]);

    // Y rods LM_UU
    var lmuu1_dy = rod_x1_pos (params.pos_y) - lmuu_x.l / 2;
    var lmuu1 = lmuu_y.mesh ()
        .rotateX (-90)
        .translate ([-half_x + Size.rod_y_wall_dx,
                     lmuu1_dy,
                     Size.rod_y_dz]);
    var lmuu2 = lmuu1.translate ([0, lmuu_x.l + 0.2, 0]);

    var lmuu3 = lmuu1.mirroredX ();
    var lmuu4 = lmuu2.mirroredX ();

    // Motor mounts.
    var motor_mount1 = nema_mount.mesh ()
        .translate ([-half_x, -half_y, 0]);

    var motor_mount2 = motor_mount1.mirroredX ();

    // Idler mounts
    var idler_mount1 = idler_mount.mesh ()
        .translate ([-half_x, half_y, 0]);

    // Belts
    // From motor to X carriage idler.
    var belt1_len = abs (motor_dy - rod_x1_pos (params.pos_y)) + Size.rod_x_base_dy / 2;
    
    var belt1 = belt.mesh (belt1_len, "")
        .rotateZ (90)
        .translate ([-motor_dx + gt2_pulley.belt_ro, motor_dy, Size.belt1_dz]);

    // From motor to corner idler. TODO this belt not parallel to wall.
    var belt2_len = Size.size_y - idler_mount.wall_idler_dy - nema.half_size;
    var belt2 = belt.mesh (belt2_len, "back")
        .rotateZ (90)
        .translate ([-motor_dx - gt2_pulley.belt_ro, motor_dy, Size.belt1_dz]);
    
    return union (bounds,
                  motor1,
                  motor2,
                  rod_y1, rod_y2,
                  rod_x1, rod_x2,
                  lmuu1, lmuu2, lmuu3, lmuu4,
                  motor_mount1, motor_mount2,
                  idler_mount1,
                  belt1, belt2);
}


function roundBoolean2 (diam, length, edge) {
    var tr = [0, 0, 0];
    
    switch (edge) {
    case "bl":
        break;

    case "tl":
        tr = [0, 0, diam];
        break;
        
    case "br":
        tr = [diam, 0, 0];
        break;
        
    case "tr":
        tr = [diam, 0, diam];
        break;

    }

    return difference (
        cube ([diam, length, diam]),
        cylinder ({r: diam, h: length, fn: FN})
            .rotateX(-90)
            .translate (tr)
    );
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

function extend_CSG () {

    CSG.prototype.up = function (n) {
        return this.translate ([0, 0, n]);
    };

    CSG.prototype.down = function (n) {
        return this.translate ([0, 0, -n]);
    };

    CSG.prototype.left = function (n) {
        return this.translate ([-n, 0, 0]);
    };

    CSG.prototype.right = function (n) {
        return this.translate ([n, 0, 0]);
    };

    CSG.prototype.left = function (n) {
        return this.translate ([-n, 0, 0]);
    };

    CSG.prototype.right = function (n) {
        return this.translate ([n, 0, 0]);
    };

    CSG.prototype.back = function (n) {
        return this.translate ([0, -n, 0]);
    };

    CSG.prototype.forward = function (n) {
        return this.translate ([0, n, 0]);
    };
}

function main (parameters) {
    params = parameters;

    // Convert parameters to numbers
    params.fn = +params.fn;
    params.box_wall = +params.box_wall;
    params.xy_rods_d = +params.xy_rods_d;
    params.z_rods_d = +params.z_rods_d;
    params.debug = +params.debug;

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
    if (params.idler == "3x10x4")
        idler = new Idler (3, 10, 8, 11.5, 1, 6); // Two 3x10x4 mm flanged bearings
    if (params.idler == "4x10x4")
        idler = new Idler (4, 10, 8, 11.65, 0.85, 7); // Two 4x10x4 mm flanged bearings
    if (params.idler == "5x10x4")
        idler = new Idler (5, 10, 8, 11.65, 0.85, 8); // Two 5x10x4 mm flanged bearings
    if (params.idler == "608")
        idler = new Idler (8, 22, 7, 22, 0.5, 10); // One 608 bearing
    
    CSG.defaultResolution2D = params.fn;
    FN = params.fn;

    extend_CSG ();

    var mesh = [];

    if (params.nema_size == "nema14")
        nema = nema14;
    if (params.nema_size == "nema17")
        nema = nema17;

    // Primitive objects
    belt = new Belt ();
    // TODO Gt2 20 tooths.
    gt2_pulley = new Gt2_Pulley_16 ();
    
    // Calculate all printer dimensions.
    Size.calc ();
    
    nema_mount = new Nema_mount ();
    idler_mount = new Idler_mount ();
    
    switch (+params.output) {
    case 6:                 // Test output
        if (params.debug) 
            mesh.push (
                union (
                    nema.mesh (),
                    gt2_pulley.mesh ("belt")
                        .translate ([0, 0, Size.belt2_dz])
                )
                    .translate([nema.half_size, nema.half_size, 0])
            );
        mesh.push (nema_mount.mesh ());
        break;
    case 3:                     // Gantry assembly
        mesh.push (gantry_mesh ());
        break;
    case 7:                     // Idler mount
        mesh.push (idler_mount.mesh ());

        if (params.debug) {
            // Walls
            mesh.push (
                union (
                    cube ([params.box_wall, 40, nema_mount.wall_trap_h])
                        .rotateZ (180),
                    cube ([40 + params.box_wall,
                           params.box_wall,
                           nema_mount.wall_trap_h])
                        .left (params.box_wall)
                )
                    .setColor (0.2, 0.2, 0.2, 0.5)
            );
            // Y rod
            mesh.push (
                cylinder ({r: rod_y.r, h: 60, fn: FN})
                    .rotateX (90)
                    .translate ([Size.rod_y_wall_dx, -10, Size.rod_y_dz])
                    .setColor (0.2, 0.3, 0.3, 0.5)
            );
            // Idlers 
            mesh.push (
                idler.mesh ()
                    .translate ([idler_mount.wall_idler1_dx,
                                 -idler_mount.wall_idler_dy,
                                 Size.idler1_dz]),
                idler.mesh ()
                    .translate ([idler_mount.wall_idler2_dx,
                                 -idler_mount.wall_idler_dy,
                                 Size.idler2_dz])
                /*
                // Motor with pulley.
                nema.mesh ().union (
                    gt2_pulley.mesh ("belt").up (Size.belt1_dz))
                    .translate ([nema.half_size,
                                 -nema.half_size,
                                 0])
                */
            );
        }
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
