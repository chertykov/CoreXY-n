
all: parts.scad carriage_x.scad

parts.scad: parts.py

carriage_x.scad: carriage_x.py parts.py
carriage_y.scad: carriage_y.py parts.py

%.scad: %.py
	python $< > $@


