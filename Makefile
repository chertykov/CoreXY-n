
all: parts.scad

parts.scad: parts.py 

%.scad: %.py
	python $< > $@


