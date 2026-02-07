from django.contrib import admin
from .models import Customer, Product, Order, OrderItem


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('customer_id', 'first_name', 'last_name', 'phone_no')
    search_fields = ('first_name', 'last_name', 'phone_no')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_id', 'p_name', 'price', 'quantity')
    search_fields = ('p_name',)
    list_filter = ('price',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer', 'order_date', 'status', 'total_amount')
    search_fields = ('customer__first_name',)
    list_filter = ('status', 'order_date')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('orderitems_id', 'order', 'product', 'order_quantity')
    search_fields = ('product__p_name',)