/* -*- mode: js; electric-indent-mode: t; indent-tabs-mode: nil -*- */
/**********

           Smartcore : L'empileuse

           author: serge.vi / smartfriendz
           licence : GPL



           TODO:
           - clips glass
           - adjust carriage_y size to 2 * LM_UU lenght

***********/

// global vars - updated from interface but need to be avalaible in all functions
var _globalResolution; // used to speed up rendering. ugly for preview. use 24 or 32 for generating stl.
var _globalWidth; // exernal dimension of the all printer
var _globalHeight; // exernal dimension of the all printer
var _globalDepth; // exernal dimension of the all printer

var _position = {x: 0, y: 0, z:0}; // Printer head and bed position.

var _printableWidth;
var _printableDepth;
var _printableHeight;
var _wallThickness; // box wood thickness
var _XYrodsDiam; // usually 6 or 8 .. or 10? 
var _XYlmDiam; // lm6uu, lm8uu ... will be calculated from rods diam
var _ZrodsDiam; // usually 6, 8, 10 or 12 
var _ZlmDiam; // lm6uu, lm8uu ... will be calculated from rods diam
var _nemaXYZ;  // nema 14 , nema 17 
var _XrodsWidth=40; //space between rods on X axis
var _ZrodsWidth=60; //space between rods on Z axis
var _extrusionType = 0; // 0 bowden 1 direct
var XrodLength = 300; // will be calculated in main from parameters.
var YrodLength = 300; // will be calculated in main from parameters.
var ZrodLength = 300; // will be calculated in main from parameters.
var _rodsSupportThickness = 3; // thickness around rods for all supports
var outputPlateWidth = 180; //used when output to printable plates for elements
var outputPlateDepth = 180;
var mk7Diam = 10;
var beltXAddon = 120; // belt extra length over rod size - bearing guides and difference between bearing edge to end of rod
var beltYAddon = 30; // belt extra length over y rod size - distance from motor pulley edge to Y rod mount and
var _ZrodsOption = 1;
// global for work
var _bearingsDepth = 35; // hack.need to be cleaned. 
var headoffset = -50; // used to place the head along X axis
var XaxisOffset = 100; // used to palce the X axis on Y
var _ZaxisOffset = -30; // used to place Z stage.
var endxJheadAttachHolesWidth = 32; // tempo.. 
var _zBottomHeight = 10;        // Thickness of the bottom support for Z rods and Z motor mount plate.
var output; // show hide objects  from output choosen in the parameters.


var carriage_y;                 // Carriage Y object.


// Distances (calculated in Size.calc () called from main).
var dist = {x: {}, y: {}, z: {}};

// Different constant dimentions.
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

    // Wall thickness of Y rod support on motor mount
    // and on Y slider LM__UU support
    rod_xy_wall: 3,
    
    rod_y_wall_dist: 20,        // distance from wall to Y rod axis
    rod_y_nema_overlap: 3,      // how deep Y rods lies in support and lies on motors
    rod_x_car_overlap: 8,       // how deep X rods lies in Y carriages

    idler_support_h: 0.4,       // It's builtin washer
    lmuu_fix_plate: 6,          // Width of LM_UU fix plate for M3 screw.
    
    x: {
        lmuu: {},
        rod: {}
    },
    y: {
        lmuu: {
        },
        rod: {}
    },
    z: {
        lmuu: {},
        rod: {}
    },
    
    calc: function () {

        this.x.rod.d = _XYrodsDiam;
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


var idler3 = new Idler (3, 10, 8, 11.5, 1, 6); // Two 3x10x4 mm flanged bearings
var idler4 = new Idler (4, 10, 8, 11.65, 0.85, 7); // Two 4x10x4 mm flanged bearings
var idler5 = new Idler (5, 10, 8, 11.65, 0.85, 8); // Two 5x10x4 mm flanged bearings
var idler8 = new Idler (8, 22, 7, 22, 0.5, 10);     // One 608 bearing

var idler = idler8;

function Idler (d_i, d_w, h, d_f, h_f, d_s) {
    this.r_i = d_i / 2;         // bore D
    this.r_w = d_w / 2;         // working D
    this.h = h;                 // full height
    this.r_f = d_f / 2;         // flange D
    this.h_f = h_f;             // flange height
    this.r_s = d_s / 2;         // Support (builtin waser) D

    this.mesh = function () {
        var mesh = difference (
            union (
                cylinder ({r: this.r_f, h: this.h_f}),
                cylinder ({r: this.r_w, h: this.h}),
                cylinder ({r: this.r_f, h: this.h_f})
                    .translate ([0, 0, this.h - this.h_f])
            ),
            cylinder ({r: this.r_i, h: this.h + 2})
                .translate ([0, 0, -1])
        );
        return color ([0.7, 0.7, 0.7], mesh);
    };
}


function Gt2_Pulley () {
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
        mesh = mesh.subtract (cube ([40, 40, 40]).rotateZ (180));
        
        if (base == "belt")
            mesh = mesh.translate ([0, 0, -this.h_base]);
        
        return mesh.setColor ([0.85, 0.85, 0.85]);
    };
}

var gt2_pulley_16 = new Gt2_Pulley ();

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

// interactive parameters

function getParameterDefinitions() {
    return [
        {name: '_version', caption: 'Version', type: 'text', initial: "1.0.9 mar 13 2015"},
        { 
            name: '_output', 
            caption: 'What to show :', 
            type: 'choice', 
            values: [0,1,101,102,2,3,4,-1,5,6,7,8,9,10,11,12], 
            initial: 0,
            captions: ["-----",                // 0
                       "All printer assembly", // 1
                       "Assembly, no walls",   // 101
                       "Gantry assembly",      // 102
                       "printed parts plate",  // 2
                       "parts only",           // 3
                       "Walls and rods sizes", // 4
                       "-----",                // nope
                       "motor xy",             // 5
                       "bearings xy",          // 6
                       "slide y",              // 7
                       "z top",                // 8
                       "z bottom",             // 9
                       "z slide",              // 10
                       "head",                 // 11
                       "extruder"              // 12
                      ]
        },
        { name: '_globalResolution', caption: 'output resolution (16, 24, 32)', type: 'int', initial: 8 },   
        
        { name: '_printableWidth', caption: 'Print width:', type: 'int', initial: 200 },
        { name: '_printableHeight', caption: 'Print height :', type: 'int', initial: 150 },
        { name: '_printableDepth', caption: 'Print depth :', type: 'int', initial: 200 },
        {
            caption: 'Position (x,y,z):',
            name: '_position',
            type: 'text',
            initial: '20,0,0'
        },
        { name: '_wallThickness', caption: 'Box wood thickness:', type: 'int', initial: 10 },
        { name: '_XYrodsDiam', caption: 'X Y Rods diameter (6 or 8 ):', type: 'int', initial: 8},
        { name: '_ZrodsDiam', caption: 'Z Rods diameter (6,8,10,12):', type: 'int', initial: 8},
        { name: '_ZrodsOption', caption: 'Z threaded rods:', type: 'choice', initial: 0, values:[0,1,2],captions: ["false", "true", "true-2sides"]},
        
        
        {name: '_nemaXYZ', 
         type: 'choice',
         caption: 'Stepper motors type',
         values: ["nema14","nema17"],
         captions: ["nema14","nema17"],
         initial: "nema17"
        }
        /*
          {name: 'extrusionType', 
          type: 'choice',
          caption: 'Extrusion type',
          values: [0, 1],
          captions: ["direct","bowden"], 
          initial: 1
          }
        */
    ]; 
}



// -----------------  printed elements 



function zTopBase (width, depth, height) {
    return difference(
        //main
        cube({size: [width, depth, height], center: true})
            .translate([0, -1, 0]),
        // outside form left
        cube({size: [13, depth, height], center: true})
            .translate([-width / 2 + 6.5, -5, 0]),
        // outside form right
        cube({size: [13, depth, height], center: true})
            .translate([width / 2 - 6.5, -5, 0]),
        //screw left
        slottedHole(4, 8, depth)
            .rotateX(90)
            .rotateY(90)
            .translate([-(width) / 2 + 4, 20, 0]),
        //screw right
        slottedHole(4, 8, depth)
            .rotateX(90)
            .rotateY(90)
            .translate([(width) / 2 - 9, 20, 0]),
        // z rod left
        cylinder({r: _ZrodsDiam / 2, h: height, fn: _globalResolution})
            .translate([-_ZrodsWidth / 2, depth / 2 - 15, -height / 2]),
        //z rod right
        cylinder({r: _ZrodsDiam / 2, h: height, fn: _globalResolution})
            .translate([_ZrodsWidth / 2, depth / 2 - 15, -height / 2]),
        // chamfer
        roundBoolean2(10, height, "bl")
            .rotateX(90)
            .rotateZ(-90)
            .translate([-width / 2 + 22,
                        -depth / 2 + 9,
                        -height / 2]),
        roundBoolean2(10, height, "bl")
            .rotateX(90)
            .translate([width / 2 - 22,
                        -depth / 2 + 9,
                        -height / 2])
    );
}


function zTop() {
    var width = _ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2)+26;
    var height = 12;
    var depth = 24;
    var insideWidth = 28;

    if (_ZrodsOption > 0) {
        return union(
            difference(
                zTopBase (width, depth, height),
                // bearing hole
                union(
                    bearing608z(),
                    cylinder({r:12/2, h:height*4,fn: _globalResolution}).translate([0,0,-8])
                ).translate([0, -12, -1])
            )
        );
    } else {
        return union(
            difference(
                zTopBase (width, depth, height),
                // inside form
                difference(
                    cube({size: [insideWidth, 8, height], center: true})
                        .translate([3,-5.5,0]),
                    cylinder ({r: 5, h: 0.5, fn: _globalResolution})
                        .rotateX (-90)
                        .translate ([3, -9.5, 0]),
                    cylinder({r: 5, h: 0.5, fn: _globalResolution})
                        .rotateX(-90)
                        .translate([3, -2, 0])
                ),
                // bearing hole
                cylinder({r: 4, h: depth, fn: _globalResolution})
                    .rotateX(-90)
                    .translate([3, -depth / 2 - 4, 0])
            )
        );
    }
}

