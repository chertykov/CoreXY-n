
all: parts.scad carriage_x.scad

parts.scad: parts.py

extruder.scad: extruder.py parts.py
carriage_x.scad: carriage_x.py parts.py
carriage_y.scad: carriage_y.py parts.py
motor_mount.scad: motor_mount.py parts.py

%.scad: %.py
	python $< > $@.tmp && mv -f $@.tmp $@


