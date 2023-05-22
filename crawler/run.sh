OUTPUT_FILE="../data/data.jsonl"

# install requirements
# python -m venv .venv
# source .venv/bin/activate
# pip install -r requirements.txt

# run crawler
scrapy crawl image -L INFO -o ${OUTPUT_FILE}