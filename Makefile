BUILD = ../build
BOOKNAME = 心灯录
METADATA = metadata.yaml
TOC = --toc --toc-depth=2
SRC_DIR = ./content

EPUB_BUILDER = pandoc

epub: $(BUILD)/$(BOOKNAME).epub

$(BUILD)/$(BOOKNAME).epub:
	mkdir -p $(BUILD)
	$(EPUB_BUILDER) -o $@ $(METADATA) `ls $(SRC_DIR)/*.md`

docx:
	$(EPUB_BUILDER) -o $(BUILD)/$(BOOKNAME).docx $(METADATA) -t docx $(TOC) `ls ./content/*.md` --verbose

html:
	# pandoc -f markdown -t html5 --template dao.html5 html.yaml --toc --toc-depth=2 -o xdl.html `ls ./content/*.md` --verbose
	$(EPUB_BUILDER) -f markdown -t html5 --template dao.html5 html.yaml $(TOC) -o xdl.html `ls ./content/*.md` --verbose

clean:
	rm $(BUILD)/$(BOOKNAME).epub
	rm $(BUILD)/$(BOOKNAME).docx
	rm xdl.html

.PHONY: clean epub docx html
