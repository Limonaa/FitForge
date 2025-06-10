import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";
import { type Workout } from "../types/Workouts";

interface UseWorkoutHistoryResult {
  workouts: Workout[];
  loading: boolean;
  error: Error | null;
}

export function useWorkoutHistory(): UseWorkoutHistoryResult {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!user || userError)
          throw new Error(userError?.message || "user not authenticated");

        const { data, error: fetchError } = await supabase
          .from("workout_history")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });

        if (fetchError) throw fetchError;

        console.log(data);
        setWorkouts(data as Workout[]);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return { workouts, loading, error };
}
