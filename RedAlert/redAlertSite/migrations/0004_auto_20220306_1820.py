# Generated by Django 3.2.8 on 2022-03-06 18:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('redAlertSite', '0003_client_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='lat',
            field=models.FloatField(default=1.11),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='client',
            name='long',
            field=models.FloatField(default=1.11),
            preserve_default=False,
        ),
    ]