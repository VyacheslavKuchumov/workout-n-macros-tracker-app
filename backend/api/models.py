from django.db import models

# Create your models here.

# Model for Customer
class Customer(models.Model):
    customer_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.customer_name}"
    
# Model for Product
class Product(models.Model):
    product_name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product_name} - ${self.price}"

# Model for Order
class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.customer} for {self.quantity} x {self.product}"