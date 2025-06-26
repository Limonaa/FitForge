import React, { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseService";
import { Timer } from "lucide-react";
import type { utimes } from "fs";

const WorkoutSessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSetsMap, setCompletedSetsMap] = useState<
    Record<number, number[]>
  >({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);

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
    if (!startTime || isWorkoutFinished) return;

    const timer = setInterval(() => {
      const seconds = Math.floor(
        (new Date().getTime() - startTime.getTime()) / 1000
      );
      setElapsed(seconds);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, isWorkoutFinished]);

  const toggleSet = (setIndex: number) => {
    setCompletedSetsMap((prev) => {
      const currentSets = prev[currentIndex] || [];
      const newSets = currentSets.includes(setIndex)
        ? currentSets.filter((i) => i !== setIndex)
        : [...currentSets, setIndex];

      return {
        ...prev,
        [currentIndex]: newSets,
      };
    });
  };

  const nextExercise = () => {
    setCurrentIndex((i) => Math.min(i + 1, exercises.length - 1));
  };

  const skipExercise = () => nextExercise();

  const prevExercise = () => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : 0));
  };

  const finishWorkout = () => {
    const confirmEnd = confirm("Na pewno chcesz zakończyć trening?");
    if (!confirmEnd) return;

    setIsWorkoutFinished(true);
    setShowSummary(true);
  };

  const getSummaryData = () => {
    let totalReps = 0;
    let totalSets = 0;
    let totalWeight = 0;

    exercises.forEach((exercise, index) => {
      const completedSetIndices = completedSetsMap[index] || [];
      const completedCount = completedSetIndices.length;

      const reps = exercise.reps;
      const weight = exercise.weight || 0;

      totalSets += completedCount;
      totalReps += reps * completedCount;
      totalWeight += weight * reps * completedCount;
    });

    return {
      totalReps,
      totalSets,
      totalWeight,
      duration: elapsed,
    };
  };

  const handleSaveWorkout = async () => {
    const { totalReps, totalSets, totalWeight, duration } = getSummaryData();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user || userError)
      throw userError?.message || "User not authenticated";

    const { error } = await supabase.from("workout_history").insert({
      user_id: user.id,
      workout_id: workout.id,
      name: workout.title,
      reps: totalReps,
      sets: totalSets,
      weight: totalWeight,
      time: duration,
      date: new Date().toISOString().split("T")[0],
    });

    if (error) {
      alert("Błąd przy zapisie do historii" + error.message);
      return;
    }

    navigate("/workouts");
  };

  const handleCancelSummary = () => {
    const confirmBack = confirm("Na pewno chcesz wrócić bez zapisywania?");
    if (confirmBack) {
      setShowSummary(false);
    }
  };

  if (!workout || !currentExercise) return <p>Loading...</p>;

  if (showSummary) {
    const { totalReps, totalSets, totalWeight, duration } = getSummaryData();

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Podsumowanie treningu
        </h2>
        <div className="space-y-2 text-center">
          <p>
            <strong>Trening:</strong> {workout.title}
          </p>
          <p>
            <strong>Czas:</strong> {Math.floor(duration / 60)}:
            {String(duration % 60).padStart(2, "0")}
          </p>
          <p>
            <strong>Serie:</strong> {totalSets}
          </p>
          <p>
            <strong>Powtórzenia:</strong> {totalReps}
          </p>
          <p>
            <strong>Ciężar (kg):</strong> {totalWeight}
          </p>
        </div>

        <div className="space-y-2">
          {exercises.map((exercise, index) => {
            const completed = completedSetsMap[index]?.length || 0;
            return (
              <div key={exercise.id} className="bg-gray-100 rounded-xl p-4">
                <p className="font-bold">{exercise.name}</p>
                <p>
                  {completed} / {exercise.sets} serii wykonano
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={handleSaveWorkout}
            className="bg-green-600 text-white py-3 rounded-xl font-medium"
          >
            Zapisz trening
          </button>
          <button
            onClick={handleCancelSummary}
            className="bg-gray-300 text-gray-800 py-3 rounded-xl font-medium"
          >
            Kontynuuj trening
          </button>
        </div>
      </div>
    );
  }

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
            const currentCompletedSets = completedSetsMap[currentIndex] || [];
            const isCompleted = currentCompletedSets.includes(i);

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
          className={`py-3 rounded-xl font-medium transition-colors duration-300 ease-in-out ${
            currentIndex === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-amber-500 text-white"
          }`}
        >
          Prev
        </button>
        <button
          onClick={skipExercise}
          disabled={currentIndex >= exercises.length - 1}
          className={`text-sm py-3 rounded-xl font-medium transition-colors duration-300 ease-in-out ${
            currentIndex >= exercises.length - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-400 text-white"
          }`}
        >
          Skip
        </button>
        <button
          onClick={nextExercise}
          disabled={currentIndex >= exercises.length - 1}
          className={`text-sm py-3 rounded-xl font-medium transition-colors duration-300 ease-in-out ${
            currentIndex >= exercises.length - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white"
          }`}
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
