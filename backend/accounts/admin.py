from django.contrib import admin

from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "target_weight_kg", "weekly_workout_goal", "updated_at")
    search_fields = ("user__username", "user__email")
