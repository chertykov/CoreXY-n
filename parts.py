#! /usr/bin/python

import sys
import math
from solid import *
from solid.utils import * # Not required, but the utils module is useful

class Belt:        
    h = 6.0                  # GT2 belt height
    w = 1.5
    clr = 0.2
    double_w = 2.5

class Toothed_pulley:
    r_o = 9.8
    belt_r_o = 11.2 / 2.0
    
class Idler_pulley:
    """Pulley constructed from two 3x10x4 mm flanged bearings"""
    r_i = 3 / 2.0    # internal radius
    r_w = 10 / 2.0   # working surface radius
    r_f = 11.5 / 2.0 # flange radius
    h = 8            # height
    flange_h = 1          # flange height

    def draw (self):
        d = (cylinder (r = self.r_f, h = self.flange_h)
             + cylinder (r = self.r_w, h = self.h)
             + up (self.h - self.flange_h) (cylinder (r = self.r_f, h = self.flange_h))
             - down (1) (cylinder (r = self.r_i, h = self.h + 2)))
        return d


""" Linear bearings."""
class Lm_uu:
    r_i = None
    r_o = None
    l = None
    def draw (self):
        return (cylinder (r = self.r_o, h = self.l)
                - down (1) (cylinder (r = self.r_i, h = self.l + 2)))

class Lm8uu (Lm_uu):
    r_i = 8 / 2.0
    r_o = 15 / 2.0
    l = 24.2   # this is strange. Must be 24

class Lm12uu (Lm_uu):
    r_i = 12 / 2.0
    r_o = 21 / 2.0
    l = 57

""" Smooth rods."""
class Rod:
    r = None
    l = None
    def draw (self):
        return cylinder (r = self.r, h = self.l)

class Y_rod (Rod):
    r = 8 / 2.0
    l = 348

class X_rod (Rod):
    r = 8 / 2.0
    l = 337

class Z_rod (Rod):
    r = 12 / 2.0
    l = 339

class Const_size:
    rod_wall = 3                # plastick wall for rod support
    m3_wall = 3                 # plastick wall for m3 screw support
    m3_r = 3.4 / 2.0            # M3 screw hole radius
    m3_screw_r = 3.2 / 2.0      # Screw without nut. Tight.
    m3_washer_h = 0.6           # really it 0.5
    support_line_width = 0.5    # support line width
    support_brim_width = 1
    support_brim_height = 0.2

    belt_z_axis = 0               # Z offset of both belts axis
    belt_upper_axis = belt_z_axis - (Belt.h + m3_washer_h) / 2.0 - Idler_pulley.flange_h
    belt_lower_axis = belt_z_axis + (Belt.h + m3_washer_h) / 2.0 + Idler_pulley.flange_h
    belt_y_axis = Belt.w / 2 + Idler_pulley.r_w

    motor_dx = Lm8uu.r_o + 1 + Belt.h / 2 + Toothed_pulley.belt_r_o
    

    
class Y_support:
    h = (2 * Y_rod.r + 2 * Const_size.rod_wall
         + 2 * (Const_size.m3_r + 2 * Const_size.m3_wall))
    w = 2 * Y_rod.r + Const_size.rod_wall
    t = 15      #  support thickness

    def __init__(self):
        self.overlap = self.t

    def draw (self):
        d = right (Const_size.rod_wall / 2.0) (cube ([w, t, h], center=True))

    
""" Nema 17 stepper. """
use ("nema17.scad")

class Nema17:
    side_size = 42.2
    length = 39.0
    mount_dist = 31.04
    mount_r = 3 / 2.0
    mount_depth = 4.5
    mount_lip = -1
    round_extrusion_r = 22 / 2.0
    round_extrusion_h = 1.9
    shaft_r = 5 / 2.0
    shaft_l = 19.0
    shaft_flat = 0.5

    def draw (self):
        return draw_nema17()

class Carriage:
    l = None
    h = None
    w = None
    # Z distance between X rods.
    base = None

    def report (self):
        sys.stderr.write("Carriage X: Size [%g, %g, %g], base %g\n" %
                         (self.l, self.w, self.h, self.base))

class Gantry:
    xy_overlap = Y_rod.r        # Overlap
    
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
                             - self.car_y1.l / 2.0 - self.car_y2.l / 2.0)
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
                + (left (self.size_x / 2.0 - self.xy_overlap) (self.car_y1.draw()))
        )
        
    def draw (self):
        # Y rods
        d = (left (self.size_x / 2.0 - self.xy_overlap)
             (rotate ([90, 0, 0])
              (down (self.y_rod1.l / 2.0)
               (self.y_rod1.draw ()))))
        d += (right (self.size_x / 2.0 - self.xy_overlap)
             (rotate ([90, 0, 0])
              (down (self.y_rod2.l / 2.0)
               (self.y_rod2.draw ()))))
        # X rods
        d += (up (self.xz_offset)
               (rotate ([0, 90, 0])
                (down (self.x_rod1.l / 2.0)
                 (self.x_rod1.draw ()))))
        d += (down (self.xz_offset)
               (rotate ([0, 90, 0])
                (down (self.x_rod2.l / 2.0)
                 (self.x_rod2.draw ()))))
        # Carriage
        d += self.draw_car()
        return d



class Test_support:
    s_y = 20
    s_z = 35
    s_x = 20
    wall = 4

    def __init__(self):
        self.rr = Const_size.m3_wall + Const_size.m3_r + 0.5
        self.idler_offset = self.s_x - self.rr

    def draw(self):
        d = hull()(cylinder (r = self.rr, h = self.s_z, center=True),
                   (left (self.idler_offset)
                    (cube ([0.01, self.s_y, self.s_z], center=True))))
        # M3 screw holes
        d -= cylinder(r = Const_size.m3_screw_r, h = self.s_z + 20, center=True, segments = 8)
        # Idlers place
        d -= (right (self.s_x / 2.0 - Idler_pulley.r_f - 2)
              (cube ([self.s_x, self.s_y, Idler_pulley.h * 2 + 0.6 + 0.1], center=True)))
#        d += (color ("red")
#               (Idler_pulley().draw ()))
        return rotate ([0,-90,0]) (d) 
        

if __name__ == "__main__":        

    #pulley1 = Idler_pulley ()
    #lm8 = Lm8uu ()
    #lm12 = Lm12uu ()
    #x_rod = X_rod()
    
    #t_c = Test_support ()

    g = Gantry ()
    #draw = g.draw ()
    
    car = Carriage_x ()
    draw = car.draw ()
    

    #draw = t_c.draw ()

    #nema17 = Nema17()
    #draw = nema17.draw()

    sys.stderr.write("hello %d\n" % X_rod.l)

    print scad_render(draw)
