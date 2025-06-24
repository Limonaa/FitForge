import React, { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseService";
import { Timer } from "lucide-react";

const WorkoutSessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSets, setComletedSets] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const currentExercise = exercises[currentIndex];

  useEffect(() => {
    const fetchWorkout = async () => {
      const { data: workout } = await supabase
        .from("workouts")
        .select("*")
        .eq("id", id)
        .single();
      setWorkout(workout);

      const { data: exercises } = await supabase
        .from("workout_exercises")
        .select("*")
        .eq("workout_id", id)
        .order("order_in_workout");
      setExercises(exercises || []);
      setStartTime(new Date());
    };

    fetchWorkout();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        const seconds = Math.floor(
          (new Date().getTime() - startTime.getTime()) / 1000
        );
        setElapsed(seconds);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const toggleSet = (index: number) => {
    setComletedSets((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const nextExercise = () => {
    setComletedSets([]);
    setCurrentIndex((i) => Math.min(i + 1, exercises.length - 1));
  };

  const skipExercise = () => nextExercise();

  const finishWorkout = () => {
    if (confirm("Are you sure you want to ent the workout?")) {
      navigate("/workouts");
      // TODO summary, add to history
    }
  };

  if (!workout || !currentExercise) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex text-center text-gray-600 gap-2">
        <Timer />
        {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
      </div>
      <p className="text-2xl font-bold text-center">{workout.title}</p>

      <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
        <p className="text-xl font-semibold">{currentExercise.name}</p>
        <p className="text-sm text-gray-500">
          Reps: {currentExercise.reps} | Sets: {currentExercise.sets}{" "}
          {currentExercise.weight > 0 && (
            <>| Weight: {currentExercise.weight}</>
          )}
        </p>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: currentExercise.sets }).map((_, i) => (
            <button
              key={i}
              onClick={() => toggleSet(i)}
              className={`w-8 h-8 rounded-full border-2 ${
                completedSets.includes(i)
                  ? "bg-green-500 border-green-500"
                  : "bg-white border-gray-50"
              }`}
            ></button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-between">
        <button
          onClick={skipExercise}
          className="bg-gray-300 text-sm px-4 py-2 rounded-md"
        >
          Skip
        </button>
        <button
          onClick={nextExercise}
          className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md"
        >
          Next
        </button>
        <button
          onClick={finishWorkout}
          className="bg-red-500 text-white text-sm px-4 py-2 rounded-md"
        >
          End workout
        </button>
      </div>
      <div className="text-center text-sm text-gray-500">
        Exercise {currentIndex + 1} of {exercises.length}
      </div>
    </div>
  );
};

export default WorkoutSessionPage;
