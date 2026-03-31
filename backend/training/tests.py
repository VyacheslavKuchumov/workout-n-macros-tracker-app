from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import BodyWeightEntry, Exercise, MuscleGroup, Workout


User = get_user_model()


class TrainingApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="lifter",
            password="StrongPassword123!",
        )
        self.other_user = User.objects.create_user(
            username="other",
            password="StrongPassword123!",
        )
        self.chest = MuscleGroup.objects.get(slug="chest")
        self.back = MuscleGroup.objects.get(slug="back")
        self.bench = Exercise.objects.create(
            user=self.user,
            muscle_group=self.chest,
            name="Bench Press",
        )
        self.row = Exercise.objects.create(
            user=self.user,
            muscle_group=self.back,
            name="Barbell Row",
        )
        self.client.force_authenticate(user=self.user)

    def test_create_workout_and_dashboard_stats(self):
        workout_response = self.client.post(
            "/api/training/workouts/",
            {
                "name": "Push Day",
                "workout_date": "2026-03-20",
                "focus": "Chest strength",
                "notes": "Felt sharp.",
                "exercises": [
                    {
                        "exercise_id": self.bench.id,
                        "order": 1,
                        "notes": "Paused sets",
                        "sets": [
                            {"order": 1, "reps": 8, "weight_kg": "80.00"},
                            {"order": 2, "reps": 6, "weight_kg": "85.00"},
                        ],
                    },
                    {
                        "exercise_id": self.row.id,
                        "order": 2,
                        "notes": "",
                        "sets": [
                            {"order": 1, "reps": 10, "weight_kg": "70.00"},
                        ],
                    },
                ],
            },
            format="json",
        )

        self.assertEqual(workout_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(workout_response.data["total_sets"], 3)
        self.assertEqual(len(workout_response.data["exercises"]), 2)

        body_weight_response = self.client.post(
            "/api/training/body-weights/",
            {
                "entry_date": "2026-03-20",
                "weight_kg": "84.40",
                "notes": "Morning weigh-in",
            },
            format="json",
        )

        self.assertEqual(body_weight_response.status_code, status.HTTP_201_CREATED)

        dashboard_response = self.client.get(
            f"/api/training/dashboard/?exercise_id={self.bench.id}"
        )

        self.assertEqual(dashboard_response.status_code, status.HTTP_200_OK)
        self.assertEqual(dashboard_response.data["summary"]["total_workouts"], 1)
        self.assertEqual(str(dashboard_response.data["summary"]["latest_body_weight"]), "84.40")
        self.assertEqual(
            dashboard_response.data["exercise_progress"]["selected_exercise_name"],
            "Bench Press",
        )
        self.assertEqual(len(dashboard_response.data["exercise_progress"]["series"]), 1)

    def test_workout_list_filters_by_user_and_month(self):
        Workout.objects.create(
            user=self.user,
            name="March Session",
            workout_date=date(2026, 3, 10),
        )
        Workout.objects.create(
            user=self.user,
            name="April Session",
            workout_date=date(2026, 4, 2),
        )
        Workout.objects.create(
            user=self.other_user,
            name="Other User Session",
            workout_date=date(2026, 3, 8),
        )

        response = self.client.get("/api/training/workouts/?month=2026-03")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "March Session")

    def test_body_weight_entries_are_user_scoped(self):
        BodyWeightEntry.objects.create(
            user=self.user,
            entry_date=date(2026, 3, 18),
            weight_kg="85.10",
        )
        BodyWeightEntry.objects.create(
            user=self.other_user,
            entry_date=date(2026, 3, 18),
            weight_kg="91.00",
        )

        response = self.client.get("/api/training/body-weights/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["weight_kg"], "85.10")
