import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";

interface Training {
  id: number;
  title: string;
  nextTraining: string;
}

interface UseTrainingsResult extends Training {
  loading: boolean;
  error: Error | null;
}

export function useTrainings(): UseTrainingsResult[] {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user)
          throw new Error(userError?.message || "Not authenticated");

        const { data, error: fetchError } = await supabase
          .from("upcomming_trainings")
          .select("*")
          .order("next_workout", { ascending: true })
          .limit(3);
        if (fetchError) throw fetchError;
        if (data) {
          setTrainings(
            data.map((trainings: any) => ({
              id: trainings.id,
              title: trainings.title,
              nextTraining: trainings.next_workout
                ? new Date(trainings.next_workout).toLocaleDateString()
                : "Not scheduled",
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
