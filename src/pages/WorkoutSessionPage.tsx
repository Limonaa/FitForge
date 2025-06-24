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
  const [completedSets, setCompletedSets] = useState<number[]>([]);
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
    setCompletedSets((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const nextExercise = () => {
    setCompletedSets([]);
    setCurrentIndex((i) => Math.min(i + 1, exercises.length - 1));
  };

  const skipExercise = () => nextExercise();

  const prevExercise = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setCompletedSets([]);
    }
  };

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

      <div className="bg-white p-6 rounded-xl shadow-md space-y-6 text-center">
        <h2 className="text-2xl font-bold">{currentExercise.name}</h2>

        <div className="grid grid-cols-3 gap-4 justify-center text-center">
          <div className="bg-gray-100 rounded-xl py-4">
            <p className="text-sm text-gray-500">Reps</p>
            <p className="text-xl font-bold">{currentExercise.reps}</p>
          </div>
          <div className="bg-gray-100 rounded-xl py-4">
            <p className="text-sm text-gray-500">Sets</p>
            <p className="text-xl font-bold">{currentExercise.sets}</p>
          </div>
          {currentExercise.weight > 0 && (
            <div className="bg-gray-100 rounded-xl py-4">
              <p className="text-sm text-gray-500">Weight (kg)</p>
              <p className="text-xl font-bold">{currentExercise.weight}</p>
            </div>
          )}
        </div>

        <div className="flex justify-center flex-wrap gap-3 mt-4">
          {Array.from({ length: currentExercise.sets }).map((_, i) => {
            const isCompleted = completedSets.includes(i);
            return (
              <button
                key={i}
                onClick={() => toggleSet(i)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold border-2 transition-all ${
                  isCompleted
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <button
          onClick={prevExercise}
          disabled={currentIndex === 0}
          className={`py-3 rounded-xl font-medium ${
            currentIndex === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-amber-500 text-white"
          }`}
        >
          Prev
        </button>
        <button
          onClick={skipExercise}
          className="bg-gray-300 text-sm py-3 rounded-xl font-medium"
        >
          Skip
        </button>
        <button
          onClick={nextExercise}
          className="bg-blue-600 text-white text-sm py-3 rounded-xl font-medium"
        >
          Next
        </button>
        <button
          onClick={finishWorkout}
          className="bg-red-500 text-white text-sm py-3 rounded-xl font-medium"
        >
          End
        </button>
      </div>

      <div className="text-center text-sm text-gray-500 mt-2">
        Exercise {currentIndex + 1} of {exercises.length}
      </div>
    </div>
  );
};

export default WorkoutSessionPage;