function zBottom() {
    var width = _ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2)+26;
    var height = _zBottomHeight;
    var depth = 22;
    var inside_cut_x = _ZrodsWidth-_ZrodsDiam-_rodsSupportThickness*2;
    
    if (_ZrodsOption>0) {
        return difference(
            //main
            union(                      
                zTopBase(width, depth+20, height-2).translate([0,-8,0])
            ),
            nemaHole(_nemaXYZ).rotateX(0).translate([0,-12,-_nemaXYZ/2]),
            cylinder({r:10/2, h:height*4,fn: _globalResolution}).translate([0,-12,-8])
            
        );      
    } else {
        return difference(
            //main
            union(
                cube({size:[width,depth,height],center:true}).setColor(0.2,0.7,0.2),
                cube({size:[width/2,depth,10],center:true}).translate([0,-10,0]).setColor(0.2,0.7,0.2)
            ),

            // inside form
            nemaHole(_nemaXYZ).rotateX(90).translate([0,0,_nemaXYZ/2-height/2]),
            cube({size:[inside_cut_x,depth,height],center:true}).translate([0,10,0]),
            // outside form left
            cube({size:[13,depth,height],center:true}).translate([-width/2+6.5,-5,0]),
            // outside form right
            cube({size:[13,depth,height],center:true}).translate([width/2-6.5,-5,0]),
            // z rod left
            cylinder({r:_ZrodsDiam/2,h:height,fn:_globalResolution}).translate([-_ZrodsWidth/2,-2,-height/2]),
            //z rod right
            cylinder({r:_ZrodsDiam/2,h:height,fn:_globalResolution}).translate([_ZrodsWidth/2,-2,-height/2]),

            // screws attach holes
            cylinder({r:2,h:5,fn:_globalResolution}).rotateX(-90).translate([width/2-5,depth/2-5,0]),
            cylinder({r:2,h:5,fn:_globalResolution}).rotateX(-90).translate([-width/2+5,depth/2-5,0])

        );
    }
}

function slideZ() {
    var width = _ZrodsWidth-5;
    var height = 15;
    var depth = 5;
    var insideWidth = 35;

    return difference(
        //main form
        union(
            cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),

            Gt2Holder(3,10).rotateX(90).rotateY(90).translate([width/2-10,1,height-5]).setColor(0.2,0.7,0.2),

            //Gt2Holder(3).rotateX(90).rotateY(90).translate([width/2-10,1,10]).setColor(0.2,0.7,0.2),
            // lm8uu holes
            cylinder({r:_ZlmDiam/2+3,h:height,fn:_globalResolution}).translate([0,0,0]).setColor(0.2,0.7,0.2),
            cylinder({r:_ZlmDiam/2+3,h:height,fn:_globalResolution}).translate([_ZrodsWidth,0,0]).setColor(0.2,0.7,0.2),
            // side forms for lm8 attach
            cube({size:[13,10,height]}).translate([_ZrodsWidth+_ZlmDiam/2,-5,0]).setColor(0.2,0.7,0.2),
            cube({size:[13,10,height]}).translate([-13-_ZlmDiam/2,-5,0]).setColor(0.2,0.7,0.2)

        ),

        // z rod left linear bearing lm
        cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([0,0,0]),
        //z rod right linear bearing lm
        cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([_ZrodsWidth,0,0]),
        //side holes
        cylinder({r:1.3,h:16,fn:_globalResolution}).rotateY(90).translate([_ZrodsWidth+_ZlmDiam/2,0,height/2]),
        cylinder({r:1.3,h:16,fn:_globalResolution}).rotateY(90).translate([-13-_ZlmDiam/2,0,height/2])

    );

}

