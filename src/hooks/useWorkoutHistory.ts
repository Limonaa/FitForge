import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";
import { type Workout } from "../types/Workout";
import { useUser } from "../context/UserContext";

interface UseWorkoutHistoryResult {
  workouts: Workout[];
  loading: boolean;
  error: Error | null;
}

export function useWorkoutHistory(filter?: string): UseWorkoutHistoryResult {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, loading: userLoading } = useUser();

  useEffect(() => {
    if (userLoading) return;
    if (!userId) {
      setWorkouts([]);
      setLoading(false);
      return;
    }
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("workout_history")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: false });

        if (filter) {
          query = query.ilike("name", `%${filter}%`);
        }

        const { data, error: fetchError } = await query;
        if (fetchError) throw fetchError;

        setWorkouts(data as Workout[]);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [filter, userId, userLoading]);

  return { workouts, loading, error };
}
