from irasutoya.items import IrasutoyaItem

import scrapy


class ImageSpider(scrapy.Spider):
    name = "image"

    def start_requests(self):
        urls = [
            "https://www.irasutoya.com/",
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        items = response.xpath("//div[@class='widget Label']")
        items = items.css("div.widget-content > ul")
        for a in items.css("li > a"):
            yield response.follow(a, callback=self.parse_tag_page)

    def parse_tag_page(self, response):
        # add image detail page
        items = response.xpath("//div[@class='date-outer']")
        for item in items:
            yield response.follow(item.css("a")[0], callback=self.parse_image_page)

        # go to next page
        next_page = response.css("span#blog-pager-older-link > a")
        if next_page:
            yield response.follow(next_page[0], callback=self.parse_tag_page)

    def parse_image_page(self, response):
        def get_image_attr(image):
            name = image.css("img::attr(alt)").get()
            image_url = image.css("img::attr(src)").get()
            if not image_url.startswith("https:"):
                image_url = "https:" + image_url
            return name, image_url

        categories = response.css("span.category > a")
        categories = [category.css("::text").get() for category in categories]

        if response.css(".post > .entry > .separator"):
            # Case 1: separators
            separators = response.css(".post > .entry > .separator")
            description = separators[-1].css("div::text").get()
            for separator in separators[:-1]:
                images = separator.css("a")
                for image in images:
                    name, image_url = get_image_attr(image)
                    yield IrasutoyaItem(
                        name=name,
                        description=description,
                        image_urls=[image_url],
                        categories=categories,
                    )
        else:
            # Case 2: floatimgsml
            images = response.css(".post > .entry > .floatimgsml")
            description = (
                response.css(".post > .entry > div")[-2].css("div::text").get()
            )
            for image in images:
                name, image_url = get_image_attr(image)
                yield IrasutoyaItem(
                    name=name,
                    description=description,
                    image_urls=[image_url],
                    categories=categories,
                )
