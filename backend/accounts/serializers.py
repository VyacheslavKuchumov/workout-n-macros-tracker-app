from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import UserProfile


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    target_weight_kg = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        required=False,
        allow_null=True,
        source="profile.target_weight_kg",
    )
    weekly_workout_goal = serializers.IntegerField(
        required=False,
        source="profile.weekly_workout_goal",
    )
    bio = serializers.CharField(required=False, allow_blank=True, source="profile.bio")

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "target_weight_kg",
            "weekly_workout_goal",
            "bio",
        ]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", {})
        profile, _ = UserProfile.objects.get_or_create(user=instance)

        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        for field, value in profile_data.items():
            setattr(profile, field, value)
        profile.save()

        return instance


class UserSignupSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "first_name": {"required": False, "allow_blank": True},
            "last_name": {"required": False, "allow_blank": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        validate_password(password, user)
        user.set_password(password)
        user.save()
        return user


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError(
                {"current_password": "Current password is incorrect."}
            )

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        validate_password(attrs["new_password"], user)
        return attrs
