from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Customer, Product, Order, OrderItem
from .serializers import CustomerSerializer, ProductSerializer, OrderSerializer, OrderItemSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=True, methods=['POST'])
    def add_item(self, request, pk=None):
        """Add item to order"""
        order = self.get_object()
        product_id = request.data.get('product_id')
        order_quantity = request.data.get('order_quantity', 1)

        try:
            product = Product.objects.get(product_id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        order_item, created = OrderItem.objects.get_or_create(
            order=order,
            product=product,
            defaults={'order_quantity': order_quantity}
        )

        if not created:
            order_item.order_quantity += order_quantity
            order_item.save()

        serializer = OrderItemSerializer(order_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['DELETE'])
    def remove_item(self, request, pk=None):
        """Remove item from order"""
        order = self.get_object()
        orderitem_id = request.data.get('orderitems_id')

        try:
            order_item = OrderItem.objects.get(orderitems_id=orderitem_id)
            order_item.delete()
            return Response({'message': 'Item removed from order'}, status=status.HTTP_200_OK)
        except OrderItem.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)