from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Customer, Product, Order

@admin.register(Customer)
class CustomerAdmin(ModelAdmin):
    list_display = ('id', 'customer_name')
    search_fields = ('customer_name',)

@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ('id', 'product_name', 'price', 'stock')
    search_fields = ('product_name',)
    list_filter = ('price',)

@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ('id', 'customer', 'product', 'quantity', 'order_date')
    list_filter = ('order_date', 'product')
    search_fields = ('customer__customer_name',)
