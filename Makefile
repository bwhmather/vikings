BLENDER ?=blender
CONVERT ?=gm convert
OUTPUT_DIR =_site

MODEL_SOURCES := $(shell find data -name '*.blend')
MODELS := $(patsubst data/%.blend,$(OUTPUT_DIR)/data/%.js,$(MODEL_SOURCES))

TEXTURE_SOURCES := $(shell find data -name '*.xcf')
TEXTURES := $(patsubst data/%.xcf,$(OUTPUT_DIR)/data/%.png,$(TEXTURE_SOURCES))

INPUT_DIRS := $(shell find data src lib -type d)
OUTPUT_DIRS := $(patsubst %,$(OUTPUT_DIR)/%,$(INPUT_DIRS))

JS_SOURCES := $(shell find data src -name '*.js')
JS := $(patsubst %.js,$(OUTPUT_DIR)/%.js,$(JS_SOURCES))

STATIC_SOURCES := index.html $(JS_SOURCES) lib/require.js lib/chipmunk.js lib/three.js
STATIC := $(patsubst %,$(OUTPUT_DIR)/%,$(STATIC_SOURCES))

.PHONY: all
all: $(OUTPUT_DIRS) $(STATIC) $(MODELS) $(TEXTURES)

$(OUTPUT_DIRS):
	mkdir -p $@

$(MODELS) : $(OUTPUT_DIR)/%.js : %.blend $(OUTPUT_DIRS)
	echo "import bpy; bpy.ops.export.threejs(filepath='$@', option_flip_yz=False)" | $(BLENDER) -b $< --python-console

$(TEXTURES) : $(OUTPUT_DIR)/%.png : %.xcf $(OUTPUT_DIRS)
	$(CONVERT) -flatten $< $@

$(STATIC) : $(OUTPUT_DIR)/% : % $(OUTPUT_DIRS)
	cp $< $@

clean:
	rm -rf $(OUTPUT_DIR)
