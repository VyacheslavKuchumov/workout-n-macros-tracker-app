from django.contrib import admin

from .models import BodyWeightEntry, Exercise, MuscleGroup, Workout, WorkoutExercise, WorkoutSet


class WorkoutSetInline(admin.TabularInline):
    model = WorkoutSet
    extra = 0


class WorkoutExerciseInline(admin.TabularInline):
    model = WorkoutExercise
    extra = 0


@admin.register(MuscleGroup)
class MuscleGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "ordering")
    search_fields = ("name", "description")
    ordering = ("ordering", "name")


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "muscle_group", "is_archived", "updated_at")
    search_fields = ("name", "notes", "user__username")
    list_filter = ("muscle_group", "is_archived")


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "workout_date", "focus", "updated_at")
    search_fields = ("name", "focus", "notes", "user__username")
    list_filter = ("workout_date",)
    inlines = [WorkoutExerciseInline]


@admin.register(WorkoutExercise)
class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ("workout", "exercise", "order", "updated_at")
    search_fields = ("workout__name", "exercise__name")
    inlines = [WorkoutSetInline]


@admin.register(BodyWeightEntry)
class BodyWeightEntryAdmin(admin.ModelAdmin):
    list_display = ("user", "entry_date", "weight_kg", "updated_at")
    search_fields = ("user__username", "notes")
    list_filter = ("entry_date",)
