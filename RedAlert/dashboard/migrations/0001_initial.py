# Generated by Django 3.2.8 on 2022-04-01 01:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SavedSubset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('clientIDs', models.CharField(max_length=2000)),
                ('user_id', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='OneTimeAutomation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('date', models.DateField()),
                ('msg_body', models.CharField(max_length=200)),
                ('msg_sub', models.CharField(max_length=200)),
                ('msg_type', models.CharField(max_length=200)),
                ('msg_priority', models.CharField(max_length=200)),
                ('selected_clients', models.CharField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='RecurringAutomation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('start_date', models.DateField()),
                ('msg_body', models.CharField(max_length=200)),
                ('msg_sub', models.CharField(max_length=200)),
                ('msg_type', models.CharField(max_length=200)),
                ('msg_priority', models.CharField(max_length=200)),
                ('selected_clients', models.CharField(max_length=500)),
                ('send_msg_freq', models.IntegerField(default=1)),
                ('send_msg_freq_unit', models.CharField(max_length=200)),
            ],
        ),
    ]
