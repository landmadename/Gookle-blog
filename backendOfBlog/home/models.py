from django.db import models

from wagtail.core.models import Page
from wagtail.admin.edit_handlers import FieldPanel, StreamFieldPanel, MultiFieldPanel
from wagtail.images.edit_handlers import ImageChooserPanel
from wagtail.core.fields import StreamField
from base.blocks import BaseStreamBlock

from wagtail.api import APIField


class BoxPage(Page):
    """

    """ 
    
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Face of the deck'
    )
    
    order_by_latest = models.BooleanField(
        default=True)

    content_panels = Page.content_panels + [
        ImageChooserPanel('image'),
        MultiFieldPanel([
            FieldPanel('order_by_latest'),
        ], heading="Options")

    ]
    api_fields = [
        APIField('image'),
        APIField('order_by_latest'),
    ]


class GooklePage(Page):
    """

    """

    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Face of the card'
    )

    something = StreamField(
        BaseStreamBlock(), verbose_name="Page body", blank=True
    )

    show_in_latest = models.BooleanField(
        default=True)
    
    show_in_the_top_of_deck = models.BooleanField(
        default=False)
    show_in_the_top_of_latest = models.BooleanField(
        default=False)

    content_panels = Page.content_panels + [
        ImageChooserPanel('image'),
        StreamFieldPanel('something'),
        MultiFieldPanel([
            FieldPanel('show_in_latest'),
            FieldPanel('show_in_the_top_of_deck'),
            FieldPanel('show_in_the_top_of_latest'),
        ], heading="Options")
    ]
    
    api_fields = [
        APIField('image'),
        APIField('something'),
        APIField('show_in_latest'),
        APIField('show_in_the_top_of_deck'),
        APIField('show_in_the_top_of_latest'),
    ]