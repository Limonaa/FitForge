import { useEffect, useState } from "react";
import { type WorkoutExercise } from "../types/WorkoutExercise";
import { supabase } from "../services/supabaseService";

export function useWorkoutDetails(workoutId: number | null) {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!workoutId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("workout_exercises")
        .select("*")
        .eq("workout_id", workoutId);

      if (error) {
        setError(error);
        setExercises([]);
      } else {
        setExercises(data as WorkoutExercise[]);
      }

      setLoading(false);
    };

    fetchDetails();
  }, [workoutId]);

  return { exercises, loading, error };
}
