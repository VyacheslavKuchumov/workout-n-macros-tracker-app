# urls.py
from django.urls import path
from .views import (
    MuscleGroupList, MuscleGroupDetail,
    ExerciseList, ExerciseDetail, WorkoutExerciseDetail,
    WorkoutList, WorkoutDetail,
    WorkoutExerciseList
)

urlpatterns = [
    path('muscle-groups/', MuscleGroupList.as_view(), name='muscle-group-list'),
    path('muscle-groups/<int:pk>/', MuscleGroupDetail.as_view(), name='muscle-group-detail'),
    
    path('exercises/', ExerciseList.as_view(), name='exercise-list'),
    path('exercises/<int:pk>/', ExerciseDetail.as_view(), name='exercise-detail'),
    
    path('workouts/', WorkoutList.as_view(), name='workout-list'),
    path('workouts/<int:pk>/', WorkoutDetail.as_view(), name='workout-detail'),
    
    path('workout-exercises/', WorkoutExerciseList.as_view(), name='workout-exercise-list'),
    path('workout-exercises/<int:pk>/', WorkoutExerciseDetail.as_view(), name='workout-exercise-detail'),
]