function slideZ2() {
    var width = _ZrodsWidth-5;
    var height = 40;
    var depth = 5;
    var insideWidth = 35;
    var lmXuu_support_r = _rodsSupportThickness + _ZlmDiam / 2;
    var side_plate_size = 7;
    var side_form_size = lmXuu_support_r + side_plate_size;
    // lmXuu set screws offset
    var set_screw_offset = lmXuu_support_r + side_plate_size / 2 - 1;
    var nutRadius = 14.5/2;
    
    if (_ZrodsOption>0) {
        return difference(
            //main form
            union(
                cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),

                // lmXuu support
                cylinder({r:lmXuu_support_r,h:height,fn:_globalResolution}).setColor(0.2,0.7,0.2),
                cylinder({r:lmXuu_support_r,h:height,fn:_globalResolution}).translate([_ZrodsWidth,0,0]).setColor(0.2,0.7,0.2),
                // side forms for lmXuu attach
                cube({size:[side_form_size,10,height]}).translate([_ZrodsWidth,-4,0]).setColor(0.2,0.7,0.2),
                cube({size:[side_form_size,10,height]}).translate([-side_form_size,-4,0]).setColor(0.2,0.7,0.2),

                // extra forms front bearings holes
                cube([7,60,height]).translate([-3.5,-55,0]).setColor(0.2,0.7,0.2),
                cube([7,60,height]).translate([_ZrodsWidth-3.5,-55,0]).setColor(0.2,0.7,0.2),
                
                // nut holder
                cube([30,20,15]).translate([15,-20,height-15]).setColor(0.2,0.8,0.2)

            ),
            // nut hole
            cylinder({r:nutRadius, h:20, fn: 6}).translate([30,-10,height-25]),
            cylinder({r:12/2, h:height,fn: _globalResolution}).translate([30,-10,0]),
            //nut set nut hole
            cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([30,15,height-10]),
            
            //  boolean front horizontal
            cylinder({r:60,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-60,-25]),
            //  cylinder({r:5,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-15,height-10]),
            // z rod left linear bearing lm
            cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([0,0,0]),
            //z rod right linear bearing lm
            cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([_ZrodsWidth,0,0]),
            // side holes for lmXuu attach
            cube({size:[side_form_size+1,2,height]}).translate([_ZrodsWidth,0,0]),
            cube({size:[side_form_size+1,2,height]}).translate([-side_form_size-1,0,0]),
            // side holes for lmXuu screws
            cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([_ZrodsWidth+set_screw_offset,20,height-10]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([_ZrodsWidth+set_screw_offset,20,10]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([-set_screw_offset,20,height-10]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([-set_screw_offset,20,10]),
            // top holes
            cylinder({r:1.4,h:30,fn:_globalResolution}).translate([0,-20,height-30]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).translate([_ZrodsWidth,-20,height-30]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).translate([0,-40,height-30]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).translate([_ZrodsWidth,-40,height-30])
        );
    } else {
        return difference(
            //main form
            union(
                cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),

                Gt2Holder2().rotateX(90).rotateY(90).translate([width/2-10,3,height-13]).setColor(0.2,0.7,0.2),

                //Gt2Holder(3).rotateX(90).rotateY(90).translate([width/2-10,1,10]).setColor(0.2,0.7,0.2),
                // lmXuu support
                cylinder({r:lmXuu_support_r,h:height,fn:_globalResolution}).setColor(0.2,0.7,0.2),
                cylinder({r:lmXuu_support_r,h:height,fn:_globalResolution}).translate([_ZrodsWidth,0,0]).setColor(0.2,0.7,0.2),
                // side forms for lmXuu attach
                cube({size:[side_form_size,10,height]}).translate([_ZrodsWidth,-4,0]).setColor(0.2,0.7,0.2),
                cube({size:[side_form_size,10,height]}).translate([-side_form_size,-4,0]).setColor(0.2,0.7,0.2),

                // extra forms front bearings holes
                cube([7,60,height]).translate([-3.5,-55,0]).setColor(0.2,0.7,0.2),
                cube([7,60,height]).translate([_ZrodsWidth-3.5,-55,0]).setColor(0.2,0.7,0.2)

            ),
            // big hole middle
            cylinder({r:8,h:50,fn:_globalResolution}).rotateX(90).translate([width/2+12,40,height/2+10]),
            //cylinder({r:10,h:50,fn:_globalResolution}).rotateX(90).translate([width/2-10,40,height/2-10]),
            cylinder({r:5,h:50,fn:_globalResolution}).rotateX(90).translate([width/2+15,40,height/2-10]),
            cylinder({r:5,h:50,fn:_globalResolution}).rotateX(90).translate([width/2-10,40,height/2-10]),
            //  boolean front horizontal
            cylinder({r:60,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-60,-25]),
            cylinder({r:5,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-15,height-10]),
            //cylinder({r:6,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-30,height-13]),
            //cylinder({r:3,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-15,height-28]),
            //cylinder({r:3,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-40,height-6]),
            // z rod left linear bearing lm
            cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([0,0,0]),
            //z rod right linear bearing lm
            cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([_ZrodsWidth,0,0]),
            // side holes for lmXuu attach
            cube({size:[side_form_size+1,2,height]}).translate([_ZrodsWidth,0,0]),
            cube({size:[side_form_size+1,2,height]}).translate([-side_form_size-1,0,0]),
            // side holes for lmXuu screws
            cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([_ZrodsWidth+set_screw_offset,20,height-10]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([_ZrodsWidth+set_screw_offset,20,10]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([-set_screw_offset,20,height-10]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([-set_screw_offset,20,10]),
            //bottom holes
            //cylinder({r:2.4,h:10,fn:_globalResolution}).rotateX(83).rotateZ(5).translate([0,-7,10]),
            //cylinder({r:2.4,h:10,fn:_globalResolution}).rotateX(83).rotateZ(-5).translate([_ZrodsWidth,-7,10]),
            // top holes
            cylinder({r:1.4,h:30,fn:_globalResolution}).translate([0,-20,height-30]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).translate([_ZrodsWidth,-20,height-30]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).translate([0,-40,height-30]),
            cylinder({r:1.4,h:30,fn:_globalResolution}).translate([_ZrodsWidth,-40,height-30]),
            // special hole in gt2 holder to be able to get the belt out .. but still printable vertically.
            linear_extrude({height:20},polygon({points:[[0,0],[6,0],[4,10],[2,10]]})).rotateY(-90).translate([width/2+5,-10,height-15])
        );
    }
}

function slideZsupport() {
    var mesh;
    var X = 7;
    var Y = 70;
    var Z = 50;
    mesh = difference(
        cube({size:[X,Y,Z]}),
        difference(
            cube({size:[X,Y,Z]}),
            roundBoolean2(20,10,"bl").rotateZ(90).translate([X,Y-20,Z-20])
        ).translate([0,-10,-10]),
        // side holes
        slottedHole(3.2,8,X).rotateX(90).rotateZ(90).translate([0,Y-5,Z-10]),
        slottedHole(3.2,8,X).rotateX(90).rotateZ(90).translate([0,Y-5,8]),
        //top holes
        cylinder({r:1.3,h:10,fn:_globalResolution}).translate([X/2,10,Z-10]),
        cylinder({r:1.3,h:10,fn:_globalResolution}).translate([X/2,Y-25,Z-10])

    );
    return mesh;
}


function extraSupportBed(){
    return difference(
        union(
            //base
            cube({size:[30,10,5]}),
            //middle
            cube({size:[14,10,15]}).translate([8,0,5])
            
        ),
        // hole for m5 rod
        slottedHole(5.2,15,12).rotateZ(90).rotateX(85).translate([15,11,12]),
        // screws
        cylinder({r:2.1,h:10,fn:_globalResolution}).translate([4,5,0]),
        cylinder({r:2.1,h:10,fn:_globalResolution}).translate([26,5,0])
    );
}


function slideY (opt) {
    return carriage_y.mesh (opt);
}


function headLeft(){
    var mesh;
    var X = 17;
    var Y = 20;
    var Z = 43;
    var xrodOffset = 18;

    mesh = difference(
        
        union(
            cube({size:[X,Y,Z]}),
            //gt2 holders 
            Gt2HolderSuspendedLeft(3).translate([0,-5,Z-24]),
            Gt2HolderSuspendedRight(3).translate([0,17,Z-14]),
            // support for endstop X
            cube({size:[10,10,10]}).translate([0,17,5])
        ),
        //rod x holes
        cylinder({r:_XYlmDiam/2,h:X,fn:_globalResolution}).rotateY(90).translate([0,Y/2,15]),
        cylinder({r:_XYlmDiam/2,h:X,fn:_globalResolution}).rotateY(90).translate([0,Y/2,15+xrodOffset]),
        // head attach holes 
        cylinder({r:1.3,h:22,fn:_globalResolution}).rotateX(-90).translate([13,0,40]),
        cylinder({r:1.3,h:22,fn:_globalResolution}).rotateX(-90).translate([13,0,23]),
        // rodx extra to ease insert
        cube({size:[X,1,Z]}).translate([0,Y/2-1,-10]),
        // screw to fix rodx guides
        cylinder({r:1.6,h:Y/2,fn:_globalResolution}).rotateX(-90).translate([X/2,0,4]),
        cylinder({r:1.3,h:Y/2,fn:_globalResolution}).rotateX(-90).translate([X/2,Y/2,4])      

    );
    return mesh;

}

function headRight(){
    var mesh;
    var X = 17;
    var Y = 20;
    var Z = 43;
    var xrodOffset = 18;

    mesh = difference(
        
        union(
            cube({size:[X,Y,Z]}),
            //gt2 holders 
            Gt2HolderSuspendedLeft(3).translate([X-10,-5,Z-14]),
            Gt2HolderSuspendedRight(3).translate([X-10,17,Z-24]) 
        ),
        //rod x holes
        cylinder({r:_XYlmDiam/2,h:X,fn:_globalResolution}).rotateY(90).translate([0,Y/2,15]),
        cylinder({r:_XYlmDiam/2,h:X,fn:_globalResolution}).rotateY(90).translate([0,Y/2,15+xrodOffset]),
        // head attach holes 
        cylinder({r:1.3,h:22,fn:_globalResolution}).rotateX(-90).translate([3,0,40]),
        cylinder({r:1.3,h:22,fn:_globalResolution}).rotateX(-90).translate([3,0,23]),

        cube({size:[X,1,Z]}).translate([0,Y/2-1,-10]) ,
        // screw to fix rodx guides
        cylinder({r:1.3,h:Y/2,fn:_globalResolution}).rotateX(-90).translate([X/2,0,4]),
        cylinder({r:1.6,h:Y/2,fn:_globalResolution}).rotateX(-90).translate([X/2,Y/2,4])     

    );
    return mesh;

}

function HeadSupportJhead(){
    var width = 40;
    var height = 35;
    var depth = 15;
    var extDiam=15.1;
    var intDiam=12.1;
    var intDiamHeight=5;
    return difference(
        union(
            //base
            cube({size:[28,5,height]}).translate([(width-28)/2,0,0]),
            // top
            cube({size:[width,depth,8]}).translate([0,0,height-8])
            
        ),
        // jhead holes 
        cylinder({r:extDiam/2+0.1,h:height-5,fn:_globalResolution}).translate([width/2,depth+1,0]),
        cylinder({r:intDiam/2+0.1,h:intDiamHeight,fn:_globalResolution}).translate([width/2,depth+1,height-5]),
        cylinder({r:13,h:height-10,fn:_globalResolution}).translate([width/2,depth+1,0]),
        // jhead attach holes 
        cylinder({r:1.3,h:30,fn:_globalResolution}).rotateX(-90).translate([width/2-endxJheadAttachHolesWidth/2,0,height-4]),
        cylinder({r:1.3,h:30,fn:_globalResolution}).rotateX(-90).translate([width/2+endxJheadAttachHolesWidth/2,0,height-4]),

        // head attach holes 
        slottedHole(3.2,8,10).rotateX(90).translate([width/2-11,depth-5,5]),
        slottedHole(3.2,8,10).rotateX(90).translate([width/2+11,depth-5,5])


    );
}

function JheadAttach(){
    var extDiam=16;
    var intDiam=12;
    var intDiamHeight=5;
    var depth = 12;
    var width = 75;
    var barHeight = 6;

    return difference(
        union(
            cube([endxJheadAttachHolesWidth-5,13,8]).translate([width/2-((endxJheadAttachHolesWidth-5)/2),-15,barHeight]),
            tube(3.2,10,13).rotateX(-90).translate([width/2-endxJheadAttachHolesWidth/2,-15,barHeight+4]),
            tube(3.2,10,13).rotateX(-90).translate([width/2+endxJheadAttachHolesWidth/2,-15,barHeight+4])
        ),
        cylinder({r:extDiam/2,h:10,fn:_globalResolution}).translate([width/2,0,0]),
        cylinder({r:intDiam/2,h:intDiamHeight,fn:_globalResolution}).translate([width/2,0,10])
        

    );  
}



function InductiveSensorSupport(){
    var width = 45;
    var height = 8;
    var depth = 12;
    var extDiam=15.1;
    var intDiam=12.1;
    var intDiamHeight=5;
    return difference(
        union(
            //base
            cube({size:[width,depth,height]}),
            // inductive support
            cylinder({r:13,h:height,fn:_globalResolution}).translate([width+10,depth/2,0])
        ),
        // jhead holes 
        cylinder({r:extDiam/2+0.1,h:3,fn:_globalResolution}).translate([width/2,depth,0]),
        cylinder({r:intDiam/2+0.1,h:intDiamHeight,fn:_globalResolution}).translate([width/2,depth,height-5]),
        
        // head attach holes 
        cylinder({r:1.6,h:13,fn:_globalResolution}).rotateX(-90).translate([width/2-endxJheadAttachHolesWidth/2,0,height/2]),
        cylinder({r:1.6,h:13,fn:_globalResolution}).rotateX(-90).translate([width/2+endxJheadAttachHolesWidth/2,0,height/2]),

        // inductive support hole
        cylinder({r:9.1,h:height,fn:_globalResolution}).translate([width+10,depth/2,0]),
        // hole screw to attach the sensor faster
        cylinder({r:1.3,h:10,fn:_globalResolution}).rotateX(-90).translate([width+10,-10,height/2])

    );
}

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

var motor_mount = {
    
    wall_trap_h: 20,            // height of wall inside support (trap height)
    thickness: 5,               // thickness of wall support

    mesh: function () {
        var nema_screw_offset = nema.side_size / 2 - nema.mount_dist;
        var height = this.thickness + this.wall_trap_h;
        return difference (
            union (
                // base
                cube ([Size.rod_y_wall_dist, nema.side_size, this.thickness + 2]),
                // wall support
                cube ([9, nema.side_size, this.wall_trap_h]),
                //top fix
                cube ([_wallThickness + 9, nema.side_size, this.thickness])
                    .translate([-_wallThickness, 0, this.wall_trap_h]),
                // back fix
                cube ([this.thickness,
                       nema.side_size,
                       this.wall_trap_h / 2  + this.thickness])
                    .translate([-_wallThickness - this.thickness,
                                0,
                                this.wall_trap_h / 2]),
                // rod support - half slotted hole
                cylinder ({r: Size.y.rod.r + Size.rod_xy_wall,
                           h: nema.side_size / 2})
                    .rotateX (90)
                    .translate ([Size.rod_y_wall_dist, nema.side_size, Size.y.rod.r])
            ).setColor(0.2, 0.7, 0.2),
            nemaHole (nema.side_size)
                .translate ([nema.side_size / 2, nema.side_size / 2, -1]),
            // rod support hole
            cylinder ({r: Size.y.rod.r, h: 12, fn: _globalResolution})
                .rotateX(90)
                .translate([Size.rod_y_wall_dist, nema.side_size, Size.y.rod.r])
                .setColor(0.2, 0.7, 0.2),
            // straighten half of rod support
            cube({size: [(nema.ring_r + Size.clr.free) * 2,
                         (nema.ring_r + Size.clr.free) * 2,
                         100],
                  center: [0, 1, 1]})
                .translate([nema.side_size / 2, nema.side_size / 2, -1]),
            // round
            roundBoolean2(5, nema.side_size, "br")
                .translate([-_wallThickness - this.thickness, 0, this.thickness + 15]),
            // holes to fix on the wood side - version simple
            // wood screw holes
            cylinder({r: Size.m4.screw_r, h: 20, fn: 8})
                .rotateX(-90)
                .rotateZ(90)
                .translate([-_wallThickness, 7, this.wall_trap_h - 5]),
            cylinder ({r: Size.m4.screw_r, h: 20, fn: 8})
                .rotateX(-90)
                .rotateZ(90)
                .translate([-_wallThickness, nema.side_size - 7, this.wall_trap_h - 5]),
            // extra nema bool (motor body)
            cube({size: [nema.side_size, nema.side_size, nema.side_size]})
                .translate([0, 0, -nema.side_size]),
            // Screw head traps.
            cylinder ({r: Size.m3.head_r, h: 10, fn: _globalResolution})
                .translate ([nema_screw_offset,
                             nema_screw_offset,
                             height - Size.m3.head_h]),
            cylinder ({r: Size.m3.head_r, h: 10, fn: _globalResolution})
                .translate ([nema_screw_offset,
                             nema.side_size - nema_screw_offset,
                             height - Size.m3.head_h]),
            // Corners groove
            cylinder ({d: 0.6, h: nema.side_size + 2, fn: 16})
                .rotateX(-90)
                .translate ([-0.2, -1, this.wall_trap_h - 0.2]),
            cylinder ({d: 0.6, h: nema.side_size + 2, fn: 16})
                .rotateX(-90)
                .translate ([-_wallThickness + 0.2, -1, this.wall_trap_h - 0.2])
        );
    }
};

function motorXY () {
    return motor_mount.mesh ();
}


// Y carriage object.
var Carriage_y = function () {
    this.rod_x_wall = 2;
    this.body_width = 20;        // It's D_outer_608 - 2mm
    this.idler_slot_r = idler.r_w * 2 + 2;
    this.body_l =
        Size.rod_x_car_overlap + this.rod_x_wall + 1 +
        idler.r_w + dist.x.rod_y_idler_axis;
    this.body_height =
        dist.z.idler2_slot + Size.idler_support_h * 2 + idler.h + 6;
    
    this.lmuu_support_r = Size.y.lmuu.ro + Size.rod_xy_wall;
    this.lmuu_fix_plate_thickness = 6;
    this.lmuu_support_extra = Size.y.lmuu.l * 4  / 3 - this.body_width;
    this.lmuu_support_width = this.lmuu_support_extra + this.body_width;
    // Distance of extra LM_UU parts.
    this.lmuu_extra = (Size.y.lmuu.l * 2 - this.lmuu_support_width) / 2;
};

Carriage_y.prototype.mesh = function (opt) {
    var mesh;

    if (typeof opt != "string")
        opt = "";

    // round bearings support in middle
    var idler_support =
        cylinder({
            r1: idler.r_s + Size.idler_support_h * 2 + 0.1,
            r2: idler.r_s,
            h: Size.idler_support_h + 0.1
        }).translate ([0, 0, - 0.1])
        .setColor (0.7, 0.4, 0.4);    // XXX DEB

    var lmuu_support =
        union (
            // Support body.
            cylinder ({r: this.lmuu_support_r, h: this.lmuu_support_width})
                .rotateX (-90),
            // LM_UU fix plate.
            cube ({size: [Size.lmuu_fix_plate + this.lmuu_support_r,
                          this.lmuu_support_width,
                          this.lmuu_fix_plate_thickness],
                   center: [false,false,true]})
                .mirroredX()
        )
        .subtract ([
            // Screw holes for LM_UU fix
            cylinder ({r: Size.m3.screw_r,
                       h: this.lmuu_fix_plate_thickness,
                       center: true,
                       fn: 8})
                .translate ([-Size.lmuu_fix_plate / 2 - this.lmuu_support_r, 8, 0]),
            cylinder ({r: Size.m3.screw_r,
                       h: this.lmuu_fix_plate_thickness,
                       center: true,
                       fn: 8})
                .translate ([-Size.lmuu_fix_plate / 2 - this.lmuu_support_r,
                             this.lmuu_support_width - 8,
                             0])
        ]);

    // Main body.
    // Base point: [idler shaft, idler shaft, 0]
    var body =
        union (
            // Lower rect
            cube ({size: [this.body_l, this.body_width, dist.z.idler1_slot],
                   center: [0, 1, 0]})
                .translate ([-dist.x.rod_y_idler_axis, 0, 0]),
            // Upper rect
            cube ({size: [this.body_l - dist.x.rod_y_idler_axis,
                          this.body_width,
                          this.body_height],
                   center: [0, 1, 0]}),
            // Round upper rect
            cylinder ({d: this.body_width, h: this.body_height})
        )
        .subtract ([
            // Bearing slots.
            cube ({size: [this.idler_slot_r, this.body_width + 2, dist.z.idler_slot_size],
                   center: [1, 1, 0]})
                .translate ([0, 0, dist.z.idler1_slot]),
            cube ({size: [this.idler_slot_r, this.body_width + 2, dist.z.idler_slot_size],
                   center: [1, 1, 0]})
                .translate ([0, 0, dist.z.idler2_slot])
        ])
        .union ([
            // Idler bearings support (builtin washers).
            idler_support.translate ([0, 0, dist.z.idler1_slot]),
            idler_support.mirroredZ ()
                .translate ([0, 0, dist.z.idler1_slot + dist.z.idler_slot_size]),
            idler_support.translate ([0, 0, dist.z.idler2_slot]),
            idler_support.mirroredZ ()
                .translate ([0, 0, dist.z.idler2_slot + dist.z.idler_slot_size])
        ])
        .subtract ([
            // Bearing shaft hole.
            // Free part.
            cylinder ({r: 4.1, h: this.body_height, fn: _globalResolution})
                .translate([0, 0, dist.z.idler1_slot]),
            // Tight part (self tap)
            cylinder ({r: 3.8, h: dist.z.idler1_slot, fn: _globalResolution}),
            // rod_x1 hole bottom
            cylinder ({r: Size.x.rod.r + Size.clr.tight,
                       h: Size.rod_x_car_overlap + 1,
                       fn: _globalResolution})
                .rotateY (90)
                .translate ([this.body_l - dist.x.rod_y_idler_axis - Size.rod_x_car_overlap,
                             0,
                             dist.z.rod_x1]),
            // rod_x2 hole
            cylinder ({r: Size.x.rod.r + Size.clr.tight,
                       h: Size.rod_x_car_overlap + 1,
                       fn: _globalResolution})
                .rotateY (90)
                .translate ([this.body_l - dist.x.rod_y_idler_axis - Size.rod_x_car_overlap,
                             0,
                             dist.z.rod_x2]),
            // rod_x1 fix screw hole
            cylinder ({r: Size.m3.screw_r, h: this.body_width, fn: 8})
                .rotateX(90)
                .translate([this.body_l - dist.x.rod_y_idler_axis - Size.rod_x_car_overlap / 2,
                            0,
                            dist.z.rod_x1 + Size.x.rod.r * 2 / 3]),
            // rod_x2 fix screw hole
            cylinder ({r: Size.m3.screw_r, h: this.body_width, fn: 8})
                .rotateX(90)
                .translate([this.body_l - dist.x.rod_y_idler_axis - Size.rod_x_car_overlap / 2,
                            0,
                            dist.z.rod_x2 + Size.x.rod.r * 2 / 3])
        ]);


    if (opt.indexOf ("bearing") > -1)
        body = body.union ([
            idler.mesh ().translate ([0, 0, dist.z.idler1]),
            idler.mesh ().translate ([0, 0, dist.z.idler2])
        ]);

    // Construct whole carriage.
    mesh = union (
        lmuu_support,
        body.translate ([dist.x.rod_y_idler_axis,
                         this.body_width / 2 + this.lmuu_support_extra,
                         -Size.y.rod.r])
    )
        .subtract ([
            // LM_UU support internal hole.
            cylinder ({r: Size.y.lmuu.ro + Size.clr.minimal,
                       h: Size.y.lmuu.l * 2,
                       fn: _globalResolution})
                .rotateX (-90)
                .translate ([0, -1, 0]),
            // Fix plate slit.
            cube ({size: [Size.y.lmuu.ro * 3, Size.y.lmuu.l * 2, 1],
                   center: [0, 0, 1]})
                .mirroredX ()
                .translate ([0, -1, 0]),
            // Bevels
            cylinder ({r1: Size.y.lmuu.ro + 1,
                       r2: Size.y.lmuu.ro - 1,
                       h: 2})
                .rotateX (-90)
                .translate ([0, -0.5, 0]),
            cylinder ({r1: Size.y.lmuu.ro + 1,
                       r2: Size.y.lmuu.ro - 1,
                       h: 2})
                .rotateX (90)
                .translate ([0, 0.5 + this.lmuu_support_width, 0])
        ])
        .union ([
        ])
        .subtract ([
        ]);

    if (opt.indexOf ("debug") > -1) {
        // Look inside
        mesh = difference (
            mesh,
            cube ([50,50,50]).mirroredZ(),
            cube ([50,50,50])
                .translate ([dist.x.rod_y_idler_axis,
                             this.lmuu_support_width - this.body_width / 2,
                             -1])
        );
    }

    // Output linear bearings (debugging/view).
    if (opt.indexOf ("lmuu") > -1)
        mesh = mesh.union ([
            Size.y.lmuu.mesh ()
                .rotateX (-90)
                .translate ([0, -this.lmuu_extra - 0.1,0]),
            Size.y.lmuu.mesh ()
                .rotateX (-90)
                .translate ([0, Size.y.lmuu.l - this.lmuu_extra + 0.1])
        ]);


    return mesh;
};


var idler_mount = {
    mesh: function (opt) {
        var size_y = motor_mount.thickness + _wallThickness + motor_mount.thickness +
            1 + belt.w + idler.r_f;
        var body_z = carriage_y.body_height;
        var size_x = nema.side_size;
        
        var body = cube ([this.size_x, this.size_y, this.body_z]);
        body = body.subtract (
            cube ([])
        );
    }
};

// 
function bearingsXY(){
    var mesh;

    
    
    var X = _wallThickness + motor_mount.thickness * 2 + 1 + idler.r_f;
    var Y = 20;
    var Z = motor_mount.wall_trap_h + idler.h * 2 ;
    var bearingsOffsetZ = 10;
    var bearingsOffsetX = 10+_wallThickness;
    var bearingHoleOffsetX = bearingsOffsetX+13;
    var idler_rod_support_l = 12;
    
    mesh = difference (
        union (
            difference (
                //main
                union (
                    cube ({size: [X, Y, Z]}),
                    // round extremity - half cylinder
                    difference (
                        cylinder ({r: Y / 2, h: Z})
                            .translate([X, Y / 2, 0]),
                        cube ({size: [Y, Y, Z]})
                            .translate ([X - Y, 0, 0])
                    ),
                    // Y rod hole xtra
                    cylinder ({r: Size.y.rod.r + Size.rod_xy_wall,
                               h: idler_rod_support_l})
                        .rotateX (-90)
                        .rotateZ (90)
                        .translate ([20 + _wallThickness, -8, 1]),
                    cube ({size: [12, 10, _XYrodsDiam + 1]})
                        .translate([8 + _wallThickness, -8, 0]).setColor(1,1,1),
                    cube ({size: [12, 15, 5]})
                        .rotateX(20).translate([8+_wallThickness,-6,2]),
                    cube ({size: [12, 7, 5]}).rotateX(25).translate([8+_wallThickness,-5,-3])
                ),
                // support bearings
                cube({size:[X+10,Y,8]}).translate([bearingsOffsetX,0,bearingsOffsetZ]),
                cube({size:[X+10,Y,8]}).translate([bearingsOffsetX,0,bearingsOffsetZ+11])
            ),


            // round bearings supports in middle
            cylinder({r:5,h:0.5,fn:_globalResolution}).translate([bearingHoleOffsetX,Y/2,bearingsOffsetZ]),
            cylinder({r:5,h:4,fn:_globalResolution}).translate([bearingHoleOffsetX,Y/2,bearingsOffsetZ+7.5]),
            cylinder({r:5,h:0.5,fn:_globalResolution}).translate([bearingHoleOffsetX,Y/2,bearingsOffsetZ+11+7.5])
            
        ),
        // long bearing hole
        cylinder({r:4.1,h:Z,fn:_globalResolution}).translate([bearingHoleOffsetX,Y/2,0]),
        // wood support
        cube({size:[_wallThickness,Y,17]}).translate([5,0,0]),
        // Y rod hole
        cylinder({r: _XYrodsDiam/2, h: 12, fn: _globalResolution})
            .rotateX(-90)
            .rotateZ(90)
            .translate([20 + _wallThickness, -8, 1]),
        //round
        roundBoolean2 (10, Y, "br")
            .translate([0, 0, Z - 10]),
        // wood screw holes
        cylinder ({r: Size.m4.screw_r, h:20, fn:8})
            .rotateX(-90).
            rotateZ(90)
            .translate([12, 4, 5]),
        cylinder ({r: Size.m4.screw_r, h:20, fn:8})
            .rotateX(-90)
            .rotateZ(90)
            .translate([12, Y - 4, 5])

    );
    return mesh;

}






// -------------------------------- extruder

function extruder(bowden,part){
    var X = 50;
    var Z = 9;
    var Y = 48; 
    var bearingoffsetX = 17;
    
    var jheadOffsetX = 5;
    //elastic part
    var epoffsetX = 3;
    var epoffsetY = 42;
    // this is to adjust how elastic will the bearing be.
    var elasticpartlength = 5;
    return difference(
        union(
            extruderPart(part,X,Y,Z),
            // extra support in case of bowden
            extruderSupport(bowden,part)
        ),
        nemaHole2().translate([0,2,-Z/2]),
        
        // 608 place 
        difference(
            cylinder({r:12,h:9,fn:_globalResolution}),
            cylinder({r:4,h:9,fn:_globalResolution}),
            cylinder({r:5,h:1,fn:_globalResolution}),
            cylinder({r:5,h:1,fn:_globalResolution}).translate([0,0,8])
        ).translate([bearingoffsetX,2,0]),
        // 608 screw hole to reinforce
        cylinder({r:1.6,h:10,fn:_globalResolution}).translate([bearingoffsetX,2,Z/2]),
        cylinder({r:1.35,h:10,fn:_globalResolution}).translate([bearingoffsetX,2,-Z/2]),
        // jhead or pressfit
        extruderOut(bowden,jheadOffsetX,Y,Z),
        
        // jhead holes : 2 parts. up to pass screws, bottom to fix
        cylinder({r:1.6,h:10,fn:_globalResolution}).translate([jheadOffsetX-8,Y/2+1,Z/2]),
        cylinder({r:1.6,h:10,fn:_globalResolution}).translate([jheadOffsetX+8,Y/2+1,Z/2]),
        cylinder({r:1.35,h:10,fn:_globalResolution}).translate([jheadOffsetX-8,Y/2+1,-Z/2]),
        cylinder({r:1.35,h:10,fn:_globalResolution}).translate([jheadOffsetX+8,Y/2+1,-Z/2]),
        

        // filament
        extruderFilament(bowden,jheadOffsetX,Y,Z),

        
        // elastic part with two holes
        cube({size:[2,epoffsetY,2*Z+1]}).translate([jheadOffsetX+epoffsetX,-Y/2,-Z/2]),
        cube({size:[elasticpartlength,2,2*Z+1]}).translate([jheadOffsetX+epoffsetX,-Y/2+epoffsetY,-Z/2]),
        // solidify corner
        cylinder({r:1.5,h:2*Z+2,fn:_globalResolution}).translate([elasticpartlength+7,-Y/2+epoffsetY+1,-Z/2]),

        
        // attach holes
        //cylinder({r:1.3,h:10,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX+5,Y/2-3,0]),
        //cylinder({r:1.3,h:10,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX-5,Y/2-3,0]),

        // holes to add screw to maintain the iddle
        cylinder({r:1.6,h:15,fn:_globalResolution}).rotateY(-90).translate([X/2,-Y/2+10,9]),
        cylinder({r:1.6,h:15,fn:_globalResolution}).rotateY(-90).translate([X/2,-Y/2+10,0]),
        cylinder({r:1.35,h:15,fn:_globalResolution}).rotateY(-90).translate([X/2-15,-Y/2+10,9]),
        cylinder({r:1.35,h:15,fn:_globalResolution}).rotateY(-90).translate([X/2-15,-Y/2+10,0])
        
    )

}

function extruderPart(part,X,Y,Z){
    // lower part only
    if(part==0){
        return cube({size:[X,Y,Z],center:true}).translate([0,5,0])
    }
    // uppper part only
    else if(part==1){
        return cube({size:[X,Y,Z],center:true}).translate([0,5,Z+0.05])
    }
    else {
        return union(
            //main bottom
            cube({size:[X,Y,Z],center:true}).translate([0,5,0]),
            // main top
            cube({size:[X,Y,Z],center:true}).translate([0,5,Z+0.05])
        )
    }
}

function extruderSupport(bowden,part){
    var X = 20;
    var Z = 15;
    var Y = 9;
    if((bowden==1)&&(part!=1)){
        return difference(
            //main
            slottedHole(9,80,5).rotateY(-90).translate([-20,-30,0]),
            // screws for walls
            cylinder({r:2.1,h:10,fn:_globalResolution}).rotateY(-90).translate([-20,-29,0]),
            cylinder({r:2.1,h:10,fn:_globalResolution}).rotateY(-90).translate([-20,40,0])
            
        )
    }
    else{
        return cube(1)
    }
}

function extruderOut(bowden,jheadOffsetX,Y,Z){
    var jheadExtDiam = 15.5;
    var jheadIntDiam = 12.5;
    if(bowden==0){
        return union(
            cylinder({r:jheadExtDiam/2,h:6,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,Y/2,Z/2]),
            cylinder({r:jheadIntDiam/2,h:4,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,Y/2-4,Z/2]),
            cylinder({r:jheadExtDiam/2,h:5.5,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,Y/2-9.5,Z/2])
        )
    }
    else if(bowden==1){
        return cylinder({r:2.7,h:5,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,Y/2,Z/2])
    }

}

function extruderFilament(bowden,jheadOffsetX,Y,Z){
    if(bowden==0){
        return union(
            cylinder({r:1,h:Y,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,-Y/2,Z/2]),
            cylinder({r1:3,r2:1,h:5,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,8,Z/2]),
            cylinder({r:1.5,h:3,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,19,Z/2])
        )
    }
    else if(bowden==1){
        return union(
            cylinder({r:1,h:Y,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,-Y/2,Z/2]),
            cylinder({r1:3,r2:1,h:5,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,8,Z/2])
        )
    }
}



function clipGlassBack(){
    var glassThickness = 3;
    var mesh = difference(
        cube({size:[18,18,5+glassThickness]}),
        cube({size:[14,14,glassThickness]}).translate([4,4,0]),
        cube({size:[10,10,5]}).translate([8,8,glassThickness]),
        cylinder({r1:1.6,r2:3,h:2,fn:_globalResolution}).translate([2.5,2.5,6]),
        cylinder({r:1.6,h:6,fn:_globalResolution}).translate([2.5,2.5,0])

    );
    mesh.properties.connect1 = new CSG.Connector([0,0, 0], [1, 0, 0], [0, 0, 1]);
    return mesh;
}

function clipGlassFront(){
    var glassThickness = 3;
    var bedSupportThickness = 10;
    var mesh = difference(
        cube({size:[20,8,bedSupportThickness+glassThickness+10]})
    )
    mesh.properties.connect1 = new CSG.Connector([0,0, 0], [1, 0, 0], [0, 0, 1]);
    return mesh;
}

















//  ----------   non printed elements ------------

function fakeJhead(){
    return union(
        cylinder({r:2,h:15,fn:_globalResolution}),
        cube({size:[20,15,8],center:true}).translate([0,0,8]),
        cylinder({r:12.5,h:30,fn:_globalResolution}).translate([0,0,15]),
        cylinder({r:6,h:5,fn:_globalResolution}).translate([0,0,45]),
        cylinder({r:7.5,h:5,fn:_globalResolution}).translate([0,0,50])
        
    );
}

function fake_switch(){
    return cube([40,8,15]);
}



function _walls(){


    return union(
        //left 
        cube({size: [_wallThickness, _globalDepth + _wallThickness, _globalHeight]})
            .translate([-_globalWidth / 2 - _wallThickness, -_globalDepth / 2, 0])
            .setColor(1, 0.5, 0.3),
        
        // back
        cube({size: [_globalWidth, _wallThickness, _globalHeight]})
            .translate([-_globalWidth/2,_globalDepth/2,0])
            .setColor(0.9,0.4,0.3),
        
        // right
        cube({size:[_wallThickness,_globalDepth+_wallThickness,_globalHeight]}).translate([_globalWidth/2,-_globalDepth/2,0]).setColor(0.8,0.3,0.3),
        
        // bottom
        cube({size:[_globalWidth+_wallThickness*2,_globalDepth+_wallThickness,_wallThickness]}).translate([-_globalWidth/2-_wallThickness,-_globalDepth/2,-_wallThickness]).setColor(0.4,0.4,0.4).setColor(0.5,0.2,0.1)
        
    );
}

function wallSizeText(){
    return union(
        //left 
        text3d("left: "+(_globalDepth+_wallThickness)+" x "+_globalHeight).scale(0.5).rotateX(90).rotateZ(-90).translate([-_globalWidth/2-_wallThickness-3,0,_globalHeight/2]).setColor(0.2,0.3,0.2),
        // back
        text3d("back: "+ _globalWidth +" x "+_globalHeight).rotateX(90).scale(0.5).rotateZ(180).translate([0,_globalDepth/2+_wallThickness+3,_globalHeight/2]).setColor(0.2,0.3,0.2),
        // right
        text3d("right: "+(_globalDepth+_wallThickness)+" x "+_globalHeight).scale(0.5).rotateX(90).rotateZ(90).translate([_globalWidth/2+_wallThickness+3,0,_globalHeight/2]).setColor(0.2,0.3,0.2),
        // bottom
        text3d("bottom: "+(_globalWidth+(_wallThickness*2))+" x "+(_globalDepth+_wallThickness)).scale(0.5).translate([0,-_globalDepth/2,_wallThickness]).setColor(0.2,0.3,0.2)

    )
}

function _rodsXY() {
    var offsetFromTopY = 16;
    var offsetFromTopX = -5;
    return union(
        // rod X top
        cylinder ({r: _XYrodsDiam/2, h: XrodLength, fn: _globalResolution})
            .rotateY(90)
            .translate([-_globalWidth / 2 + 55, XaxisOffset + 10,
                        _globalHeight - offsetFromTopX])
            .setColor(0.3,0.3,0.3),
        // rod x top bearing
        cylinder ({r: _XYlmDiam / 2, h: 50, fn: _globalResolution})
            .rotateY(90)
            .translate([headoffset, XaxisOffset + 10, _globalHeight - offsetFromTopX])
            .setColor(0.6,0.6,0.6),
        // rod x bottom
        cylinder ({r: _XYrodsDiam / 2, h: XrodLength, fn: _globalResolution})
            .rotateY(90)
            .translate([-_globalWidth / 2 + 55,
                        XaxisOffset + 10,
                        _globalHeight - offsetFromTopX - 18])
            .setColor(0.3,0.3,0.3)
    );
}

// Draw Y rods.
function rods_y () {
    var overlap = Size.rod_y_nema_overlap;
    return union (
        // rod y left
        cylinder ({r: Size.y.rod.r, h: Size.y.rod.l})
            .rotateX (-90)
            .translate ([-_globalWidth / 2 + Size.rod_y_wall_dist, 0, 0]),
        // rod y right
        cylinder({r: Size.y.rod.r, h: Size.y.rod.l})
            .rotateX (-90)
            .translate ([_globalWidth / 2 - Size.rod_y_wall_dist, 0, 0])
    )
        .translate ([0,
                     -_globalDepth / 2 + nema.side_size - overlap,
                     dist.z.rod_y])
        .setColor(0.6,0.6,0.6);
}

function rods_x (y) {
    var x = _globalWidth / 2 - Size.rod_y_wall_dist -
        carriage_y.body_l + Size.rod_x_car_overlap;
    return union (
        // rod x lower
        cylinder ({r: Size.x.rod.r, h: Size.x.rod.l})
            .rotateY (90)
            .translate ([-x, y, dist.z.rod_x1]),
        // rod x upper
        cylinder({r: Size.x.rod.r, h: Size.x.rod.l})
            .rotateY (90)
            .translate ([-x, y, dist.z.rod_x2])
    )
        .setColor(0.6,0.6,0.6);
}


function _rodsZ() {  
    if (_ZrodsOption === 0) {

        //rod Z left
        return union(
            cylinder({r:_ZrodsDiam/2,h:ZrodLength,fn:_globalResolution}).translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,0]).setColor(0.3,0.3,0.3),
            //rod Z left bearing
            cylinder({r:_ZlmDiam/2,h:50,fn:_globalResolution}).translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-40]).setColor(0.5,0.5,0.5),
            // rod z right
            cylinder({r:_ZrodsDiam/2,h:ZrodLength,fn:_globalResolution}).translate([_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,0]).setColor(0.3,0.3,0.3),
            // rod z right bearing
            cylinder({r:_ZlmDiam/2,h:50,fn:_globalResolution}).translate([_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-40]).setColor(0.5,0.5,0.5)
            // support bed *4
            //cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(90).translate([-_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2]).setColor(0.5,0.5,0.5),
            //cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(90).translate([_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2]).setColor(0.5,0.5,0.5),
            //cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(83).rotateZ(5).translate([-_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2-30]).setColor(0.5,0.5,0.5),
            //cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(83).rotateZ(-5).translate([_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2-30]).setColor(0.5,0.5,0.5)
        );
    } else {
        var sideZrods = union(
            //rod Z left
            cylinder({r:_ZrodsDiam/2,h:ZrodLength,fn:_globalResolution}).translate([-_ZrodsWidth/2,-_wallThickness-2,0]).setColor(0.3,0.3,0.3),
            //rod Z left bearing
            cylinder({r:_ZlmDiam/2,h:50,fn:_globalResolution}).translate([-_ZrodsWidth/2,-_wallThickness-2,_globalHeight/2-40]).setColor(0.5,0.5,0.5),
            // rod z right
            cylinder({r:_ZrodsDiam/2,h:ZrodLength,fn:_globalResolution}).translate([_ZrodsWidth/2,-_wallThickness-2,0]).setColor(0.3,0.3,0.3),
            // rod z right bearing
            cylinder({r:_ZlmDiam/2,h:50,fn:_globalResolution}).translate([_ZrodsWidth/2,-_wallThickness-2,_globalHeight/2-40]).setColor(0.5,0.5,0.5)
        );
        if (_ZrodsOption === 1) {
            return union(sideZrods.translate([0,_globalDepth/2-2,0]));
        } else {
            return union(
                sideZrods.rotateZ(-90).translate([_globalWidth/2-2,0,0]), 
                sideZrods.rotateZ(90).translate([-_globalWidth/2+2,0,0])
            );
        }
    }
}

