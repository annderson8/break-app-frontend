from django.contrib import admin
from .models import Order, OrderItem
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from import_export import fields



class OrderResource(resources.ModelResource):
    class Meta:
        model = Order

class OrderAdmin(ImportExportModelAdmin):
    def has_delete_permission(self, request, obj=None):
        return False
    
    list_display = ('id', 'transaction_id', 'amount', 'status', )
    list_display_links = ('id', 'transaction_id', )
    list_filter = ('status', )
    list_editable = ('status', )
    list_per_page = 25
    resource_class = OrderResource

admin.site.register(Order, OrderAdmin)

class OrderItemResource(resources.ModelResource):
    user_email = fields.Field(attribute='order__user__email', column_name='user email')
    product_name = fields.Field(attribute='product__name', column_name='product name')
    place_name = fields.Field(attribute='place__name', column_name='place name')

    class Meta:
        model = OrderItem
        fields = ('id', 'order', 'name', 'date_added', 'user_email', 'product_name', 'place_name' )  # Agregamos los nuevos campos

    def dehydrate_user_email(self, order_item):
        return order_item.order.user.email

    def dehydrate_product_name(self, order_item):
        return order_item.product.name
    
    def dehydrate_place_name(self, order_item):
        if order_item.place:
            return order_item.place.name
        else:
            return ''


class OrderItemAdmin(ImportExportModelAdmin):
    def has_delete_permission(self, request, obj=None):
        return False

    list_display = ('id', 'order', 'name', 'date_added', )
    list_display_links = ('id', 'order', )
    list_per_page = 25
    resource_class = OrderItemResource

admin.site.register(OrderItem, OrderItemAdmin)