# Generated by Django 3.2.8 on 2022-02-13 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('redAlertSite', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='birthdate',
            field=models.DateField(),
        ),
    ]