function _rods() {
    return union(_rodsXY(),_rodsZ());           
}

function rodsLengthText(){
    var offsetFromTopY = 14;
    var offsetFromTopX = -5;
    return union(
        //x 
        text3d("rod X: "+XrodLength.toString()).scale(0.5).translate([-_globalWidth/2+55,XaxisOffset-10,_globalHeight-offsetFromTopX+5]).setColor(0.3,0.3,0.2),
        // y
        text3d("rod Y: "+YrodLength.toString()).scale(0.5).rotateZ(90).translate([-_globalWidth/2+20,_globalDepth/2-100,_globalHeight-offsetFromTopY+5]).setColor(0.3,0.3,0.2),
        // z
        text3d("rod Z: "+ZrodLength.toString()).scale(0.5).rotateX(90).translate([-_ZrodsWidth/2+10,_globalDepth/2-_wallThickness-10,_globalHeight/2-40]).setColor(0.3,0.3,0.2),
        // belt
        text3d("belt length xy: " + ((XrodLength + beltXAddon)*4 + (YrodLength + beltYAddon)*4)).scale(0.5).translate([-_globalWidth/2+55,XaxisOffset-50,_globalHeight-offsetFromTopX+5]).setColor(0.9,0.3,0.2)
    );

}

function _nema(base) {
    var mesh = union (
        cube ({size: [nema.side_size, nema.side_size, nema.len]}).setColor(0.3, 0.3, 1.0),
        cylinder ({r: nema.ring_r, h: nema.ring_h})
            .translate ([nema.side_size / 2, nema.side_size / 2, nema.len]),
        cylinder ({r: nema.shaft_r, h: nema.shaft_h})
            .translate ([nema.side_size / 2, nema.side_size / 2, nema.len + nema.ring_h])
    );
    if (base && base == "base mount")
        mesh = mesh.translate ([-nema.side_size / 2, -nema.side_size / 2, -nema.len]);
    return mesh;
}

