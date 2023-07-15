from django.contrib import admin
from .models import Place, DeliveryTime


class PlaceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'suburb', )
    list_display_links = ('name', )
    search_fields = ('name', )
    list_per_page = 25

admin.site.register(Place, PlaceAdmin)

class DeliveryTimeAdmin(admin.ModelAdmin):
    list_display = ('id', 'time',)
    list_display_links = ('time', )
    search_fields = ('time', )
    list_per_page = 25

admin.site.register(DeliveryTime, DeliveryTimeAdmin)