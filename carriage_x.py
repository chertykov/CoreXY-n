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
from parts import Idler_pulley

use ("timing_belts.scad")

class Carriage_x (Carriage):
    nema17_offset = 3.0  # motor offset from base edge
    lm8uu_clr = 0.1      # LM8UU seat clearance
    belt_clr = 0.3       # Belt traps clearance
    belt_wall = 1.5      # plastic wall thickness for upper belt traps
    nema17_clr = 0.5     # clearance between motor and carriage walls (GT2 traps)
    belt_trap_w = 10     # Width of upper belt traps
    base = 30            # distance between X rods

    def __init__(self, belt_z):
        """belt_z - distance from center of X rod to lower belt."""

        self.belt_lower_z = belt_z
        self.belt_upper_z = (belt_z + Belt.width
                             + Const_size.m3_washer_h + Idler_pulley.flange_h)
        
        self.base_h = Belt.width + 5
        self.h = self.base_h + Belt.width
        self.l = int(Nema17.side_size) + self.nema17_clr * 2 + self.belt_trap_w * 2
        self.w = self.base + (Lm8uu.r_o + 2) * 2

        self.belt = Belt()
        

    def draw_zip_channel(self):
        """Zip channel"""
        zip_r_i = Lm8uu.r_o + self.lm8uu_clr + 1.5
        zip_r_o = zip_r_i + 2
        zip_w = 4
        z = cylinder(r = zip_r_o, h = zip_w, center=True)
        z -= cylinder(r = zip_r_i, h = zip_w + 1, center=True)
        z = rotate ([0, 90, 0]) (z)
        return z

    def draw_upper_belt_trap(self):
        belt_r = self.belt.tooths2r (angle = 90, tooths = 3)
        belt_ro = belt_r + self.belt_clr + self.belt.thickness / 2.0
        belt_l = 12
        belt_x = self.belt.draw_len_clr (width = self.base_h - self.belt_lower_z + 1,
                                         length = belt_l, clr=self.belt_clr)
        belt_a = self.belt.draw_angle_clr (width = 7, r = belt_r, angle = 91,
                                      clr = self.belt_clr)

        belt_a = (forward (belt_ro+0.04)
                  (left (belt_ro)
                   (rotate ([0, 0, -90.5])
                    (belt_a))))
        belt_x1 = (forward (belt_l + belt_ro)
                   (left (belt_ro)
                    (rotate ([0, 0, -90])
                     (belt_x))))
        
        return right (belt_ro) (belt_x + belt_a + belt_x1)

        
    def draw_belt_trap(self):
        trap_h = self.belt_upper_z - self.base_h + Belt.width + 1
        trap_l = self.w / 2 - Idler_pulley.r_w + Const_size.rod_wall
        trap = (translate ([0, self.w / 2.0 - trap_l, -1])
                (cube ([self.belt_trap_w, trap_l, trap_h])))
        return trap

    def draw (self, print_=False, draw_motor=False, look_inside=False):
        # Base plate.
        d = down(self.base_h / 2.0) (cube([self.l, self.w, self.base_h], center=True))
        # Upper belt trap body. x 2
        belt_trap_x = self.l / 2.0 - self.belt_trap_w
        for i in [0,180]:
            d += (rotate ([0, 0, i])
                  (translate ([belt_trap_x, 0 ,0])
                   (self.draw_belt_trap())))
        # LM8UU seats
        lm8uu_seat_r = Lm8uu.r_o + self.lm8uu_clr
        c = (rotate ([0, 90, 0])
              (cylinder (r = lm8uu_seat_r, h = self.l + 1,
                         center=True, segments = 32)))

        # Seat "cap". 45deg overhang hack.
        xc = (rotate ([45, 0, 0])
              (cube ([self.l + 1, lm8uu_seat_r * 2, lm8uu_seat_r * 2], center=True)))
        xc -= (up (lm8uu_seat_r*3 + 0.5)
               (cube ([self.l + 2, lm8uu_seat_r * 4, lm8uu_seat_r * 4], center=True)))
        
        xc -= (up (-lm8uu_seat_r*2 + lm8uu_seat_r * 0.7071)
               (cube ([self.l + 2, lm8uu_seat_r * 4, lm8uu_seat_r * 4], center=True)))

        for sign in [1, -1]:
            d -= (translate ([0, sign * self.base / 2.0, -self.base_h])
                  (c + xc))

        # Zip channels
        for sign_x in [1, -1]:
            for sign_y in [1, -1]:
                d -= (translate ([sign_x * (self.l / 2.0 - Lm8uu.l / 2.0),
                                  sign_y * self.base / 2.0,
                                  -self.base_h])
                      (self.draw_zip_channel()))

        #t_r = self.belt.tooths2r (angle = 90, tooths = 3)
        #d = self.belt.draw_angle_clr (width = 7, r = t_r, angle = 91, clr=0.3)

        # Lower belt traps.
        belt = self.belt.draw_len_clr (width = self.base_h - self.belt_lower_z + 1,
                                       length=20, clr=0.3)

        for a in [0, 180]:
            d -= (rotate ([0, 0, a])
                  (translate ([-self.l / 2.0 - 1,
                               Idler_pulley.r_w,
                               -self.base_h + self.belt_lower_z - 0.5])
                   (rotate ([0, 0, -15])
                    (belt))))

        # Upper belt traps.
        belt = (translate ([belt_trap_x + self.belt_wall,
                           Idler_pulley.r_w,
                           -self.base_h + self.belt_upper_z - 0.5])
                (self.draw_upper_belt_trap()))

        if print_:
            for a in [0, 180]:
                d -= rotate ([0, 0, a]) (belt)

        # DEB look inside
        if look_inside != False:
            d -= down (50) (back (100) (cube ([100, 200, 100])))

        # DEB motor
        if draw_motor != False:
            d += (translate ([0,
                              -self.w / 2.0 + self.nema17_offset,
                              Nema17.side_size / 2.0])
                  (rotate ([90, 0, 0]) (Nema17().draw ().set_modifier('#'))))

        return d
        
    def report (self):
        Carriage.report(self)
        sys.stderr.write("     Pivot point:  X - rods center, Y - center, Z - center\n")



if __name__ == "__main__":        
    car = Carriage_x (belt_z = 5)
    draw = car.draw (print_=False, look_inside=False)
    car.report()
    print scad_render(draw)