function _bed(){
    var mesh = difference(
        cube({size:[_printableWidth/2,_printableDepth+30,3]}).setColor(0.8,0.8,0.4,0.5)

    );
    mesh.properties.clipbackleft = new CSG.Connector([0, _printableDepth, 0], [1, 0, 0], [0, 0, 1]);
    mesh.properties.clipbackright = new CSG.Connector([_printableWidth, _printableDepth, 0], [1, 0, 0], [0, 0, 1]);
    mesh.properties.clipfrontleft = new CSG.Connector([0,0, 0], [1, 0, 0], [0, 0, 1]);
    mesh.properties.clipfrontright = new CSG.Connector([_printableWidth,0, 0], [1, 0, 0], [0, 0, 1]);

    return mesh;
}









// -----------------------  lib
// generate screws 
function Mx(diam,length){
    return union(
        cylinder({r:diam/2+1,h:3,fn:_globalResolution}),
        cylinder({r:diam/2,h:length,fn:_globalResolution}).translate([0,0,3])
    )
}


function text3d(what){
    var l = vector_text(0,0,what);   
    var o = [];
    l.forEach(function(pl) {                   
        o.push(rectangular_extrude(pl, {w: 5, h: 2}));   
    });
    return union(o);
}

function tube(dint,dext,length){
    return difference(
        cylinder({r:dext/2,h:length,fn:_globalResolution}),
        cylinder({r:dint/2,h:length,fn:_globalResolution})
    );
}

