
all: idler.scad

idler.scad: idler.py 

%.scad: %.py
	python $< > $@


