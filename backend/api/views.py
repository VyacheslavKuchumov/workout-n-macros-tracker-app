# views.py
from rest_framework import generics, permissions
from .models import Customer
from .serializers import CustomerSerializer
from rest_framework import filters

class CustomerListCreateView(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.AllowAny]
    # Enable ordering and pagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['id', 'customer_name']
    ordering = ['customer_name']      # default ordering

class CustomerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'pk'