function _axis(){
    var thickness = 0.2;
    return union(
        cube({size: [10, 0.2, thickness]}).setColor(1, 0, 0),
        cube({size: [thickness, 10, thickness]}).setColor(0, 1, 0),
        cube({size: [thickness, thickness, 10]}).setColor(0, 0, 1)
    );
}

function nemaHole() {
    var offset = nema.mount_dist;
    return union (
        cylinder ({r: nema.ring_r + Size.clr.free, h:40, fn: _globalResolution}),
        cylinder ({r: Size.m3.r, h:40, fn: _globalResolution})
            .translate ([-offset, -offset, 0]),
        cylinder ({r: Size.m3.r, h:40, fn: _globalResolution})
            .translate ([offset, -offset, 0]),
        cylinder ({r: Size.m3.r, h:40, fn: _globalResolution})
            .translate ([-offset, offset, 0]),
        cylinder ({r: Size.m3.r, h:40, fn: _globalResolution})
            .translate ([offset, offset, 0])
    );
}

// only 2 screw holes
function nemaHole2(){
    var offset = nema.mount_dist;
    return union(
        cylinder({r: nema.ring_r + Size.clr.free, h: 40, fn: _globalResolution}),
        cylinder({r: Size.m3.r, h: 40, fn: _globalResolution})
            .translate([-offset, -offset, 0]),
        cylinder({r: Size.m3.r, h: 40, fn: _globalResolution})
            .translate([-offset, offset, 0])
    );
}

function slottedHole(diam,length,height){
    return union(
        cylinder({r:diam/2,h:height,fn:_globalResolution}),
        cube([diam,length-diam,height]).translate([-diam/2,0,0]),
        cylinder({r:diam/2,h:height,fn:_globalResolution}).translate([0,length-diam,0])
    );
}

function bearingSupport(baseHeight){
    return difference(
        union(
            cylinder({r:5,h:baseHeight,fn:_globalResolution}),
            cylinder({r:4,h:6,fn:_globalResolution}).translate([0,0,baseHeight])
        ),
        cylinder({r:1.4,h:baseHeight+7,fn:_globalResolution})
    );
}

function bearingSupport2(baseHeight){
    return difference(
        union(
            cylinder({r:5,h:baseHeight,fn:_globalResolution}),
            cylinder({r:4,h:16,fn:_globalResolution}).translate([0,0,baseHeight])
        ),
        cylinder({r:1.4,h:baseHeight+16,fn:_globalResolution})
    );
}

function bearingTop(hole){
    return difference(
        union(
            cylinder({r:5,h:1,fn:_globalResolution}),
            cylinder({r:13,h:1.5,fn:_globalResolution}).translate([0,0,1])
        ),
        cylinder({r:hole/2+0.1,h:6,fn:_globalResolution})
    );
}

function bearingMiddle(hole){
    return difference(
        union(
            cylinder({r:5,h:1,fn:_globalResolution}),
            cylinder({r:13,h:1,fn:_globalResolution}).translate([0,0,1])
        ),
        cylinder({r:hole/2+0.1,h:6,fn:_globalResolution})
    );
}

function bearing608z(){
    return difference(
        cylinder({r: 11, h:7}).setColor(0.4,0.4,0.4),
        cylinder({r: 4, h:7})
    );
}

function Gt2Holder(boolOffset,height){
    var h = 10;
    var beltThickness = 0.9;
    if(height){h=height;}
    return difference(
        linear_extrude({height:10},polygon({points:[[0,0],[16,0],[12,h],[4,h]]})).translate([-12,0,-h]).rotateY(-90).rotateX(90),
        union(
            cube([10,1,h-3]).translate([h-10,boolOffset,3]),
            cube([1,1,h-3]).translate([h-9,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-7,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-5,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-3,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-1,boolOffset+beltThickness,3])

        )
    )
}

function Gt2HolderSuspendedRight(boolOffset,height){
    var h = 10;
    var beltThickness = 0.9;
    if(height){h=height;}
    return difference(
        linear_extrude({height:10},polygon({points:[[0,0],[12,-h],[16,0],[12,h],[4,h]]})).translate([-12,0,-h]).rotateY(-90).rotateX(90),
        union(
            cube([10,1,h-3]).translate([h-10,boolOffset,3]),
            cube([1,1,h-3]).translate([h-9,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-7,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-5,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-3,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-1,boolOffset+beltThickness,3])

        )
    )
}

function Gt2HolderSuspendedLeft(boolOffset,height){
    var h = 10;
    var beltThickness = 0.9;
    if(height){h=height;}
    return difference(
        linear_extrude({height:10},polygon({points:[[0,0],[4,-h],[16,0],[12,h],[4,h]]})).translate([-12,0,-h]).rotateY(-90).rotateX(90),
        union(
            cube([10,1,h-3]).translate([h-10,boolOffset,3]),
            cube([1,1,h-3]).translate([h-9,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-7,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-5,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-3,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-1,boolOffset+beltThickness,3])

        )
    )
}

