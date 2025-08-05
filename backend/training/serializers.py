from rest_framework import serializers
from . import models

class MuscleGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MuscleGroup
        fields = ['id', 'name', 'description']

class ExerciseSerializer(serializers.ModelSerializer):
    muscle_group = MuscleGroupSerializer()

    class Meta:
        model = models.Exercise
        fields = ['id', 'name', 'description', 'muscle_group']

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Workout
        fields = ['id', 'name', 'workout_date']

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()

    class Meta:
        model = models.WorkoutExercise
        fields = ['id', 'workout', 'exercise', 'set', 'reps']