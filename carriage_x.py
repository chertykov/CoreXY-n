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
from parts import Const_size
from parts import Lm8uu
from parts import Carriage
from parts import Nema17

class Carriage_x (Carriage):
    nema17_offset = 4.0         # aprox. offset center of gravity
    nema17_plate_thickness = 3.0
    lm8uu_clr = 0.1
    nema17_clr = 1.5              # clearence between motor and carriage
    l = int(Nema17.side_size) + nema17_clr * 2 + 8 * 2
    base = (Lm8uu.r_o + nema17_clr) * 2 + int(Nema17.side_size)
    h = base + Lm8uu.r_o * 2 + 2 * 2
    w = Lm8uu.r_o + 1 + 5
    support_w = Const_size.support_line_width # support line width
    
    def draw (self, draw_support = False, draw_motor=False, look_inside=False):
        # base plate
        d = cube([self.l, self.w, self.h], center=True)
        # motor seat
        d -= cube([Nema17.side_size + self.nema17_clr,
                   self.w + 1,
                   Nema17.side_size + self.nema17_clr],
                  center=True)
        # shift to working position
        d = back(self.w / 2.0) (d)

        lm8_seat = (rotate ([0, 90, 0])
                    (cylinder (r = Lm8uu.r_o + self.lm8uu_clr,
                              h = self.l + 1,
                              center=True)))
        # lm8uu seat borders
        fix_l = 1.5 + self.lm8uu_clr
        fix_h = 1
        lm8_fix = cube ([Lm8uu.l + fix_l * 2, fix_h * 2 + 0.1, Lm8uu.r_o * 2],
                        center=True)
        lm8_fix -= cube ([Lm8uu.l + self.lm8uu_clr * 2, fix_h * 2 + 1, Lm8uu.r_o * 2 + 1],
                         center=True)
        lm8_fix = back (Lm8uu.r_o - fix_h) (lm8_fix)

        # upper lm8uu seats
        d -= up (self.base / 2.0) (lm8_seat)
        d += (up (self.base / 2.0)
              (left (self.l / 2.0 - (Lm8uu.l + fix_l * 2) / 2.0 ) (lm8_fix)
               + (right (self.l / 2.0 - (Lm8uu.l + fix_l * 2) / 2.0 ) (lm8_fix))))

    
        # lower lm8uu seats
        d -= up (-self.base / 2.0) (lm8_seat)
        d += (up (-self.base / 2.0)
              (left (self.l / 2.0 - (Lm8uu.l + fix_l * 2) / 2.0) (lm8_fix)
               + (right (self.l / 2.0 - (Lm8uu.l + fix_l * 2) / 2.0) (lm8_fix))))

        # zip channels
        zip_r_i = Lm8uu.r_o + self.lm8uu_clr + 1.5
        zip_r_o = zip_r_i + 2
        zip_w = 4
        z = cylinder(r = zip_r_o, h = zip_w, center=True)
        z -= cylinder(r = zip_r_i, h = zip_w + 1, center=True)
        z = rotate ([0, 90, 0]) (z)
        z = (left (Lm8uu.l / 2.0 - 1 - zip_w / 2.0) (z)
             + right (Lm8uu.l / 2.0 - 1 - zip_w / 2.0) (z))
        # upper channels
        d -= (up (self.base / 2.0)
              (left (self.l / 2.0 - (Lm8uu.l + fix_l * 2) / 2.0) (z)
               + (right (self.l / 2.0 - (Lm8uu.l + fix_l * 2) / 2.0) (z))))
        # lower channels
        d -= (down (self.base / 2.0)
              (left (self.l / 2.0 - (Lm8uu.l + fix_l * 2) / 2.0) (z)
               + (right (self.l / 2.0 - (Lm8uu.l + fix_l * 2) / 2.0) (z))))

        # Stepper home
        home_y = Nema17.length / 2.0 - self.nema17_offset

        c1 = cube ([Nema17.side_size + self.nema17_clr + self.nema17_plate_thickness * 2,
                    self.nema17_plate_thickness,
                    Nema17.side_size + self.nema17_clr + self.nema17_plate_thickness * 2],
                   center = True)
        c2 = cube ([Nema17.side_size + self.nema17_clr + self.nema17_plate_thickness * 2,
                    self.nema17_plate_thickness,
                    Nema17.side_size + self.nema17_clr + self.nema17_plate_thickness * 2],
                   center = True)
        c2 = forward (home_y - self.w + self.nema17_plate_thickness) (c2)

        c_hull = hull () (c1, c2)
        # motor home
        c_hull -= cube ([Nema17.side_size + self.nema17_clr,
                         50,
                         Nema17.side_size + self.nema17_clr],
                        center=True)
        c1 += c_hull
        
        c1 -= (rotate ([90, 0, 0])
               (cylinder (r = (Nema17.mount_dist / 2
                               + Const_size.m3_wall
                               - Const_size.m3_r),
                          h = self.nema17_plate_thickness + 1,
                          center=True)))
        mount_hole = (translate ([-Nema17.mount_dist / 2, 0, -Nema17.mount_dist / 2])
                     (rotate ([90, 0, 0])
                      (cylinder (r = Const_size.m3_r,
                                 h = self.nema17_plate_thickness + 100,
                                 center = True, segments = 24))))
        for a in [0, 90, 180, 270]:
            c1 -= rotate ([0, a, 0]) (mount_hole)

                        
        c1 = back (self.nema17_plate_thickness / 2.0) (c1)
        
        d+= back (home_y) (c1)

        # support
        if draw_support != False:
            for n in [0, self.support_w * 2 + 0.3]:
                sup_h = home_y - self.w + self.nema17_plate_thickness
                support = cube([self.l - n, sup_h, self.h - n], center=True)
                support -= cube([self.l - self.support_w * 2 - n,
                                 sup_h + 1,
                                 self.h - self.support_w * 2 - n],
                                center=True)
                support = (back(home_y + self.nema17_plate_thickness - sup_h / 2.0)
                           (support))
                d += support
            # Brim
            brim = cube([self.l + Const_size.support_brim_width * 2,
                         Const_size.support_brim_height,
                         self.h + Const_size.support_brim_width * 2],
                        center=True)
            brim -= cube([self.l - self.support_w * 2 - n,
                          Const_size.support_brim_height + 1,
                          self.h - self.support_w * 2 - n],
                         center=True)
            brim = (back(home_y
                        + self.nema17_plate_thickness
                        - Const_size.support_brim_height / 2.0)
                    (brim))
            d += brim

        # Belt traps
        len_ = self.l / 2
        b = (translate ([-20, -Const_size.belt_y_axis, Const_size.belt_lower_axis])
             (cube ([len_, Belt.w + Belt.clr, Belt.h + Belt.clr], center=True)))

        d -= b
        
            
        # DEB look inside
        if look_inside != False:
            d -= down (50) (back (100) (cube ([100, 200, 100])))

        # DEB motor
        if draw_motor != False:
            d += (back (home_y)
                  (rotate ([90, 0, 0]) (Nema17().draw ().set_modifier('#'))))

        return d
        
    def report (self):
        Carriage.report(self)
        sys.stderr.write("     Pivot point:  X - rods center, Y - center, Z - center\n")



if __name__ == "__main__":        
    car = Carriage_x ()
    draw = car.draw (draw_support=False, look_inside=False)
    car.report()
    print scad_render(draw)
