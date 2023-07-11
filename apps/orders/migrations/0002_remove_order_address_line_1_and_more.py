# Generated by Django 4.2.2 on 2023-07-10 06:28

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('place', '0002_deliverytime_place_delivery_times'),
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='address_line_1',
        ),
        migrations.RemoveField(
            model_name='order',
            name='address_line_2',
        ),
        migrations.RemoveField(
            model_name='order',
            name='city',
        ),
        migrations.RemoveField(
            model_name='order',
            name='country_region',
        ),
        migrations.RemoveField(
            model_name='order',
            name='postal_zip_code',
        ),
        migrations.RemoveField(
            model_name='order',
            name='shipping_name',
        ),
        migrations.RemoveField(
            model_name='order',
            name='shipping_time',
        ),
        migrations.RemoveField(
            model_name='order',
            name='state_province_region',
        ),
        migrations.RemoveField(
            model_name='order',
            name='telephone_number',
        ),
        migrations.AddField(
            model_name='orderitem',
            name='date_delivery',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='place',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='place.place'),
        ),
        migrations.AddField(
            model_name='orderitem',
            name='time_delivery',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]