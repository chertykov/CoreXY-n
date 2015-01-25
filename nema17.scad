include <MCAD/stepper.scad>

module draw_nema17 ()
{
  translate ([0, 0, 1])
    rotate ([180, 0, 0])
    motor(Nema17, 2, dualAxis=false);
}

draw_nema17();
