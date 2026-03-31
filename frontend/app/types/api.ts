export interface LoginPayload {
  username: string
  password: string
}

export interface SignupPayload extends LoginPayload {
  email?: string
  first_name?: string
  last_name?: string
}

export interface PasswordChangePayload {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface UserProfile {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  target_weight_kg: string | null
  weekly_workout_goal: number
  bio: string
}

export interface MuscleGroup {
  id: number
  name: string
  slug: string
  description: string
}

export interface Exercise {
  id: number
  name: string
  notes: string
  is_archived: boolean
  muscle_group: MuscleGroup
  created_at: string
  updated_at: string
}

export interface WorkoutSet {
  id?: number
  order: number
  reps: number
  weight_kg: number | string
}

export interface WorkoutExercise {
  id?: number
  order: number
  notes: string
  exercise: Exercise
  sets: WorkoutSet[]
}

export interface WorkoutExercisePayload {
  exercise_id: number
  order: number
  notes: string
  sets: WorkoutSet[]
}

export interface Workout {
  id: number
  name: string
  workout_date: string
  focus: string
  notes: string
  total_sets: number
  total_volume: number
  exercises: WorkoutExercise[]
  created_at: string
  updated_at: string
}

export interface WorkoutPayload {
  name: string
  workout_date: string
  focus: string
  notes: string
  exercises: WorkoutExercisePayload[]
}

export interface BodyWeightEntry {
  id: number
  entry_date: string
  weight_kg: string
  notes: string
  created_at: string
  updated_at: string
}

export interface DashboardPoint {
  date: string
  weight_kg?: string
  max_weight?: string
  max_reps?: number
  volume?: string
}

export interface DashboardResponse {
  summary: {
    total_workouts: number
    workouts_this_month: number
    upcoming_workouts: number
    total_sets_last_30_days: number
    latest_body_weight: string | null
  }
  recent_workouts: Workout[]
  body_weight_series: DashboardPoint[]
  exercise_options: Array<{
    id: number
    name: string
    muscle_group_name: string
  }>
  exercise_progress: {
    selected_exercise_id: number | null
    selected_exercise_name: string | null
    series: DashboardPoint[]
  }
}
