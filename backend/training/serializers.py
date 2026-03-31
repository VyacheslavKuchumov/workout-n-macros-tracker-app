from django.db import transaction
from rest_framework import serializers

from .models import BodyWeightEntry, Exercise, MuscleGroup, Workout, WorkoutExercise, WorkoutSet


class MuscleGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MuscleGroup
        fields = ["id", "name", "slug", "description"]


class ExerciseSerializer(serializers.ModelSerializer):
    muscle_group = MuscleGroupSerializer(read_only=True)
    muscle_group_id = serializers.PrimaryKeyRelatedField(
        queryset=MuscleGroup.objects.all(),
        source="muscle_group",
        write_only=True,
    )

    class Meta:
        model = Exercise
        fields = [
            "id",
            "name",
            "notes",
            "is_archived",
            "muscle_group",
            "muscle_group_id",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        user = self.context["request"].user
        cleaned_value = value.strip()
        queryset = Exercise.objects.filter(user=user, name__iexact=cleaned_value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("You already have an exercise with this name.")
        return cleaned_value


class WorkoutSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSet
        fields = ["id", "order", "reps", "weight_kg"]


class WorkoutExerciseReadSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    sets = WorkoutSetSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutExercise
        fields = ["id", "order", "notes", "exercise", "sets"]


class WorkoutSetWriteSerializer(serializers.Serializer):
    order = serializers.IntegerField(min_value=1)
    reps = serializers.IntegerField(min_value=1)
    weight_kg = serializers.DecimalField(max_digits=6, decimal_places=2, min_value=0)


class WorkoutExerciseWriteSerializer(serializers.Serializer):
    exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.none(),
        source="exercise",
    )
    order = serializers.IntegerField(min_value=1)
    notes = serializers.CharField(required=False, allow_blank=True)
    sets = WorkoutSetWriteSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["exercise_id"].queryset = Exercise.objects.filter(user=request.user)

    def validate_sets(self, value):
        if not value:
            raise serializers.ValidationError("Each exercise needs at least one set.")
        return value


class WorkoutReadSerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseReadSerializer(many=True, read_only=True)
    total_sets = serializers.SerializerMethodField()
    total_volume = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = [
            "id",
            "name",
            "workout_date",
            "focus",
            "notes",
            "total_sets",
            "total_volume",
            "exercises",
            "created_at",
            "updated_at",
        ]

    def get_total_sets(self, obj):
        return sum(exercise.sets.count() for exercise in obj.exercises.all())

    def get_total_volume(self, obj):
        total = 0
        for exercise in obj.exercises.all():
            for workout_set in exercise.sets.all():
                total += workout_set.reps * float(workout_set.weight_kg)
        return round(total, 2)


class WorkoutWriteSerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseWriteSerializer(many=True)

    class Meta:
        model = Workout
        fields = ["id", "name", "workout_date", "focus", "notes", "exercises"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["exercises"].child.fields["exercise_id"].queryset = Exercise.objects.filter(
                user=request.user
            )

    def validate_exercises(self, value):
        if not value:
            raise serializers.ValidationError("A workout needs at least one exercise.")
        return value

    def validate(self, attrs):
        request = self.context["request"]
        workout_date = attrs.get("workout_date", getattr(self.instance, "workout_date", None))
        queryset = Workout.objects.filter(user=request.user, workout_date=workout_date)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if workout_date and queryset.exists():
            raise serializers.ValidationError(
                {"workout_date": "You already have a workout planned for this day."}
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        exercises_data = validated_data.pop("exercises")
        workout = Workout.objects.create(user=self.context["request"].user, **validated_data)
        self._sync_exercises(workout, exercises_data)
        return workout

    @transaction.atomic
    def update(self, instance, validated_data):
        exercises_data = validated_data.pop("exercises")
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        instance.exercises.all().delete()
        self._sync_exercises(instance, exercises_data)
        return instance

    def _sync_exercises(self, workout, exercises_data):
        for exercise_data in exercises_data:
            sets_data = exercise_data.pop("sets")
            workout_exercise = WorkoutExercise.objects.create(workout=workout, **exercise_data)
            WorkoutSet.objects.bulk_create(
                [
                    WorkoutSet(workout_exercise=workout_exercise, **workout_set)
                    for workout_set in sets_data
                ]
            )


class BodyWeightEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyWeightEntry
        fields = ["id", "entry_date", "weight_kg", "notes", "created_at", "updated_at"]
