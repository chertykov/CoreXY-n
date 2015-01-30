#! /usr/bin/python

import sys
import math
from solid import *
from solid.utils import * # Not required, but the utils module is useful

class Const_size:
    car_y_len = 20
    xz_distance = 20 # Z distance between Y rod surface and X rod surface
    rod_wall = 3     # plastick wall for rod support
    m3_wall = 3      # plastick wall for m3 screw support
    m3_r = 3.4 / 2   # M3 screw hole radius
    
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

class Y_rod (Rod):
    r = 8 / 2
    l = 348

class X_rod (Rod):
    r = 8 / 2
    l = 337

class Z_rod (Rod):
    r = 12 / 2
    l = 339


class Y_support:
    h = (2 * Y_rod.r + 2 * Const_size.rod_wall
         + 2 * (Const_size.m3_r + 2 * Const_size.m3_wall))
    w = 2 * Y_rod.r + Const_size.rod_wall
    t = 15      #  support thickness

    def __init__(self):
        self.overlap = self.t

    def draw (self):
        d = right (Const_size.rod_wall / 2) (cube ([w, t, h], center=True))

    
""" Nema 17 stepper. """
use ("nema17.scad")

class Nema17:
    side_size = 42.2
    mount_dist = 31.04
    mount_r = 3 / 2
    mount_depth = 4.5
    mount_lip = -1
    round_extrusion_r = 22 / 2
    round_extrusion_h = 1.9
    shaft_r = 5 / 2
    shaft_l = 19
    shaft_flat = 0.5

    def draw (self):
        return draw_nema17()

class Carriage:
    l = None
    h = None
    w = None
    base = 40                   # distance between X rods.

    def report (self):
        sys.stderr.write("Carriage X: Size [%g, %g, %g], base %g\n" %
                         (self.l, self.w, self.h, self.base))

class Carriage_x (Carriage):
    l = Lm8uu.l * 2 + 1
    h = Lm8uu.r_o * 2
    base = 40
    w = base + Lm8uu.r_o * 2 + 1 * 2

    def draw (self):
        return (up (self.h / 2) (cube ([self.l, self.w, self.h], center=True))
                - (back (self.base / 2)
                    (rotate ([0, 90, 0])
                     (cylinder (r = Lm8uu.r_o, h = self.l + 2, center=True))))
                - (forward (self.base / 2)
                   (rotate ([0, 90, 0])
                    (cylinder (r = Lm8uu.r_o, h = self.l + 2, center=True))))
        )
        
    def report (self):
        Carriage.report(self)
        sys.stderr.write("     Pivot point:  X - center, Y - center, Z - LM8UU axle\n")


class Carriage_y (Carriage):
    wall = Const_size.rod_wall
    l = Const_size.car_y_len
    w = Carriage.base + 2 * (X_rod.r + wall)
    def __init__ (self):
        self.h = Lm8uu.r_o + self.wall + abs(Gantry.xz_offset) + X_rod.r + self.wall
        if self.w < Lm8uu.l * 2 + 1:
            self.w = Lm8uu.l * 2 + 1
        
        sys.stderr.write("Y carriage w: %g\n" % self.w)

    def draw(self):
        d = (translate ([-self.l / 2, -self.w / 2, -self.h + self.wall + Lm8uu.r_o])
             (cube([self.l, self.w, self.h])))
        d -= rotate ([90, 0, 0]) (cylinder (r = Lm8uu.r_o, h = self.w + 2, center=True))
        return d
        
    
class Gantry:
    xy_overlap = Y_rod.r        # Overlap
    xz_offset = - (Y_rod.r + X_rod.r + Const_size.xz_distance) # X rods lower than Y
    
    def __init__ (self):
        self.x_rod1 = X_rod ()
        self.x_rod2 = X_rod ()

        self.y_rod1 = Y_rod ()
        self.y_rod2 = Y_rod ()

        self.size_x = X_rod.l
        self.size_y = Y_rod.l

        self.car_x = Carriage_x ()
        self.car_y1 = Carriage_y ()
        self.car_y2 = Carriage_y ()

        self.y_support1 = Y_support ()
        self.y_support2 = Y_support ()
        self.y_support3 = Y_support ()
        self.y_support4 = Y_support ()
        
        self.print_area_x = (X_rod.l
                             - self.car_x.l
                             - 2*Y_rod.r
                             - 2*self.xy_overlap
                             - self.car_y1.l / 2 - self.car_y2.l / 2)
        self.print_area_y = (Y_rod.l
                             - 2 * self.y_support1.overlap
                             - Nema17.side_size
                             - self.car_x.l)
        self.car_x.report()
        sys.stderr.write("X print area: %g\n" % self.print_area_x)
        sys.stderr.write("Y print area: %g\n" % self.print_area_y)


    def draw_car(self):
        return (up (self.xz_offset)
                (self.car_x.draw())
                + (left (self.size_x / 2 - self.xy_overlap) (self.car_y1.draw()))
        )
        
    def draw (self):
        # Y rods
        d = (left (self.size_x / 2 - self.xy_overlap)
             (rotate ([90, 0, 0])
              (down (self.y_rod1.l / 2)
               (self.y_rod1.draw ()))))
        d += (right (self.size_x / 2 - self.xy_overlap)
             (rotate ([90, 0, 0])
              (down (self.y_rod2.l / 2)
               (self.y_rod2.draw ()))))
        # X rods
        d += (up (self.xz_offset)
              (back (self.car_x.base / 2)
               (rotate ([0, 90, 0])
                (down (self.x_rod1.l / 2)
                 (self.x_rod1.draw ())))))
        d += (up (self.xz_offset)
              (forward (self.car_x.base / 2)
               (rotate ([0, 90, 0])
                (down (self.x_rod2.l / 2)
                 (self.x_rod2.draw ())))))
        # Carriage
        d += self.draw_car()
        return d


pulley1 = Idler_pulley ()
lm8 = Lm8uu ()
lm12 = Lm12uu ()
x_rod = X_rod()

g = Gantry ()

car = Carriage_x ()

draw = g.draw ()

#nema17 = Nema17()
#draw = nema17.draw()

sys.stderr.write("hello %d\n" % X_rod.l)


print scad_render(draw)
