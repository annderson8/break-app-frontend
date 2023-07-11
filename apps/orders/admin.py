from django.contrib import admin
from .models import Order, OrderItem
# Register your models here.


class OrderAdmin(admin.ModelAdmin):
    def has_delete_permission(self, request, obj=None):
        return False
    
    list_display = ('id', 'transaction_id', 'amount', 'status', )
    list_display_links = ('id', 'transaction_id', )
    list_filter = ('status', )
    list_editable = ('status', )
    list_per_page = 25

admin.site.register(Order, OrderAdmin)

class OrderItemAdmin(admin.ModelAdmin):
    def has_delete_permission(self, request, obj=None):
        return False

    list_display = ('id', 'order', 'name', 'date_added', )
    list_display_links = ('id', 'order', )
    list_per_page = 25


admin.site.register(OrderItem, OrderItemAdmin)