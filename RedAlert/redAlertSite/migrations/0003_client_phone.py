# Generated by Django 3.2.8 on 2022-02-13 20:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('redAlertSite', '0002_alter_client_birthdate'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='phone',
            field=models.IntegerField(default=43803690030),
        ),
    ]
