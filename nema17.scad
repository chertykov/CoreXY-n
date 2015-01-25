include <MCAD/stepper.scad>

module draw_nema17 ()
{
	motor(Nema17, 2, dualAxis=false);
}

draw_nema17();