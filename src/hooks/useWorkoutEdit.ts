import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseService";

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

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user)
        throw new Error(userError?.message || "User not authenticated");

      const { data: workout } = await supabase
        .from("workouts")
        .select("*")
        .eq("id", workoutId)
        .eq("user_id", user.id)
        .single();
      setWorkout(workout);

      const { data: exercises } = await supabase
        .from("workout_exercises")
        .select("*")
        .eq("workout_id", workoutId)
        .order("order_in_workout");

      setExercises(exercises || []);
    };

    fetchData();
  }, [workoutId]);

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
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not authenticated");
      return;
    }

    const order = exercises.length + 1;

    const newExercise = {
      workout_id: workoutId,
      user_id: user.id,
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
      console.error("Error adding exercise", error);
    }
  };

  return {
    workout,
    exercises,
    updateTitle,
    updateExercise,
    deleteExercise,
    addExercise,
  };
}
