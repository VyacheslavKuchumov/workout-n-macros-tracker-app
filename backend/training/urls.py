from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BodyWeightEntryViewSet, DashboardView, ExerciseViewSet, MuscleGroupViewSet, WorkoutViewSet


router = DefaultRouter()
router.register("muscle-groups", MuscleGroupViewSet, basename="muscle-group")
router.register("exercises", ExerciseViewSet, basename="exercise")
router.register("workouts", WorkoutViewSet, basename="workout")
router.register("body-weights", BodyWeightEntryViewSet, basename="body-weight")

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("", include(router.urls)),
]
