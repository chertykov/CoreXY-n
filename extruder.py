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

motor = Nema17()
hob_groove_h = 12   # distance from motor base to hobbed pulley groove

class Extruder_shaft:
    shaft_d = 10                # diametr of lever shaft
    shaft_head_d = shaft_d + 2

    def __init__(self, h):
        self.h = h
    
    def draw(self):
        head_h = Size.m3_head_h + 1
        shaft_h = self.h - head_h
        S = 128
        
        d = cylinder (d = self.shaft_head_d, h = head_h, segments=S)
        d += cylinder (d = self.shaft_d, h = self.h, segments=S)
        d -= cylinder (r = Size.m3_r, h = self.h + 1, segments=S)
        d -= (down (1)
              (cylinder (r = Size.m3_head_r, h = Size.m3_head_h + 1, segments=32)))

        d -= down (1) (cube ([50,50,50]))
        
        return d
        
class Extruder_base:
    base_h = 3                  # base thickness
    
    
    def draw(self):
        pass
    

class Extruder:
    pass

if __name__ == "__main__":        
    ex = Extruder_shaft (12)
    #draw = ex.draw_base (look_inside=False)
    #draw += ex.draw_lever (look_inside=False)
    draw = ex.draw()
    print scad_render(draw)
