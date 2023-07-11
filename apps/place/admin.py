from django.contrib import admin
from .models import Place


class PlaceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'suburb', )
    list_display_links = ('name', )
    search_fields = ('name', )
    list_per_page = 25


admin.site.register(Place, PlaceAdmin)