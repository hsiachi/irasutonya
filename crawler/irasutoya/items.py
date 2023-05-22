# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class IrasutoyaItem(scrapy.Item):
    name = scrapy.Field()
    # Description acts as an additional information for the image,
    # since some images share the same description with others.
    description = scrapy.Field()
    image_urls = scrapy.Field()
    images = scrapy.Field()
    categories = scrapy.Field()
