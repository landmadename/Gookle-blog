from wagtail.images.blocks import ImageChooserBlock
from wagtail.embeds.blocks import EmbedBlock
from wagtailmarkdown.blocks import MarkdownBlock
from wagtail.core.blocks import (
    CharBlock, ChoiceBlock, RichTextBlock, StreamBlock, StructBlock, TextBlock, RawHTMLBlock
)


class ImageBlock(StructBlock):
    """
    Custom `StructBlock` for utilizing images with associated caption and
    attribution data
    """
    image = ImageChooserBlock(required=True)
    caption = CharBlock(required=False)
    attribution = CharBlock(required=False)

    class Meta:
        icon = 'image'
        template = "blocks/image_block.html"


class HeadingBlock(StructBlock):
    """
    Custom `StructBlock` that allows the user to select h2 - h4 sizes for headers
    """
    heading_text = CharBlock(classname="title", required=True)
    size = ChoiceBlock(choices=[
        ('h2', 'H2'),
        ('h3', 'H3'),
        ('h4', 'H4')
    ], blank=True, required=False, default='h2')

    class Meta:
        icon = "title"
        template = "blocks/heading_block.html"


class BlockQuote(StructBlock):
    """
    Custom `StructBlock` that allows the user to attribute a quote to the author
    """
    text = TextBlock()
    attribute_name = CharBlock(
        blank=True, required=False, label='e.g. Mary Berry')

    class Meta:
        icon = "fa-quote-left"
        template = "blocks/blockquote.html"


class AudioBlock(StructBlock):
    """
    Custom `AudioBlock` that allows the user to attribute a quote to the author
    """
    text = TextBlock(label='Audio name')

    class Meta:
        icon = "fa-arrow-right"
        template = "blocks/audio_block.html"


# StreamBlocks
class BaseStreamBlock(StreamBlock):
    """
    Define the custom blocks that `StreamField` will utilize
    """
    heading_block = HeadingBlock()
    markdown = MarkdownBlock(icon="code")
    paragraph_block = RichTextBlock(
        icon="fa-paragraph",
        template="blocks/paragraph_block.html"
    )
    image_block = ImageBlock()
    raw_HTML = RawHTMLBlock()
    block_quote = BlockQuote()
    audio_block = AudioBlock()
    embed_block = EmbedBlock(
        help_text='Insert an embed URL e.g https://www.youtube.com/embed/SGJFWirQ3ks',
        icon="fa-paragraph",
        template="blocks/embed_block.html")
