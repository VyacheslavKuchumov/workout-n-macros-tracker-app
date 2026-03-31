from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import PasswordChangeView, SignupView, UserDetailView


urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("signup/", SignupView.as_view(), name="signup"),
    path("me/", UserDetailView.as_view(), name="me"),
    path("password/", PasswordChangeView.as_view(), name="password_change"),
]
