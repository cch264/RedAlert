# Generated by Django 3.2.8 on 2022-03-24 18:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0003_auto_20220318_1611'),
    ]

    operations = [
        migrations.AddField(
            model_name='onetimeautomation',
            name='user_id',
            field=models.IntegerField(default=11),
        ),
        migrations.AddField(
            model_name='recurringautomation',
            name='user_id',
            field=models.IntegerField(default=11),
        ),
    ]