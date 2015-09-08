

union() {
	difference() {
		difference() {
			union() {
				cylinder($fn = 128, d = 10, h = 4);
				cylinder($fn = 128, d = 8, h = 11.4000000000);
			}
			cylinder($fn = 8, h = 12.4000000000, r = 1.7000000000);
		}
		translate(v = [0, 0, -1]) {
			cylinder($fn = 16, h = 4, r = 2.8500000000);
		}
	}
	translate(v = [0, 0, 3]) {
		cylinder(d = 10, h = 0.2000000000);
	}
}
