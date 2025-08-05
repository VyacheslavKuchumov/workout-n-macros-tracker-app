from django.db import models

# Create your models here.

# Model for muscle groups
class MuscleGroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

# Model for exercises
class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    muscle_group = models.ForeignKey(MuscleGroup, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

# Model for workouts
class Workout(models.Model):
    name = models.CharField(max_length=100)
    workout_date = models.DateField()


    def __str__(self):
        return self.name
    
# Model for workout exercises
class WorkoutExercise(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='exercises')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    set = models.PositiveIntegerField()
    reps = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.exercise.name} in {self.workout.name}"