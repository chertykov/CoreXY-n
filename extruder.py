# CoreXY printer - X carriage.
#
# Copyright (C) 2015 Denis Chertykov
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 3, or (at your option)
# any later version.

import sys
import math
from solid import *
from solid.utils import * # Not required, but the utils module is useful

from parts import Belt
from parts import Const_size as Size
from parts import Lm8uu
from parts import Carriage
from parts import Nema17
from parts import Bearing
from parts import Mk8_gear

motor = Nema17()
hob_groove_h = 11   # distance from motor base to hobbed pulley groove

bearing = Bearing(di = 3, do = 10, h = 4)     # 623
#bearing = Bearing(4, 13, 5)                   # 624
#bearing = Bearing(5, 16, 5)                   # 625


class Spring:
    d_o = 6.1                   # Outer diametr
    d_i = 4.2                   # Inner diametr
    l = 15.0                    # Length
    work_l = 11                 # Compressed length. Working length.
        
class Extruder_shaft:
    d_o = 8                      # diametr of lever shaft
    head_d_o = d_o + 2
    segs = 128

    def __init__(self, h):
        self.h = h
        self.head_h = Size.m3_head_h + 1

    def report(self):
        sys.stderr.write("Shaft H: %g head H: %g head D: %g\n"
                         % (self.h, self.head_h, self.head_d_o))

    def draw(self, debug=False, print_=False):
        shaft_h = self.h - self.head_h
        # head
        d = cylinder (d = self.head_d_o, h = self.head_h, segments = self.segs)
        # shaft
        d += cylinder (d = self.d_o, h = self.h, segments = self.segs)
        # m3 hole
        d -= cylinder (r = Size.m3_r, h = self.h + 1, segments=8)
        # m3 head hole
        d -= (down (1)
              (cylinder (r = Size.m3_head_r, h = Size.m3_head_h + 1, segments=16)))

        # support
        if print_:
            d += up (self.head_h - 1) (cylinder (d=self.head_d_o, h = 0.2))

        if not print_:
            d = up(self.h) (mirror ([0,0,1])(d))
        
        # Look inside
        if (debug):
            d -= down (1) (cube ([50,50,50]))
        
        return d

class Extruder_base:
    base_h = 4.2                  # base thickness
    support_wall = 2.0
    round_d = motor.side_size - motor.mount_dist # round of plate corners

    def __init__(self, groove_h, lever):
        self.filament_dist = groove_h # Distance from filament to motor base.

        self.shaft_hous_h = groove_h - lever.h / 2.0

        if self.shaft_hous_h < self.base_h + 0.2:
            sys.stderr.write ("Too low 'groove_h' parameter.\n")
            sys.exit(1)
            
        self.lever = lever
        self.spring_x = self.lever.spring_offset_x
        self.spring_y = self.lever.spring_offset_y
        self.spring_z = groove_h
    

    def report(self):
        m3_len = self.lever.shaft.h - Size.m3_head_h + self.shaft_hous_h
        sys.stderr.write("Base shaft H: %g  M3 length: %g\n"
                         % (self.shaft_hous_h, m3_len))
    def draw(self):
        c = cylinder (d = self.lever.shaft_hous_d, h = self.base_h)
        m1 = translate ([-motor.mount_dist / 2.0, motor.mount_dist / 2.0, 0]) (c)
        c = cylinder (d = self.round_d, h = self.base_h)
        m2 = translate ([motor.mount_dist / 2.0, motor.mount_dist / 2.0, 0]) (c)
        d = hull () (m2, m1)
        c1 = cylinder (d = self.lever.shaft_hous_d, h = self.shaft_hous_h)
        d += translate ([-motor.mount_dist / 2.0, motor.mount_dist / 2.0, 0]) (c1)

        p = cube ([motor.side_size / 2.0, motor.side_size / 2.0, self.base_h])
        base_min_y = motor.mount_dist / 2 - 9
        p = back (base_min_y) (p)
        d += p
        d -= cylinder (r = motor.round_extrusion_r + 1, h = self.base_h * 3, center=True)

        # spring support
        ss_x = self.support_wall * 2 + Spring.d_o + 1
        ss_y = motor.mount_dist / 2.0 - self.lever.shaft_hous_d / 2.0
        ss_z = self.shaft_hous_h + self.lever.h
        ss_base = (back (base_min_y)
                   (right (self.spring_x - ss_x / 2.0)
                    (cube([ss_x, ss_y, self.base_h]))))

        ss_head = (back (base_min_y)
                   (right (self.spring_x)
                    (up (self.shaft_hous_h + self.lever.h / 2.0)
                     (rotate ([-90, 0, 0])
                      (cylinder (d = ss_x, h = ss_y))))))

        # support jib
        jib_offset_x = -self.support_wall / 2.0 + ss_x / 2.0

        jibs = up(0)
        for offset in [-jib_offset_x, jib_offset_x]:
            jib1 = (translate ([self.spring_x - offset,
                                ss_y - self.support_wall / 2.0,
                                0])
                    (cylinder (d = self.support_wall, h = self.base_h, segments=16)))
            jib2 = (right (self.spring_x - offset)
                    (cylinder (d = self.support_wall, h = self.spring_z, segments=16)))
            jibs += hull () (jib1 + jib2)

        
        d += hull () (ss_base, m2) + hull () (ss_base, ss_head) # + jibs

        # Spring housing
        spr_d = Spring.d_o + 0.6
        spr = (rotate ([90,0,0])
               (cylinder (d = spr_d, h = Spring.work_l)))
        spr = (translate ([self.spring_x, self.spring_y, self.spring_z])
               (spr))
        d -= spr
        d -= cylinder (r = motor.round_extrusion_r + 1, h = 4, center=True)
        
        # Mount holes
        hole = cylinder (r = Size.m3_r, h = self.shaft_hous_h + 2, segments=16)
        for n in [1,-1]:
            d -= (translate ([n * motor.mount_dist / 2.0, motor.mount_dist / 2.0, -1])
                  (hole))

        d -= (translate ([ motor.mount_dist / 2.0,
                           motor.mount_dist / 2.0,
                           self.base_h - Size.m3_head_h])
              (cylinder (r = Size.m3_head_r, h = self.base_h)))
            
        return d 

