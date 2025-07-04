# urls.py
from django.urls import path
from .views import CustomerListCreateView, CustomerRetrieveUpdateDestroyView

urlpatterns = [
    path('customers/', CustomerListCreateView.as_view(), name='customer-list'),
    path('customers/<int:pk>/', CustomerRetrieveUpdateDestroyView.as_view(), name='customer-detail'),
]
