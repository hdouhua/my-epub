BUILD = ../build
BOOKNAME = 金刚般若波罗蜜经
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
	$(EPUB_BUILDER) -f markdown -t html5 --template base.html5 html.yaml $(TOC) -o $(BOOKNAME).html `ls ./content/*.md` --verbose

clean:
	rm -f $(BUILD)/$(BOOKNAME).epub
	rm -f $(BUILD)/$(BOOKNAME).docx
	rm -f $(BOOKNAME).html

.PHONY: clean epub docx html