class Extruder_lever:
    clr = 0.2                  # Diametr clearance
    handle_extra_l = 15.0
    finger_d = 20.0
    h = bearing.h + 1.0 + 3 * 2
    
    def __init__(self, shaft, gear):
        self.shaft = shaft
        self.shaft_hous_d = self.shaft.head_d_o + 2 + 2 * self.clr
        self.bearing_hous_d = bearing.d_o + 4
        self.spring_offset_x = motor.mount_dist / 2.0
        self.spring_offset_y = motor.mount_dist / 2.0 - self.shaft_hous_d / 2.0 + 2
        self.gear = gear

    def report(self):
        self.shaft.report ()
        sys.stderr.write("Lever H: %g shaft housing D: %g bearing housing D: %g\n"
                         % (self.h, self.shaft_hous_d, self.bearing_hous_d))

    def draw(self):
        # Bearing housing
        bearing_offset = self.gear.d_groove / 2 + bearing.d_o / 2 + Size.filament_d
        bearing_hous = cylinder (d = self.bearing_hous_d, h = self.h)
        bearing_hous += (back (self.bearing_hous_d / 2)
                         (cube ([self.bearing_hous_d, self.bearing_hous_d, self.h])))
        bearing_hous = (left (bearing_offset)
                        (bearing_hous))

        # Shaft housing
        shaft_hous = (translate ([-motor.mount_dist / 2, motor.mount_dist / 2, 0])
                      (cylinder (d = self.shaft_hous_d, h = self.h)))
        
        # arm
        arm = (translate ([motor.mount_dist / 2.0 + self.handle_extra_l,
                          motor.mount_dist / 2.0 - self.shaft_hous_d / 4.0,
                          0])
               (cylinder (d = self.shaft_hous_d / 2.0, h = self.h, segments=16)
                + (forward (1)
                   (cylinder (d = self.shaft_hous_d / 2.0, h = self.h, segments=16)))))

        # Cut off finger place
        fp = (translate ([motor.mount_dist / 2 + self.handle_extra_l / 3 * 2.0,
                           motor.mount_dist / 2 + self.finger_d / 2,
                           -0.5])
               (cylinder (d = self.finger_d, h = self.h + 1)))

        arm = hull () (shaft_hous + arm) - fp + arm
        
        d = hull () (shaft_hous, bearing_hous) + arm

        # Shaft hole
        # head
        shft = (up (self.h - self.shaft.head_h)
                (cylinder (d = self.shaft.head_d_o + self.clr,
                           h = self.shaft.head_h + 1,
                           segments = self.shaft.segs)))
        # shaft
        shft += (down (1)
                 (cylinder (d = self.shaft.d_o + self.clr,
                            h = self.h + 2,
                            segments = self.shaft.segs)))
        d -= (translate ([-motor.mount_dist / 2, motor.mount_dist / 2, 0])
              (shft))
        # Idler bearing housing
        bhh = bearing.h + Size.m3_washer_h * 2
        ibh =  cylinder (d = bearing.d_o + 2, h = bhh)
        ibh += (back ((bearing.d_o + 2) / 2.0)
                (cube ([bearing.d_o, bearing.d_o + 2, bhh])))
        ibh -= cylinder (d = bearing.d_i + 4, h = Size.m3_washer_h)
        ibh = up (self.h / 2 - bhh / 2.0) (ibh)
        d -= left (bearing_offset) (ibh)

        ibc = cube ([bearing_offset * 2 - bearing.d_o + 2,
                     motor.mount_dist - self.shaft_hous_d,
                     self.h * 3],
                    center=True)
        d -= ibc

        # arm-bearing jib
        jib_r = bearing.d_o / 2 + 1
        jib = cylinder (r = jib_r, h = self.h, segments=4)
        jib -= (translate ([-jib_r / 2, jib_r/2, -1])
                (cylinder (r = jib_r + 1, h = self.h + 2, segments=4)))
        jib = (translate ([-bearing_offset + bearing.d_o / 2 - 1,
                           jib_r * 2,
                           0])
               (jib))

        d += jib
        
        # Idler bearing screw-shaft hole
        d -= (left (bearing_offset)
              (cylinder (r = Size.m3_screw_r, h = self.h * 3, center=True, segments=8)
               + (up (self.h - 2)
                  (cylinder (r = Size.m3_head_r + self.clr, h = self.h)))))
        # Support
        d += (left (bearing_offset)
              (up (bhh / 2.0 + self.h / 2.0)
               (cylinder (r = Size.m3_head_r, h = 0.2))))

        # Filament path
        filament_path_d = Size.filament_d + 1
        filament_offset = Size.filament_d / 2.0 + self.gear.d_groove / 2.0

        fil = forward (50) (rotate ([90, 0, 0])
                            (cube ([filament_path_d, filament_path_d, 100], center=True)))

        fil = hull () (fil, rotate (7, UP_VEC) (fil))
                 
        d -= (up (self.h / 2)
              (left (filament_offset)
               (fil)))

        # Spring housing
        spr_d = Spring.d_o + 0.6
        spr = (rotate ([90,0,0])
               (cylinder (d = spr_d, h = Spring.work_l)))
        spr = (translate ([self.spring_offset_x, self.spring_offset_y, self.h / 2.0])
               (spr))
        d -= debug(spr)

        
        # 
        
        # DEBUG
        d += left (bearing_offset) (up (self.h / 2.0) (background (bearing.draw())))
#        d += down (5) (background (motor.draw()))
        d += (down (self.gear.h_groove - self.h / 2.0)
              (self.gear.draw().set_modifier ('%')))
        d += background(left (filament_offset)
                        (up (self.h / 2.0)
                         (rotate ([90, 0, 0])
                          (cylinder (d = Size.filament_d, h = 50, center=True,
                                    segments = 16)))))

        return d

                      
        
class Extruder:
    
    pass

if __name__ == "__main__":        
    shaft = Extruder_shaft (Extruder_lever.h + 0.2)
    mk8 = Mk8_gear()
    draw = up (0)
    #draw = ex.draw_base (look_inside=False)
    #draw += ex.draw_lever (look_inside=False)
#    draw = ex.draw()
#    draw += left (20) (mk8.draw())

    lever = Extruder_lever(shaft, mk8)
    lever.report ()

    base = Extruder_base (hob_groove_h, lever)
    base.report ()
    
    draw += base.draw ()

    draw = (lever.draw() + shaft.draw(print_=True)
            + down (base.shaft_hous_h) (base.draw ()))

    #    draw += down (base.shaft_hous_h) (background (motor.draw()))

    #draw = base.draw () + shaft.draw(print_=True)
    draw = (lever.draw())
    print scad_render(draw)
