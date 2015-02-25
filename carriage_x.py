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
    nema17_offset = 3.0         # aprox. offset center of gravity
    nema17_plate_thickness = 3.0
    lm8uu_clr = 0.1
    nema17_clr = 0.5 # clearence between motor and carriage walls (GT2 traps)
    belt_trap_w = 10
    l = int(Nema17.side_size) + nema17_clr * 2 + belt_trap_w * 2
    base = 30                   # distance between X rods
    w = base + (Lm8uu.r_o + 2) * 2

    def __init__(self, belt_z):
        """belt_z - distance from center of X rod to belt."""
        self.belt_z = belt_z
        self.base_h = Belt.width + 5
        self.h = self.base_h + Belt.width
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
        
    def draw_belt_trap(self):
        belt_trap_l = self.w / 2 - Idler_pulley.r_w + Const_size.rod_wall
        d = (translate ([0, self.w / 2.0 - belt_trap_l , -1])
             (cube ([self.belt_trap_w, belt_trap_l, Belt.width + 1])))
        return d

    def draw (self, draw_support = False, draw_motor=False, look_inside=False):
        # base plate
        d = down(self.base_h / 2.0) (cube([self.l, self.w, self.base_h], center=True))
        d += [(rotate ([0, 0, i])
              (translate ([self.l / 2.0 - self.belt_trap_w, 0 ,0])
              (self.draw_belt_trap()))) for i in [0,180]]
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

        d = self.belt.draw_len_clr (width=7, length=20, clr=0.3)
        t_r = self.belt.tooths2r (angle = 90, tooths = 3)
        d = self.belt.draw_angle_clr (width = 7, r = t_r, angle = 90, clr=0.3)
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
    draw = car.draw (draw_support=False, look_inside=False)
    car.report()
    print scad_render(draw)
