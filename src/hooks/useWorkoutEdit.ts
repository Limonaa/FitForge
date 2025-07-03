import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";

interface Workout {
  id: number;
  title: string;
  next_workout: string;
  duration: number;
}

interface Exercise {
  id: number;
  workout_id: number;
  name: string;
  order_in_workout: number;
  weight: number;
  reps: number;
  sets: number;
  user_id: string;
}

export function useWorkoutEdit(workoutId: number) {
  const [workout, setWorkout] = useState<Workout>({
    id: workoutId,
    title: "",
    next_workout: "",
    duration: 0,
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { userId, loading: userLoading } = useUser();

  useEffect(() => {
    if (userLoading || !userId) return;

    const fetchData = async () => {
      const { data: workout, error: fetchError } = await supabase
        .from("workouts")
        .select("*")
        .eq("id", workoutId)
        .eq("user_id", userId)
        .single();
      if (fetchError) {
        setError(fetchError);
      }

      setWorkout(workout);

      const { data: exercises, error: exercisesError } = await supabase
        .from("workout_exercises")
        .select("*")
        .eq("workout_id", workoutId)
        .order("order_in_workout");
      if (exercisesError) {
        setError(exercisesError);
      }

      setExercises(exercises || []);
    };

    fetchData();
  }, [workoutId, userId, userLoading]);

  const updateTitle = async (title: string) => {
    await supabase.from("workouts").update({ title }).eq("id", workoutId);
    setWorkout((prev) => ({ ...prev, title }));
  };

  const updateExercise = async (index: number, updated: Partial<Exercise>) => {
    const current = exercises[index];
    if (!current) return;

    const updatedExercise = { ...current, ...updated };

    await supabase
      .from("workout_exercises")
      .update(updatedExercise)
      .eq("id", current.id);

    setExercises((prev) =>
      prev.map((e, i) => (i === index ? updatedExercise : e))
    );
  };

  const deleteExercise = async (index: number) => {
    const id = exercises[index]?.id;
    if (!id) return;

    await supabase.from("workout_exercises").delete().eq("id", id);
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const addExercise = async () => {
    const order = exercises.length + 1;

    const newExercise = {
      workout_id: workoutId,
      user_id: userId,
      name: "",
      sets: 3,
      reps: 10,
      weight: 0,
      order_in_workout: order,
    };

    const { data, error } = await supabase
      .from("workout_exercises")
      .insert(newExercise)
      .select()
      .single();

    if (!error && data) {
      setExercises((prev) => [...prev, data]);
    } else {
      setError(error);
    }
  };

  return {
    workout,
    exercises,
    updateTitle,
    updateExercise,
    deleteExercise,
    addExercise,
    error,
  };
}
