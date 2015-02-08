// Mk8 drive gear parameters
hob_pulley_or = 8 / 2;
hob_pulley_ir = 5 / 2;
hob_pulley_l = 11.2;
hob_d = 6.7;
hob_offset = 8;
// Fixer screw for hobbed pulley
hob_fixer_offset = 3;
hob_fixer_r = 2;
hob_fixer_l = 3.6;
hob_pulley_screw_r = hob_pulley_ir + hob_fixer_l + 5*clr;

draw_hob_pulley();

module draw_hob_pulley()
{
  union ()
  {
    difference()
      {
	cylinder (r = hob_pulley_or, h = hob_pulley_l);
	cylinder (r = hob_pulley_ir, h = hob_pulley_l * 3, center=true);
	for (i = [0: 0.2: 6])
	  {
	    rotate (i * 360 / 6, [0, 0, 1])
	      translate ([0, 7 / 2 + hob_d / 2, hob_offset])
	      sphere (r = 7.5 / 2, $fn=12);
	  }
      }
    for (i = [0: 1: 8])
      {
	rotate (i * 360 / 8, [0, 0, 1])
	  translate ([0, -hob_pulley_ir, hob_fixer_offset])
	  rotate ([90, 0, 0])
	  cylinder (r = hob_fixer_r, h = hob_fixer_l);
      }
  }
}

