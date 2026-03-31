from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class MuscleGroup(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    ordering = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["ordering", "name"]

    def __str__(self):
        return self.name


class Exercise(TimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="exercises",
    )
    muscle_group = models.ForeignKey(
        MuscleGroup,
        on_delete=models.PROTECT,
        related_name="exercises",
    )
    name = models.CharField(max_length=120)
    notes = models.TextField(blank=True)
    is_archived = models.BooleanField(default=False)

    class Meta:
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"],
                name="unique_exercise_name_per_user",
            )
        ]

    def __str__(self):
        return self.name


class Workout(TimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workouts",
    )
    name = models.CharField(max_length=120, blank=True)
    workout_date = models.DateField()
    focus = models.CharField(max_length=120, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-workout_date", "-updated_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "workout_date"],
                name="unique_workout_per_user_per_day",
            )
        ]

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = f"Workout for {self.workout_date.isoformat()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class WorkoutExercise(TimeStampedModel):
    workout = models.ForeignKey(
        Workout,
        on_delete=models.CASCADE,
        related_name="exercises",
    )
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.PROTECT,
        related_name="workout_entries",
    )
    order = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.exercise.name} on {self.workout.workout_date}"


class WorkoutSet(TimeStampedModel):
    workout_exercise = models.ForeignKey(
        WorkoutExercise,
        on_delete=models.CASCADE,
        related_name="sets",
    )
    order = models.PositiveIntegerField(default=1)
    reps = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    weight_kg = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Set {self.order} of {self.workout_exercise}"


class BodyWeightEntry(TimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="body_weight_entries",
    )
    entry_date = models.DateField()
    weight_kg = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(1)],
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-entry_date", "-updated_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "entry_date"],
                name="unique_body_weight_per_user_per_day",
            )
        ]

    def __str__(self):
        return f"{self.user.username} - {self.entry_date}"
