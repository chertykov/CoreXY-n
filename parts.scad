

union() {
	union() {
		union() {
			union() {
				translate(v = [-174, 0, 0]) {
					rotate(a = [90, 0, 0]) {
						translate(v = [0, 0, -168]) {
							cylinder(h = 337, r = 4);
						}
					}
				}
				translate(v = [174, 0, 0]) {
					rotate(a = [90, 0, 0]) {
						translate(v = [0, 0, -168]) {
							cylinder(h = 337, r = 4);
						}
					}
				}
			}
			translate(v = [0, 0, -18]) {
				translate(v = [0, -16.2000000000, 0]) {
					rotate(a = [0, 90, 0]) {
						translate(v = [0, 0, -174]) {
							cylinder(h = 348, r = 4);
						}
					}
				}
			}
		}
		translate(v = [0, 0, -18]) {
			translate(v = [0, 16.2000000000, 0]) {
				rotate(a = [0, 90, 0]) {
					translate(v = [0, 0, -174]) {
						cylinder(h = 348, r = 4);
					}
				}
			}
		}
	}
	translate(v = [0, 0, -18]) {
		difference() {
			difference() {
				cube(center = true, size = [48.4000000000, 48.4000000000, 28]);
				translate(v = [0, -16.2000000000, 0]) {
					rotate(a = [0, 90, 0]) {
						cylinder(h = 50.4000000000, r = 7, center = true);
					}
				}
			}
			translate(v = [0, 16.2000000000, 0]) {
				rotate(a = [0, 90, 0]) {
					cylinder(h = 50.4000000000, r = 7, center = true);
				}
			}
		}
	}
}
