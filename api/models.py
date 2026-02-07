from django.db import models

class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_no = models.BigIntegerField()
    address = models.TextField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    p_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    quantity = models.IntegerField()

    def __str__(self):
        return self.p_name


class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)

    def __str__(self):
        return f"Order #{self.order_id}"


class OrderItem(models.Model):
    orderitems_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order_quantity = models.IntegerField()

    def __str__(self):
        return f"{self.product.p_name} x {self.order_quantity}"