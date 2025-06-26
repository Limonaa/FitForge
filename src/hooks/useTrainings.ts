import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";

interface Training {
  id: number;
  title: string;
  nextTraining: string;
  duration: number;
}

interface UseTrainingsResult extends Training {
  loading: boolean;
  error: Error | null;
}

export function useTrainings(limit: number = 3): UseTrainingsResult[] {
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
            data.map((trainings: any) => ({
              id: trainings.id,
              title: trainings.title,
              nextTraining: trainings.next_workout
                ? new Date(trainings.next_workout).toLocaleDateString()
                : "Not scheduled",
              duration: trainings.duration,
            }))
          );
        }
      } catch (err: any) {
        console.error("Error fetching trainings:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  return trainings.map((training) => ({
    ...training,
    loading,
    error,
  }));
}
