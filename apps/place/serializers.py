from rest_framework import serializers
from .models import Place, DeliveryTime


class DeliveryTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryTime
        fields = [
            'id',
            'time'
        ]

class PlaceSerializer(serializers.ModelSerializer):
    times = DeliveryTimeSerializer(many=True, read_only=True)
    class Meta:
        model = Place
        fields = [
            'id',
            'name',
            'addres',
            'suburb',
            'zipcode',
            'state',
            'country',
            'times',
        ]