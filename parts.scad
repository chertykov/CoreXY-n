

union() {
	union() {
		union() {
			union() {
				translate(v = [-164, 0, 0]) {
					rotate(a = [90, 0, 0]) {
						translate(v = [0, 0, -174]) {
							cylinder(h = 348, r = 4);
						}
					}
				}
				translate(v = [164, 0, 0]) {
					rotate(a = [90, 0, 0]) {
						translate(v = [0, 0, -174]) {
							cylinder(h = 348, r = 4);
						}
					}
				}
			}
			translate(v = [0, 0, -28]) {
				translate(v = [0, -20, 0]) {
					rotate(a = [0, 90, 0]) {
						translate(v = [0, 0, -168]) {
							cylinder(h = 337, r = 4);
						}
					}
				}
			}
		}
		translate(v = [0, 0, -28]) {
			translate(v = [0, 20, 0]) {
				rotate(a = [0, 90, 0]) {
					translate(v = [0, 0, -168]) {
						cylinder(h = 337, r = 4);
					}
				}
			}
		}
	}
	union() {
		translate(v = [0, 0, -28]) {
			difference() {
				difference() {
					translate(v = [0, 0, 7]) {
						cube(center = true, size = [49.4000000000, 56, 14]);
					}
					translate(v = [0, -20, 0]) {
						rotate(a = [0, 90, 0]) {
							cylinder(h = 51.4000000000, r = 7, center = true);
						}
					}
				}
				translate(v = [0, 20, 0]) {
					rotate(a = [0, 90, 0]) {
						cylinder(h = 51.4000000000, r = 7, center = true);
					}
				}
			}
		}
		translate(v = [-164, 0, 0]) {
			difference() {
				translate(v = [-10, -27, -35]) {
					cube(size = [20, 54, 45]);
				}
				rotate(a = [90, 0, 0]) {
					cylinder(h = 56, r = 7, center = true);
				}
			}
		}
	}
}