function Gt2HolderBool(boolOffset,height){
    var h = 10;
    var beltThickness = 0.9;
    if(height){h=height;}
    return union(
        cube([10,1,h-3]).translate([h-10,boolOffset,3]),
        cube([1,1,h-3]).translate([h-9,boolOffset+beltThickness,3]),
        cube([1,1,h-3]).translate([h-7,boolOffset+beltThickness,3]),
        cube([1,1,h-3]).translate([h-5,boolOffset+beltThickness,3]),
        cube([1,1,h-3]).translate([h-3,boolOffset+beltThickness,3]),
        cube([1,1,h-3]).translate([h-1,boolOffset+beltThickness,3])
    )
}

function Gt2Holder3(boolOffset,height){
    var h = 10;
    if(height){h=height;}
    return difference(
        linear_extrude({height:10},polygon({points:[[0,0],[16,0],[12,h],[4,h]]})).translate([-12,0,-h]).rotateY(-90).rotateX(90),
        union(
            cube([10,1,h-3]).translate([h-10,boolOffset,6]),
            cube([1,1,h-3]).translate([h-9,boolOffset+1,6]),
            cube([1,1,h-3]).translate([h-7,boolOffset+1,6]),
            cube([1,1,h-3]).translate([h-5,boolOffset+1,6]),
            cube([1,1,h-3]).translate([h-3,boolOffset+1,6]),
            cube([1,1,h-3]).translate([h-1,boolOffset+1,6])

        )
    )
}
function Gt2Holder2(){
    var beltThickness = 0.9;
    return difference(

        linear_extrude({height:23},polygon({points:[[0,0],[16,0],[12,10],[4,10]]})).translate([-12,0,-10]).rotateY(-90).rotateX(90),
        union(
            cube([23,1,7]).translate([-13,3,3]),
            cube([1,1,7]).translate([-11,3+beltThickness,3]),
            cube([1,1,7]).translate([-9,3+beltThickness,3]),
            cube([1,1,7]).translate([-7,3+beltThickness,3]),
            cube([1,1,7]).translate([-5,3+beltThickness,3]),
            cube([1,1,7]).translate([-3,3+beltThickness,3]),
            cube([1,1,7]).translate([-1,3+beltThickness,3]),
            cube([1,1,7]).translate([1,3+beltThickness,3]),
            cube([1,1,7]).translate([3,3+beltThickness,3]),
            cube([1,1,7]).translate([5,3+beltThickness,3]),
            cube([1,1,7]).translate([7,3+beltThickness,3]),
            cube([1,1,7]).translate([9,3+beltThickness,3]),
            cube([1,1,7]).translate([11,3+beltThickness,3])

        )
    )
}

function endstop_meca(){
    return difference(
        cube([40,15,7]),
        cylinder({r:1.5,h:8,fn:_globalResolution}).translate([2.5,2.5,0]),
        cylinder({r:1.5,h:8,fn:_globalResolution}).translate([2.5+14,2.5,0]),
        cylinder({r:1.5,h:8,fn:_globalResolution}).translate([40-2.5,2.5,0])

    );
}

function roundBoolean(diam,w,d,h,edge){
    var bool;
    if(edge=="bl"){bool = cylinder({r:diam/2,h:d,fn:_globalResolution}).rotateX(-90).translate([0,0,0]);}
    if(edge=="tl"){bool = cylinder({r:diam/2,h:d,fn:_globalResolution}).rotateX(-90).translate([0,0,h]);}
    if(edge=="br"){bool = cylinder({r:diam/2,h:d,fn:_globalResolution}).rotateX(-90).translate([w,0,0]);}
    if(edge=="tr"){bool = cylinder({r:diam/2,h:d,fn:_globalResolution}).rotateX(-90).translate([w,0,h]);}
    return difference(
        cube([w,d,h]),
        bool
    );
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
        cylinder ({r: diam, h: length})
            .rotateX(-90)
            .translate (tr)
    );
}

// align parts so they are on z=0 and no touching
function makeplate(parts){
    var deltaX = 5;
    var deltaY = 5;
    var oldbox;
    var i;
    var currentX = -100;
    var currentY = -100;
    var nextY = 0;
    var maxX = 100;
    var maxY = 100;
    var currentPlate = 0;
    for(i =0;i < parts.length;i++){
        var box = parts[i].getBounds();
        var nextX = currentX + (box[1].x-box[0].x)+deltaX;
        if(nextX > maxX){
            currentX = -100;
            currentY = currentY + nextY + deltaY;
            nextY = 0;
        }
        
        parts[i] = parts[i].translate([currentX-box[0].x+deltaX,currentY-box[0].y+deltaY,-box[0].z]);
        currentX = currentX + (box[1].x-box[0].x)+deltaX ;
        nextY = Math.max(nextY,(box[1].y-box[0].y));
    }
    return parts;
}




function read_nums(s) {
    // Split it up into numbers and spaces
    var array = s.split(/(\d+)/);

    // Keep just the numbers
    array = array.filter(function(i) {return "" + +i == i});

    // Convert back to a number
    array = array.map(function(i) {return +i});
    return array; 
}



// -----------------------  start here 

