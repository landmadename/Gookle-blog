from django.utils.html import format_html
from wagtail.images.formats import Format, register_image_format


class FiguredImageFormat(Format):
    def image_to_html(self, image, alt_text, extra_attributes=None):
        default_html = super().image_to_html(image, alt_text, extra_attributes)
        if alt_text.startswith('- '):
            alt_text = alt_text[2:]
            return format_html("<figure>{}<figcaption>{}</figcaption></figure>", default_html, alt_text)
        else:
            return format_html("<figure>{}</figure>", default_html)

register_image_format(
    FiguredImageFormat('figured_fullwidth', 'Packed in figure', 'bodytext-image', 'original')
)
