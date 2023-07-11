from django.contrib import admin
from .models import Cart, CartItem

class CartAdmin(admin.ModelAdmin):
    def has_delete_permission(self, request, obj=None):
        return False
    
    list_display = ('id', 'user' )
    list_display_links = ('id', 'user')
    list_per_page = 25

admin.site.register(Cart, CartAdmin)

class CartItemAdmin(admin.ModelAdmin):
    def has_delete_permission(self, request, obj=None):
        return False

    list_display = ('id', 'cart' )
    list_display_links = ('id', 'cart' )
    list_per_page = 25


admin.site.register(CartItem, CartItemAdmin)