function main(params) {

    // -------- sandbox ------- 
    //return _walls();
    //var infos = document.getElementById("dimensionsInfos");
    //infos.innerHTML = "hello there";


    // assign globals from interface parameters
    _printableWidth=params._printableWidth; 
    _printableHeight=params._printableHeight; 
    _printableDepth=params._printableDepth; 
    _wallThickness=params._wallThickness; 
    _XYrodsDiam = params._XYrodsDiam;
    _ZrodsDiam = params._ZrodsDiam;
    _globalResolution = params._globalResolution;

    if (params._nemaXYZ == "nema17")
        nema = nema17;
    else if (params._nemaXYZ == "nema14")
        nema = nema14;

    _nemaXYZ = nema.side_size;

    var pos = read_nums (params._position);
    if (pos.length > 0) _position.x = pos[0];
    if (pos.length > 1) _position.y = pos[1];
    if (pos.length > 2) _position.z = pos[2];
    
    output=parseInt(params._output); 
    _ZrodsOption=parseInt(params._ZrodsOption);
    //_extrusionType = params.extrusionType;
    _extrusionType = 1;
    // update calculated values 
    if(_XYrodsDiam==6){ _XYlmDiam = 12;}
    if(_XYrodsDiam==8){ _XYlmDiam = 15;}
    if(_ZrodsDiam==6){ _ZlmDiam = 12;}
    if(_ZrodsDiam==8){ _ZlmDiam = 15;}
    if(_ZrodsDiam==10){ _ZlmDiam = 19;}
    if(_ZrodsDiam==12){ _ZlmDiam = 21;}

    Size.gt2_pulley = gt2_pulley_16; // TODO add 20 toothed pulley

    
    _globalDepth = _printableDepth + 110; // = motor support depth + bearings depth + head depth /2
    _globalWidth = _printableWidth + 165; // = motor uspport width + bearings width + head width /2
    _globalHeight = _printableHeight + 140; // bottom = 40mm head = 40 mm + extra loose.

    XrodLength = _printableWidth + 55; // 40: slideY width , 3: offset slideY from wall.
    if (_ZrodsOption === 0) {
        ZrodLength = _printableHeight + 110;
    }
    else {
        ZrodLength = _printableHeight + 110;
    }


    echo("wood depth:"+_globalDepth + " width:"+_globalWidth+" height:"+_globalHeight);
    echo("X rod length:"+XrodLength + " Y rod length:"+YrodLength+" Zrodlength:"+ZrodLength);
    // calculate some usefull vars
    var ztopbottomX = (_ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2))/2;
    var zslideX = (_ZrodsWidth+_ZlmDiam+(_rodsSupportThickness*2))/2;

    // Make final dimensions calculation
    Size.calc ();
    carriage_y = new Carriage_y ();

    // TODO put this inside `Size.calc ()'
    YrodLength = _printableDepth + Size.y.lmuu.l * 2 + Size.rod_y_nema_overlap * 2 + 1;
    XrodLength = _printableWidth + carriage_y.body_l + Size.rod_x_car_overlap;
    
    var res=null;


    switch(output){
    case 0:
        res = [
            _axis ().translate ([-40, -40, 0]),
            carriage_y.mesh ().translate ([80, 0, 0]),
            bearingsXY ()
//            slideY ("bearing left lmuu"),
        ];
        break;

    case 1:
    case 101:        
        res = [
            output == 1 ? _walls() : cube([0,0,0]),
            _rods(),
            
            //nema left
            _nema().translate([-_globalWidth/2,-_globalDepth/2,_globalHeight-_nemaXYZ-20]),
            // nema right
            _nema().translate([_globalWidth/2-_nemaXYZ,-_globalDepth/2,_globalHeight-_nemaXYZ-20]),

            motorXY().translate([-_globalWidth/2,-_globalDepth/2,_globalHeight-20]),
            motorXY().mirroredX().translate([_globalWidth/2,-_globalDepth/2,_globalHeight-20]),
            bearingsXY().rotateZ(-90).translate([-_globalWidth/2+28,_globalDepth/2+_wallThickness+5,_globalHeight-17]),
            bearingsXY().mirroredX().rotateZ(90).translate([_globalWidth/2-28,_globalDepth/2+_wallThickness+5,_globalHeight-17]),
            slideY("left").translate([-_globalWidth/2+6,XaxisOffset,_globalHeight-22]),
            slideY("right").mirroredX().translate([_globalWidth/2-6,XaxisOffset,_globalHeight-22]),
            //endstop x
            endstop_meca().rotateZ(90).rotateX(-90).translate([-_globalWidth/2+56,XaxisOffset+18,_globalHeight-9]),
            //endstop y
            endstop_meca().rotateY(-90).translate([-_globalWidth/2+43,XaxisOffset-15,_globalHeight-52]).setColor(0.2,0.2,0.2),
            
            headLeft().translate([headoffset,XaxisOffset,_globalHeight-28]),
            headRight().translate([headoffset+32,XaxisOffset,_globalHeight-28])
        ];
        
        // Z stage 
        if (_ZrodsOption > 0) { 
            
            zres = new Array();                    
            zres.push(_nema().rotateX(0).translate([-_nemaXYZ/2,_globalDepth/2-_nemaXYZ-1,0]));
            zres.push(zTop().translate([0,_globalDepth/2-_wallThickness,_globalHeight-35]));
            zres.push(zBottom().translate([0,_globalDepth/2-_wallThickness,_nemaXYZ+4]));                    
            zres.push(slideZ2().translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-4,_globalHeight/2-30]));        
            zres.push(_bed().translate([-_printableWidth/4,-_printableDepth/2,_globalHeight/2+10]));                    
            
            if (_ZrodsOption===1) {
                res.push(union(zres));
            } else if (_ZrodsOption===2) {                    
                res.push(union(zres).rotateZ(90).translate([-_globalWidth/2+_globalDepth/2,0,0]));
                res.push(union(zres).rotateZ(-90).translate([_globalWidth/2-_globalDepth/2,0,0]));
            }
            
        } else {
            res.push(_nema().rotateX(-90).translate([-_nemaXYZ/2,_globalDepth/2-_wallThickness-_nemaXYZ-20,_nemaXYZ]));
            res.push(zTop().translate([0,_globalDepth/2-_wallThickness,_globalHeight-35]));
            res.push(zBottom().translate([0,_globalDepth/2-_wallThickness,_zBottomHeight / 2]));

            //res.push(slideZ().translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-40]));
            //res.push(slideZ().translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-10]));
            //res.push(slideZsupport().translate([-_ZrodsWidth/2-_ZlmDiam/2-14-7,_globalDepth/2-_wallThickness-68,_globalHeight/2-45]));
            //res.push(slideZsupport().translate([_ZrodsWidth/2+_ZlmDiam/2+14,_globalDepth/2-_wallThickness-68,_globalHeight/2-45]));
            
            res.push(slideZ2().translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-30]));
            
            res.push(_bed().translate([-_printableWidth/4,-_printableDepth/2,_globalHeight/2+10]));
            
        }
        
        //bowden
        if(_extrusionType==1){
            //res.push(JheadAttach().translate([headoffset-12,XaxisOffset-17,_globalHeight+6]));
            res.push(HeadSupportJhead().rotateZ(180).translate([headoffset+44,XaxisOffset,_globalHeight-14]));
            res.push(fakeJhead().translate([headoffset+23,XaxisOffset-15,_globalHeight-32]).setColor(0.2,0.2,0.2));
            // fake inductive sensor
            res.push(cylinder({r:9,h:70,fn:_globalResolution}).translate([headoffset+57,XaxisOffset-25,_globalHeight-40]).setColor(0.2,0.2,0.2));
            res.push(InductiveSensorSupport().translate([headoffset+2,XaxisOffset-30,_globalHeight+13]));
            
            // nema extruder
            res.push(_nema().rotateX(90).translate([_globalWidth/2+_wallThickness+5,-_globalDepth/2+_nemaXYZ+55,_globalHeight-_nemaXYZ-25]));
            res.push(extruder(_extrusionType).rotateX(90).translate([_globalWidth/2+_wallThickness+26,-_globalDepth/2+60,_globalHeight-50]));

        }
        // direct
        if(_extrusionType==0){
            res.push(InductiveSensorSupport().translate([headoffset+6,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+57,_globalHeight-28]));
            // nema extruder
            res.push(_nema().rotateX(-90).translate([headoffset+2,XaxisOffset,_globalHeight+50]));
            res.push(extruder(_extrusionType).rotateX(-90).translate([headoffset+22,XaxisOffset+47,_globalHeight+30]));
        }
        break;

    case 102:
        var pos = {
            x: _position.x,
            y: {
                // Y coordinate of carriage y
                car_y: -_globalDepth / 2 + nema.side_size + _position.y +
                    carriage_y.lmuu_extra,
            },
            z: _position.z
        };
        // Y coordinate of X rods.
        pos.y.rod_x  = pos.y.car_y + carriage_y.lmuu_support_extra +
            carriage_y.body_width / 2;

        // Belt segments
        var belt1_len = [0];
        belt1_len[1] = pos.y.rod_x - (-_globalDepth / 2 + nema.side_size / 2);
        
        
        // Motor connected to mount.
        var motor_and_mount = union (
            motor_mount.mesh (),
            nema.mesh ()
                .translate ([nema.side_size / 2, nema.side_size / 2, 0])
        );

        // Left motor + mount + thoothed pulley
        var left_motor_and_mount = union (
            motor_and_mount,
            Size.gt2_pulley.mesh ("belt")
                .translate ([nema.side_size / 2, nema.side_size / 2, dist.z.belt1])
        );
            
        // Right motor + mount + thoothed pulley
        var right_motor_and_mount = union (
            motor_and_mount,
            Size.gt2_pulley.mesh ("belt")
                .translate ([nema.side_size / 2, nema.side_size / 2, dist.z.belt2])
        ).mirroredX ();
        
        res = [
            rods_y (),
            rods_x (pos.y.rod_x),
            //nema left
            left_motor_and_mount
                .translate ([-_globalWidth/2, -_globalDepth / 2, 0]),
            // nema right
            right_motor_and_mount
                .translate ([_globalWidth / 2, -_globalDepth / 2, 0]),
            belt.mesh (belt1_len[1])
                .rotateZ (90)
                .translate([-_globalWidth / 2 + nema.side_size / 2 + Size.gt2_pulley.belt_ro,
                            -_globalDepth / 2 + nema.side_size / 2,
                            dist.z.belt1]),
            slideY ("bearings lmuu debug")
                .translate ([-_globalWidth / 2 + Size.rod_y_wall_dist,
                             pos.y.car_y,
                             Size.z.rod.r]),
            slideY ("bearings lmuu debug")
                .translate ([-_globalWidth / 2 + Size.rod_y_wall_dist,
                             pos.y.car_y,
                             Size.z.rod.r])
                .mirroredX (),
            
            bearingsXY ()
                .rotateZ (-90)
                .translate ([-_globalWidth / 2 + 28,
                             _globalDepth / 2 + _wallThickness + 5,
                            0]),
/*            
            bearingsXY()
                .mirroredX()
                .rotateZ(90)
                .translate([_globalWidth/2-28,_globalDepth/2+_wallThickness+5,_globalHeight-17]),
            slideY("left").translate([-_globalWidth/2+6,XaxisOffset,_globalHeight-22]),
            slideY("right").mirroredX().translate([_globalWidth/2-6,XaxisOffset,_globalHeight-22]),
            //endstop x
            endstop_meca().rotateZ(90).rotateX(-90).translate([-_globalWidth/2+56,XaxisOffset+18,_globalHeight-9]),
            //endstop y
            endstop_meca().rotateY(-90).translate([-_globalWidth/2+43,XaxisOffset-15,_globalHeight-52]).setColor(0.2,0.2,0.2),
            
            headLeft().translate([headoffset,XaxisOffset,_globalHeight-28]),
            headRight().translate([headoffset+32,XaxisOffset,_globalHeight-28])
            */
        ];
        break;

    case 2:
        res = [
            motorXY().rotateX(-90),
            motorXY().mirroredX().rotateX(-90),

            bearingsXY().rotateX(-90),
            bearingsXY().mirroredX().rotateX(-90),

            slideY("left").rotateX(-90),
            slideY("right").mirroredX().rotateX(-90),

            headLeft().rotateY(-90),
            headRight().rotateY(90),

            zTop(),
            zBottom(),
            slideZ2().rotateX(180)
        ];
        //bowden
        
        if(_extrusionType==1){
            res.push(InductiveSensorSupport().rotateX(180));
            res.push(HeadSupportJhead().rotateX(90));
            // nema extruder
            res.push(extruder(_extrusionType,0));
            res.push(extruder(_extrusionType,1).rotateX(180));
        }
        // direct
        if(_extrusionType==0){
            res.push(InductiveSensorSupport());
            // nema extruder
            res.push(extruder(_extrusionType,0));
            res.push(extruder(_extrusionType,1).rotateX(180));
        }
        res = makeplate(res);
        break;

    case 3:
        res = [
            motorXY().translate([-_globalWidth/2,-_globalDepth/2,_globalHeight-20]),
            motorXY().mirroredX().translate([_globalWidth/2,-_globalDepth/2,_globalHeight-20]),
            bearingsXY().rotateZ(-90).translate([-_globalWidth/2+_wallThickness+18,_globalDepth/2+_wallThickness+5,_globalHeight-17]),
            bearingsXY().mirroredX().rotateZ(90).translate([_globalWidth/2-_wallThickness-18,_globalDepth/2+_wallThickness+5,_globalHeight-17]),
            slideY().translate([-_globalWidth/2+4,XaxisOffset,_globalHeight-22]),
            slideY().mirroredX().translate([_globalWidth/2-4,XaxisOffset,_globalHeight-22]),

            
            headLeft().translate([headoffset,XaxisOffset,_globalHeight-26]),
            headRight().translate([headoffset+32,XaxisOffset,_globalHeight-26]),
            // Z stage 
            zTop().translate([0,_globalDepth/2-_wallThickness-5,_globalHeight-35]),
            zBottom().translate([0,_globalDepth/2-_wallThickness,_wallThickness]),
            
            slideZ2().translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-4,_globalHeight/2-30]),

        ];

        //bowden
        if(_extrusionType == 1) {
            //res.push(JheadAttach().translate([headoffset-12,XaxisOffset-17,_globalHeight+6]));
            res.push (HeadSupportJhead()
                      .rotateZ(180)
                      .translate([headoffset + 44, XaxisOffset, _globalHeight - 14]));
            res.push (InductiveSensorSupport()
                      .translate([headoffset + 2, XaxisOffset - 30, _globalHeight + 13]));

            res.push(extruder(_extrusionType).rotateX(90).translate([_globalWidth/2+_wallThickness+26,-_globalDepth/2+60,_globalHeight-50]));

        }
        // direct
        if(_extrusionType == 0) {
            res.push (InductiveSensorSupport()
                      .translate ([headoffset+6,
                                   -(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+57,
                                   _globalHeight-28]));
            res.push (extruder(_extrusionType)
                      .rotateX(-90)
                      .translate([headoffset+22,XaxisOffset+47,_globalHeight+30]));
        }
        break;

    case 4:
        res = [
            wallSizeText(),
            _walls(),
            rodsLengthText(),
            _rods()
        ];
        break;

    case 5:
        res = [motorXY()];
        break;

    case 6:
        res = [bearingsXY()];
        break;

    case 7:
        res = [slideY()];
        break;

    case 8:
        res = [zTop()];
        break;

    case 9:
        res = zBottom();
        break;

    case 10:
        res = [
            slideZ2()
            //slideZsupport().translate([40,0,0]),
            //extraSupportBed().translate([0,-50,0])
            /*slideZ2().translate([_ZrodsWidth/2-1,_globalDepth/2-_wallThickness-70,_globalHeight/2-40]),
              slideZBearingsSupport().mirroredX().translate([_ZrodsWidth/2-2,_globalDepth/2-_wallThickness-15,_globalHeight/2-40]),
              slideZ2().mirroredX().translate([-_ZrodsWidth/2+1,_globalDepth/2-_wallThickness-70,_globalHeight/2-40]),
              slideZBearingsSupport().translate([-_ZrodsWidth/2+2,_globalDepth/2-_wallThickness-15,_globalHeight/2-40]),
              slideZBeltAttach().translate([-_ZrodsWidth/2+13,_globalDepth/2-_wallThickness-15,_globalHeight/2-40])*/
        ];
        break;

    case 11:
        res = [headLeft(),headRight().translate([0,60,0])];
        break;

    case 12:
        res = [
            extruder(_extrusionType,0),
            extruder(_extrusionType,1).rotateX(180).translate([60,0,0])
        ];
        break;
        
    default:
        break;
    }

    return res;
}


