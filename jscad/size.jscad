// -*- mode: js; electric-indent-mode: t; indent-tabs-mode: nil -*-

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

};