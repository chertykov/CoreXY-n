#! /usr/bin/python

import sys
import math
from solid import *
from solid.utils import * # Not required, but the utils module is useful

class Idler_pulley:
    """Pulley constructed from two 3x10x4 mm flanged bearings"""
    r_i = 3 / 2    # internal radius
    r_w = 10 / 2   # working surface radius
    r_f = 11.5 / 2 # flange radius
    h = 8         # height
    h_f = 1        # flange height

    def draw (self):
        return (cylinder (r = self.r_f, h = self.h_f)
                + cylinder (r = self.r_w, h = self.h)
                + up (self.h - self.h_f) (cylinder (r = self.r_f, h = self.h_f))
                - down (1) (cylinder (r = self.r_i, h = self.h + 2)))


""" Linear bearings."""
class Lm_uu:
    r_i = None
    r_o = None
    l = None
    def draw (self):
        return (cylinder (r = self.r_o, h = self.l)
                - down (1) (cylinder (r = self.r_i, h = self.l + 2)))

class Lm8uu (Lm_uu):
    r_i = 8 / 2
    r_o = 15 / 2
    l = 24.2   # this is strange. Must be 24

class Lm12uu (Lm_uu):
    r_i = 12 / 2
    r_o = 21 / 2
    l = 57

""" Smooth rods."""
class Rod:
    r = None
    l = None
    def draw (self):
        return cylinder (r = self.r, h = self.l)

class X_rod (Rod):
    r = 8 / 2
    l = 348

class Y_rod (Rod):
    r = 8 / 2
    l = 337

class Z_rod (Rod):
    r = 12 / 2
    l = 339

class Carriage_x:
    l = Lm8uu.l * 2
    h = Lm8uu.r_o * 4
    w = Lm8uu.l * 2
    base = w - (1 + Lm8uu.r_o) * 2

    def draw (self):
        return (cube ([self.l, self.w, self.h], center=True)
                - (back (self.base / 2)
                   (rotate ([0, 90, 0])
                    (cylinder (r = Lm8uu.r_o, h = self.l + 2, center=True))))
                - (forward (self.base / 2)
                   (rotate ([0, 90, 0])
                    (cylinder (r = Lm8uu.r_o, h = self.l + 2, center=True))))
        )

class Gantry:
    def __init__ (self):
        self.x_rod1 = X_rod ()
        self.x_rod2 = X_rod ()

        self.y_rod1 = Y_rod ()
        self.y_rod2 = Y_rod ()

        self.size_x = X_rod.l
        self.size_y = Y_rod.l

        self.car_x = Carriage_x ()

    def draw (self):
        d = (left (self.size_x / 2)
             (rotate ([90, 0, 0])
              (down (self.y_rod1.l / 2)
               (self.y_rod1.draw ()))))
        d += (right (self.size_x / 2)
             (rotate ([90, 0, 0])
              (down (self.y_rod2.l / 2)
               (self.y_rod2.draw ()))))
        d += (back (self.car_x.base / 2)
              (rotate ([0, 90, 0])
               (down (self.x_rod1.l / 2)
                (self.x_rod1.draw ()))))
        d += (forward (self.car_x.base / 2)
              (rotate ([0, 90, 0])
               (down (self.x_rod1.l / 2)
                (self.x_rod1.draw ()))))
        return d
        

pulley1 = Idler_pulley ()
lm8 = Lm8uu ()
lm12 = Lm12uu ()
x_rod = X_rod()

g = Gantry ()

car = Carriage_x ()

draw = cube ([2,3,4]) + g.draw () + car.draw ()

sys.stderr.write("hello %d\n" % X_rod.l)


print scad_render(draw)
