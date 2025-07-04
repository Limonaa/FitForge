import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";

interface Training {
  id: number;
  title: string;
  nextTraining: string;
  duration: number;
}

interface UseTrainingsResult {
  trainings: Training[];
  loading: boolean;
  error: Error | null;
}

export function useTrainings(limit: number = 3): UseTrainingsResult {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("upcomming_trainings")
          .select("*")
          .order("next_workout", { ascending: true })
          .limit(limit);
        if (fetchError) throw fetchError;

        if (data) {
          setTrainings(
            data.map((t: any) => ({
              id: t.id,
              title: t.title,
              nextTraining: t.next_workout
                ? new Date(t.next_workout).toLocaleDateString()
                : "Not scheduled",
              duration: t.duration,
            }))
          );
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, [limit]);

  return { trainings, loading, error };
}
