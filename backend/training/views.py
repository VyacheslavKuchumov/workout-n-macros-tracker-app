from datetime import timedelta
from decimal import Decimal

from django.db.models import DecimalField, F, Max, Prefetch, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import filters, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BodyWeightEntry, Exercise, MuscleGroup, Workout, WorkoutExercise, WorkoutSet
from .serializers import (
    BodyWeightEntrySerializer,
    ExerciseSerializer,
    MuscleGroupSerializer,
    WorkoutReadSerializer,
    WorkoutWriteSerializer,
)


class MuscleGroupViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MuscleGroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    queryset = MuscleGroup.objects.all()


class ExerciseViewSet(viewsets.ModelViewSet):
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "notes", "muscle_group__name"]
    ordering_fields = ["name", "created_at", "updated_at"]
    ordering = ["name"]

    def get_queryset(self):
        queryset = Exercise.objects.filter(user=self.request.user).select_related("muscle_group")
        muscle_group_id = self.request.query_params.get("muscle_group")
        if muscle_group_id:
            queryset = queryset.filter(muscle_group_id=muscle_group_id)
        archived = self.request.query_params.get("archived")
        if archived in {"true", "false"}:
            queryset = queryset.filter(is_archived=(archived == "true"))
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WorkoutViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["workout_date", "updated_at", "created_at"]
    ordering = ["-workout_date"]

    def get_queryset(self):
        exercise_queryset = WorkoutExercise.objects.select_related(
            "exercise",
            "exercise__muscle_group",
        ).prefetch_related("sets")
        queryset = (
            Workout.objects.filter(user=self.request.user)
            .prefetch_related(Prefetch("exercises", queryset=exercise_queryset))
            .order_by("-workout_date")
        )
        month = self.request.query_params.get("month")
        date = self.request.query_params.get("date")
        if month:
            year, month_number = month.split("-")
            queryset = queryset.filter(
                workout_date__year=int(year),
                workout_date__month=int(month_number),
            )
        if date:
            queryset = queryset.filter(workout_date=date)
        return queryset

    def get_serializer_class(self):
        if self.action in {"list", "retrieve"}:
            return WorkoutReadSerializer
        return WorkoutWriteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        workout = serializer.save()
        return Response(
            WorkoutReadSerializer(workout, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        workout = serializer.save()
        return Response(WorkoutReadSerializer(workout).data)


class BodyWeightEntryViewSet(viewsets.ModelViewSet):
    serializer_class = BodyWeightEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["entry_date", "updated_at", "created_at"]
    ordering = ["-entry_date"]

    def get_queryset(self):
        queryset = BodyWeightEntry.objects.filter(user=self.request.user)
        date_from = self.request.query_params.get("date_from")
        date_to = self.request.query_params.get("date_to")
        if date_from:
            queryset = queryset.filter(entry_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(entry_date__lte=date_to)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.localdate()
        month_start = today.replace(day=1)
        month_end = today + timedelta(days=90)

        workout_queryset = Workout.objects.filter(user=user)
        recent_workouts = workout_queryset.prefetch_related(
            Prefetch(
                "exercises",
                queryset=WorkoutExercise.objects.select_related("exercise").prefetch_related("sets"),
            )
        )[:5]

        latest_body_weight = (
            BodyWeightEntry.objects.filter(user=user)
            .order_by("-entry_date", "-updated_at")
            .first()
        )

        body_weight_series_queryset = list(
            BodyWeightEntry.objects.filter(
                user=user,
                entry_date__gte=today - timedelta(days=90),
            )
            .order_by("entry_date")
            .values("entry_date", "weight_kg")
        )
        body_weight_series = [
            {
                "date": item["entry_date"],
                "weight_kg": item["weight_kg"],
            }
            for item in body_weight_series_queryset
        ]

        exercise_options = list(
            Exercise.objects.filter(user=user, is_archived=False)
            .select_related("muscle_group")
            .order_by("name")
            .values("id", "name", "muscle_group__name")
        )

        selected_exercise_id = request.query_params.get("exercise_id")
        if selected_exercise_id is None and exercise_options:
            selected_exercise_id = str(exercise_options[0]["id"])

        progress_series = []
        selected_exercise = None

        if selected_exercise_id:
            progress_queryset = (
                WorkoutSet.objects.filter(
                    workout_exercise__exercise_id=selected_exercise_id,
                    workout_exercise__workout__user=user,
                )
                .values("workout_exercise__workout__workout_date")
                .annotate(
                    max_weight=Max("weight_kg"),
                    max_reps=Max("reps"),
                    volume=Coalesce(
                        Sum(
                            F("reps") * F("weight_kg"),
                            output_field=DecimalField(max_digits=12, decimal_places=2),
                        ),
                        Decimal("0"),
                    ),
                )
                .order_by("workout_exercise__workout__workout_date")
            )
            progress_series = [
                {
                    "date": item["workout_exercise__workout__workout_date"],
                    "max_weight": item["max_weight"],
                    "max_reps": item["max_reps"],
                    "volume": item["volume"],
                }
                for item in progress_queryset
            ]
            selected_exercise = next(
                (exercise for exercise in exercise_options if str(exercise["id"]) == selected_exercise_id),
                None,
            )

        total_sets_last_30_days = WorkoutSet.objects.filter(
            workout_exercise__workout__user=user,
            workout_exercise__workout__workout_date__gte=today - timedelta(days=30),
        ).count()

        upcoming_count = workout_queryset.filter(
            workout_date__gte=today,
            workout_date__lte=month_end,
        ).count()

        return Response(
            {
                "summary": {
                    "total_workouts": workout_queryset.count(),
                    "workouts_this_month": workout_queryset.filter(
                        workout_date__gte=month_start,
                        workout_date__lte=today,
                    ).count(),
                    "upcoming_workouts": upcoming_count,
                    "total_sets_last_30_days": total_sets_last_30_days,
                    "latest_body_weight": latest_body_weight.weight_kg if latest_body_weight else None,
                },
                "recent_workouts": WorkoutReadSerializer(recent_workouts, many=True).data,
                "body_weight_series": body_weight_series,
                "exercise_options": [
                    {
                        "id": item["id"],
                        "name": item["name"],
                        "muscle_group_name": item["muscle_group__name"],
                    }
                    for item in exercise_options
                ],
                "exercise_progress": {
                    "selected_exercise_id": int(selected_exercise_id) if selected_exercise_id else None,
                    "selected_exercise_name": selected_exercise["name"] if selected_exercise else None,
                    "series": progress_series,
                },
            }
        )
