# Generated by Django 3.0.4 on 2020-03-31 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_auto_20200331_1140'),
    ]

    operations = [
        migrations.AddField(
            model_name='gooklepage',
            name='show_in_latest',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='gooklepage',
            name='show_in_latests',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]
