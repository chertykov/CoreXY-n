use </mnt/d/RepRap/Work/CoreXY-n/nema17.scad>


union() {
	union() {
		union() {
			union() {
				union() {
					translate(v = [0, 12.1000000000, 0]) {
						rotate(a = [90, 0, 0]) {
							difference() {
								cylinder(h = 49.4000000000, r = 10.5000000000);
								cylinder(h = 121.0000000000, r = 7.5000000000, center = true);
							}
						}
					}
					hull() {
						translate(v = [-10.5000000000, -37.3000000000, -4.0000000000]) {
							cube(size = [2, 37.3000000000, 8.0000000000]);
						}
						translate(v = [-10.5000000000, 0, 30.0000000000]) {
							rotate(a = [0, 90, 0]) {
								cylinder(h = 2, r = 4.0000000000);
							}
						}
						translate(v = [-10.5000000000, 0, -30.0000000000]) {
							rotate(a = [0, 90, 0]) {
								cylinder(h = 2, r = 4.0000000000);
							}
						}
					}
				}
				translate(v = [27.7000000000, 0, 0]) {
					%cylinder(h = 40, r = 1.7000000000, center = true);
				}
			}
			union() {
				translate(v = [0, 0, 0.3000000000]) {
					translate(v = [27.7000000000, 0, 0]) {
						difference() {
							union() {
								union() {
									cylinder(h = 1, r = 5.7500000000);
									cylinder(h = 8, r = 5.0000000000);
								}
								translate(v = [0, 0, 7]) {
									cylinder(h = 1, r = 5.7500000000);
								}
							}
							translate(v = [0, 0, -1]) {
								cylinder(h = 10, r = 1.5000000000);
							}
						}
					}
				}
				mirror(v = [0, 0, 1]) {
					translate(v = [0, 0, 0.3000000000]) {
						translate(v = [27.7000000000, 0, 0]) {
							difference() {
								union() {
									union() {
										cylinder(h = 1, r = 5.7500000000);
										cylinder(h = 8, r = 5.0000000000);
									}
									translate(v = [0, 0, 7]) {
										cylinder(h = 1, r = 5.7500000000);
									}
								}
								translate(v = [0, 0, -1]) {
									cylinder(h = 10, r = 1.5000000000);
								}
							}
						}
					}
				}
			}
		}
		%union() {
			union() {
				translate(v = [0, -174.0000000000, 0]) {
					rotate(a = [-90, 0, 0]) {
						cylinder(h = 348, r = 4.0000000000);
					}
				}
				translate(v = [0, 0, -30.0000000000]) {
					rotate(a = [0, 90, 0]) {
						cylinder(h = 337, r = 4.0000000000);
					}
				}
			}
			translate(v = [0, 0, 30.0000000000]) {
				rotate(a = [0, 90, 0]) {
					cylinder(h = 337, r = 4.0000000000);
				}
			}
		}
	}
	translate(v = [17.1000000000, 80, -10]) {
		#draw_nema17();
	}
}
