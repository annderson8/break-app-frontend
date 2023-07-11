from django.db import models


class DeliveryTime(models.Model):
    time = models.CharField(max_length=255)

    def __str__(self):
        return self.time

class Place(models.Model):
    class Meta:
        verbose_name = 'place'
        verbose_name_plural = 'places'

    name = models.CharField(max_length=255, unique=True)
    addres = models.CharField(max_length=255)
    suburb = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name