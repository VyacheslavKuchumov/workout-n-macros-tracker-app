from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AccountsApiTests(APITestCase):
    def test_signup_returns_user_payload_and_creates_profile(self):
        response = self.client.post(
            "/api/accounts/signup/",
            {
                "username": "slava",
                "email": "slava@example.com",
                "first_name": "Slava",
                "last_name": "Tester",
                "password": "StrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["username"], "slava")
        self.assertEqual(response.data["email"], "slava@example.com")
        self.assertTrue(User.objects.filter(username="slava").exists())
        self.assertTrue(User.objects.get(username="slava").profile)

    def test_profile_update_and_password_change(self):
        user = User.objects.create_user(
            username="athlete",
            password="StrongPassword123!",
            email="old@example.com",
        )
        self.client.force_authenticate(user=user)

        profile_response = self.client.patch(
            "/api/accounts/me/",
            {
                "email": "new@example.com",
                "first_name": "Gym",
                "target_weight_kg": "82.50",
                "weekly_workout_goal": 5,
                "bio": "Working on progressive overload.",
            },
            format="json",
        )

        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data["email"], "new@example.com")
        self.assertEqual(profile_response.data["weekly_workout_goal"], 5)

        password_response = self.client.post(
            "/api/accounts/password/",
            {
                "current_password": "StrongPassword123!",
                "new_password": "EvenStrongerPassword456!",
                "confirm_password": "EvenStrongerPassword456!",
            },
            format="json",
        )

        self.assertEqual(password_response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.check_password("EvenStrongerPassword456!"))
