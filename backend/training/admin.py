from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import MuscleGroup, Exercise, Workout, WorkoutExercise

@admin.register(MuscleGroup)
class MuscleGroupAdmin(ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')

@admin.register(Exercise)
class ExerciseAdmin(ModelAdmin):
    list_display = ('name', 'description', 'muscle_group')
    search_fields = ('name', 'description', 'muscle_group__name')

@admin.register(Workout)
class WorkoutAdmin(ModelAdmin):
    list_display = ('name', 'workout_date')
    search_fields = ('name', 'workout_date')

@admin.register(WorkoutExercise)
class WorkoutExerciseAdmin(ModelAdmin):
    list_display = ('workout', 'exercise', 'set', 'reps')
    search_fields = ('workout__name', 'exercise__name')
