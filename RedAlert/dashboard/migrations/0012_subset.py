# Generated by Django 3.2.8 on 2022-04-04 23:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0011_delete_testauto'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('clientIDs', models.CharField(max_length=2000)),
                ('user_id', models.IntegerField()),
            ],
        ),
    ]
