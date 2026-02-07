from rest_framework import serializers
from .models import Customer, Product, Order, OrderItem


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['customer_id', 'first_name', 'last_name', 'phone_no', 'address']
        read_only_fields = ['customer_id']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['product_id', 'p_name', 'price', 'description', 'quantity']
        read_only_fields = ['product_id']


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.p_name', read_only=True)
    product_price = serializers.DecimalField(
        source='product.price', 
        read_only=True, 
        max_digits=10, 
        decimal_places=2
    )

    class Meta:
        model = OrderItem
        fields = ['orderitems_id', 'order', 'product', 'product_name', 'product_price', 'order_quantity']
        read_only_fields = ['orderitems_id']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.first_name', read_only=True)

    class Meta:
        model = Order
        fields = ['order_id', 'customer', 'customer_name', 'order_date', 'total_amount', 'status', 'items']
        read_only_fields = ['order_id', 'order_date']