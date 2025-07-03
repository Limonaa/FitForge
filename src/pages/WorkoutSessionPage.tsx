import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseService";
import { ArrowUpDown, Dumbbell, Repeat, Timer } from "lucide-react";
import WorkoutButtons from "../components/WorkoutButtons";
import { useUser } from "../context/UserContext";
import Button from "../components/Button";
import WorkoutDetailsCard from "../components/WorkoutDetailsCard";

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
  const { userId, loading: userLoading } = useUser();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const currentExercise = exercises[currentIndex];

  useEffect(() => {
    if (userLoading || !userId) return;

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

      const storedStart = localStorage.getItem(`workout_start_${id}`);
      if (storedStart) {
        setStartTime(new Date(storedStart));
      } else {
        const now = new Date();
        setStartTime(now);
        localStorage.setItem(`workout_start_${id}`, now.toISOString());
      }
    };

    fetchWorkout();
  }, [id, userId, userLoading]);

  useEffect(() => {
    if (!startTime || isWorkoutFinished) return;

    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
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

  const removeLastSet = () => {
    setCompletedSetsMap((prev) => {
      const currentSets = prev[currentIndex] || [];
      if (currentSets.length === 0) return prev;

      const newSets = currentSets.slice(0, -1);
      return {
        ...prev,
        [currentIndex]: newSets,
      };
    });
  };

  const addNextSet = () => {
    setCompletedSetsMap((prev) => {
      const currentSets = prev[currentIndex] || [];
      const nextIndex = currentSets.length;

      if (nextIndex >= exercises[currentIndex].sets) return prev;

      return {
        ...prev,
        [currentIndex]: [...currentSets, nextIndex],
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
    const confirmEnd = confirm("Are you sure to end workout?");
    if (!confirmEnd) return;

    localStorage.removeItem(`workout_start_${id}`);
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

    const { error } = await supabase.from("workout_history").insert({
      user_id: userId,
      workout_id: workout.id,
      name: workout.title,
      reps: totalReps,
      sets: totalSets,
      weight: totalWeight,
      time: duration,
      date: new Date().toISOString().split("T")[0],
    });

    if (error) {
      setNotification({
        message: error.message || "Failed to insert data",
        type: "error",
      });
      return;
    }

    navigate("/workouts");
  };

  const handleContinueWorkout = () => {
    const now = new Date();
    setStartTime(now);
    localStorage.setItem(`workout_start_${id}`, now.toISOString());
    setShowSummary(false);
    setIsWorkoutFinished(false);
  };

  const handleQuit = () => {
    navigate("/workouts");
  };

  if (!workout || !currentExercise) return <p>Loading...</p>;

  if (showSummary) {
    const { totalReps, totalSets, totalWeight, duration } = getSummaryData();

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Workout summary</h2>
        <div className="space-y-2 text-center">
          <p>
            <strong>Workout:</strong> {workout.title}
          </p>
          <p>
            <strong>Time:</strong> {Math.floor(duration / 60)}:
            {String(duration % 60).padStart(2, "0")}
          </p>
          <p>
            <strong>Total sets:</strong> {totalSets}
          </p>
          <p>
            <strong>Total reps:</strong> {totalReps}
          </p>
          <p>
            <strong>Total weight (kg):</strong> {totalWeight}
          </p>
        </div>

        <div className="space-y-2">
          {exercises.map((exercise, index) => {
            const completed = completedSetsMap[index]?.length || 0;
            return (
              <div key={exercise.id} className="bg-gray-100 rounded-xl p-4">
                <p className="font-bold">{exercise.name}</p>
                <p>
                  {completed} / {exercise.sets} sets done
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          <Button variant="red" onClick={handleQuit}>
            Quit without saving
          </Button>
          <Button variant="primary" onClick={handleContinueWorkout}>
            Continue workout
          </Button>
          <Button variant="green" onClick={handleSaveWorkout}>
            Save workout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 items-center">
        <p className="sm:text-2xl text-lg sm:font-bold font-semibold text-start truncate">
          {workout.title}
        </p>
        <div className="flex justify-center items-center text-gray-600 gap-2 text-3xl">
          <Timer className="w-8 h-8" />
          {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
        </div>
      </div>

      <div className="rounded-xl space-y-6 text-center">
        <h2 className="text-2xl font-semibold">{currentExercise.name}</h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center text-center">
          <WorkoutDetailsCard
            title="Reps"
            type="reps"
            icon={ArrowUpDown}
            value={currentExercise.reps}
          />
          <WorkoutDetailsCard
            title="Sets"
            type="sets"
            icon={Repeat}
            value={currentExercise.sets}
          />
          <WorkoutDetailsCard
            title="Weight"
            type="weight"
            icon={Dumbbell}
            value={currentExercise.weight || 0}
          />
        </div>

        <div className="grid grid-cols-3 sm:flex justify-center gap-3 mt-4 w-full max-w-md mx-auto">
          <button
            onClick={removeLastSet}
            disabled={(completedSetsMap[currentIndex]?.length || 0) === 0}
            className={`w-full sm:w-14 h-10 flex items-center justify-center rounded-full font-semibold border-2 col-start-1 transition-all ${
              (completedSetsMap[currentIndex]?.length || 0) > 0
                ? "bg-red-600 text-white border-red-600"
                : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
            }`}
          >
            –
          </button>
          {Array.from({ length: currentExercise.sets }).map((_, i) => {
            const currentCompletedSets = completedSetsMap[currentIndex] || [];
            const isCompleted = currentCompletedSets.includes(i);

            return (
              <button
                key={i}
                onClick={() => toggleSet(i)}
                className={`w-full sm:w-10 h-10 flex items-center justify-center rounded-full font-semibold border-2 transition-all ${
                  isCompleted
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
          <button
            onClick={addNextSet}
            disabled={
              (completedSetsMap[currentIndex]?.length || 0) >=
              exercises[currentIndex].sets
            }
            className={`w-full sm:w-14 h-10 flex items-center justify-center rounded-full font-semibold border-2 col-start-3 sm:col-start-1 transition-all ${
              (completedSetsMap[currentIndex]?.length || 0) <
              exercises[currentIndex].sets
                ? "bg-green-600 text-white border-green-600"
                : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
            }`}
          >
            +
          </button>
        </div>
      </div>
      <WorkoutButtons
        currentIndex={currentIndex}
        totalExercises={exercises.length}
        onPrev={prevExercise}
        onSkip={skipExercise}
        onNext={nextExercise}
        onFinish={finishWorkout}
      />

      <div className="text-center text-gray-500 mt-2">
        Exercise {currentIndex + 1} of {exercises.length}
      </div>
    </div>
  );
};

export default WorkoutSessionPage;
