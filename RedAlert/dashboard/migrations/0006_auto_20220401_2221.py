# Generated by Django 3.2.8 on 2022-04-01 22:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_savedsearches'),
    ]

    operations = [
        migrations.AddField(
            model_name='savedsearches',
            name='query',
            field=models.CharField(default='default option', max_length=800),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='savedsearches',
            name='name',
            field=models.CharField(max_length=800),
        ),
    ]