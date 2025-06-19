export interface WorkoutExercise {
  id: number;
  workoutId: number;
  name: string;
  orderInWorkout: number;
  weight: number;
  reps: number;
  sets: number;
  userId: string;
}
