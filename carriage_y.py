# CoreXY printer - Y carriage.
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

from parts import X_rod
from parts import Y_rod
from parts import Const_size
from parts import Lm8uu
from parts import Carriage
from parts import Nema17
from parts import Idler_pulley
from parts import Toothed_pulley

from carriage_x import Carriage_x

class Carriage_y (Carriage):
    wall = Const_size.rod_wall
    l = 20
    w = Lm8uu.l * 2 + 1
    h = Carriage_x.base + Lm8uu.r_o + Const_size.rod_wall
    base = Carriage_x.base
    
    def __init__ (self):
        self.idler_axis_dx = (Const_size.motor_dx
                              + Toothed_pulley.belt_r_o
                              + Idler_pulley.r_w)
        sys.stderr.write("Y carriage w: %g\n" % self.w)

    def draw_rods(self):
        x_rod = X_rod ()

        y_rod = Y_rod ()
        d = (back (y_rod.l / 2.0)
             (rotate ([-90, 0, 0])
              (y_rod.draw ())))
        for n in [1,-1]:
            d += (down (n * self.base / 2.0)
                  (rotate ([0, 90, 0]) 
                   (x_rod.draw ())))
        return d

    def draw(self):
        dy = Lm8uu.l / 2.0 #X_rod.r + Const_size.rod_wall # from pivot point Y
        dx = Lm8uu.r_o + Const_size.rod_wall # from pivot point X
        jib_h = 2
        # Y LM8UU bearings support
        d = (forward (dy)
             (rotate ([90, 0, 0])
              (cylinder (r = dx, h = self.w)
               - cylinder (r = Lm8uu.r_o, h = Lm8uu.l * 5, center=True))))
        
        c1 = (translate ([-dx, -(self.w - dy), -X_rod.r / 1.0])
              (cube ([jib_h, self.w - dy, X_rod.r*2])))

        c2 = (translate ([-dx, 0, self.base / 2.0])
              (rotate ([0, 90, 0])
               (cylinder (r = X_rod.r, h = jib_h))))
        
        c3 = (translate ([-dx, 0, -self.base / 2.0])
              (rotate ([0, 90, 0])
               (cylinder (r = X_rod.r, h = jib_h))))

        d += hull () (c1, c2, c3)

        # DEB pulley axis
        d += (right (self.idler_axis_dx)
              (cylinder (r=Const_size.m3_r, h = 40, center=True).set_modifier ('%')))

        # DEB pulley
        p = (up(Const_size.m3_washer_h / 2.0)
              (right (self.idler_axis_dx)
               (Idler_pulley ().draw())))
        d += p + mirror([0,0,1]) (p)


        # DEB Rods
        d += self.draw_rods ().set_modifier ('%')

        # DEB Nema17
        d += (translate([Const_size.motor_dx,80,-10])
              (Nema17().draw ().set_modifier ('#')))

        
        return d
        
        
        d += (translate ([-self.l / 2.0, -self.w / 2.0, -self.h + self.wall + Lm8uu.r_o])
             (cube([self.l, self.w, self.h])))
        d -= rotate ([90, 0, 0]) (cylinder (r = Lm8uu.r_o, h = self.w + 2, center=True))
        return d

    def report(self):
        Carriage.report(self)
        sys.stderr.write("     idler Dx: %g\n" % (self.idler_axis_dx))        
        sys.stderr.write("     Pivot point:  X - rods center, Y - center, Z - center\n")

if __name__ == "__main__":        
    car = Carriage_y ()
    draw = car.draw ()
    car.report()
    print scad_render(draw)
