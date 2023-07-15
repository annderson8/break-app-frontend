from rest_framework import serializers
from .models import OrderItem
from apps.place.serializers import PlaceSerializer
from apps.place.models import Place


class OrderItemSerializer(serializers.ModelSerializer):
    place = serializers.PrimaryKeyRelatedField(queryset=Place.objects.all())
    class Meta:
        model = OrderItem
        fields = ['id','product', 'order', 'name', 'price', 'place', 'date_delivery', 'time_delivery', 'date_added']