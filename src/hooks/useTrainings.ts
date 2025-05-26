import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";

interface Training {
  title: string;
  nextTraining: string;
  lastDone: string;
}

interface UseTrainingsResult extends Training {
  loading: boolean;
  error: Error | null;
}

const defaultTraining: Training = {
  title: "",
  nextTraining: "Not scheduled",
  lastDone: "Never done",
};

export function useTrainings(): UseTrainingsResult[] {
  const [trainings, setTrainings] = useState<Training[]>([defaultTraining]);
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
          .from("trainings")
          .select("title, next_date, last_date")
          .order("next_date", { ascending: true })
          .limit(3);
        if (fetchError) throw fetchError;
        if (data) {
          setTrainings(
            data.map((trainings: any) => ({
              title: trainings.title,
              nextTraining: trainings.next_date
                ? new Date(trainings.next_date).toLocaleDateString()
                : "Not scheduled",
              lastDone: trainings.last_date
                ? new Date(trainings.last_date).toLocaleDateString()
                : "Never done",
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
