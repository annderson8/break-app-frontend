from django.db import models
from apps.product.models import Product
from apps.place.models import Place
from .countries import Countries
from datetime import datetime
from django.contrib.auth import get_user_model
User = get_user_model()


class Order(models.Model):
    class OrderStatus(models.TextChoices):
        not_processed = 'not_processed'
        processed = 'processed'
        shipping = 'shipped'
        delivered = 'delivered'
        cancelled = 'cancelled'
    
    status = models.CharField(
        max_length=50, choices=OrderStatus.choices, default=OrderStatus.not_processed)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    full_name = models.CharField(max_length=255)
    shipping_price = models.DecimalField(max_digits=5, decimal_places=2)
    date_issued = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.transaction_id


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    count = models.IntegerField()
    place = models.ForeignKey(Place, on_delete=models.CASCADE, null=True, blank=True)
    date_delivery = models.DateTimeField(default=datetime.now)
    time_delivery = models.DateTimeField(default=datetime.now)
    date_added = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.name