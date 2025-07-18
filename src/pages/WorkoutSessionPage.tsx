import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseService";
import { ArrowUpDown, Dumbbell, Repeat, Timer } from "lucide-react";
import WorkoutButtons from "../components/WorkoutButtons";
import { useUser } from "../context/UserContext";
import Button from "../components/Button";
import WorkoutDetailsCard from "../components/WorkoutDetailsCard";
import NotificationCard from "../components/NotificationCard";
import LoadWrapper from "../components/LoadWrapper";
import ConfirmDialog from "../components/ConfirmDialog";

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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

  const handleFinishClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmFinish = () => {
    setShowConfirmDialog(false);
    localStorage.removeItem(`workout_start_${id}`);
    setIsWorkoutFinished(true);
    setShowSummary(true);
  };

  const handleDismissFinish = () => {
    setShowConfirmDialog(false);
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

  if (!workout) {
    return (
      <LoadWrapper loading={true}>
        <></>
      </LoadWrapper>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-4 gap-2">
        <p className="text-2xl font-semibold">No exercises found</p>
        <p className="text-sm text-gray-600 font-semibold">
          Workout have to contain at least 1 exercise
        </p>
        <Button
          onClick={() => navigate("/workouts")}
          variant="primary"
          size="lg"
        >
          Back to Workouts
        </Button>
      </div>
    );
  }

  if (showSummary) {
    const { totalReps, totalSets, totalWeight, duration } = getSummaryData();

    return (
      <>
        {notification && (
          <NotificationCard
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Workout Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <WorkoutDetailsCard
              title="Time"
              type="time"
              icon={Timer}
              value={`${Math.floor(duration / 60)}:${String(
                duration % 60
              ).padStart(2, "0")}`}
            />
            <WorkoutDetailsCard
              title="Total Sets"
              type="sets"
              icon={Repeat}
              value={totalSets}
            />
            <WorkoutDetailsCard
              title="Total Reps"
              type="reps"
              icon={ArrowUpDown}
              value={totalReps}
            />
            <WorkoutDetailsCard
              title="Total Weight"
              type="weight"
              icon={Dumbbell}
              value={totalWeight + " kg"}
            />
          </div>

          <div className="bg-white rounded-xl shadow p-4 space-y-3">
            <h3 className="text-xl font-semibold text-center text-gray-700">
              Exercise Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {exercises.map((exercise, index) => {
                const completed = completedSetsMap[index]?.length || 0;
                return (
                  <div
                    key={exercise.id}
                    className="bg-gray-50 border rounded-lg p-3 shadow-sm"
                  >
                    <p className="font-medium text-gray-800">{exercise.name}</p>
                    <p className="text-sm text-gray-600">
                      {completed} / {exercise.sets} sets completed
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <Button variant="red" onClick={handleQuit} size="lg">
              Quit without saving
            </Button>
            <Button variant="primary" onClick={handleContinueWorkout} size="lg">
              Continue workout
            </Button>
            <Button variant="green" onClick={handleSaveWorkout} size="lg">
              Save workout
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
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
          onFinish={handleFinishClick}
        />

        <div className="text-center text-gray-500 mt-2">
          Exercise {currentIndex + 1} of {exercises.length}
        </div>
      </div>
      <ConfirmDialog
        message="Are you sure you want to finish the workout?"
        isOpen={showConfirmDialog}
        onAccept={handleConfirmFinish}
        onDismiss={handleDismissFinish}
      />
    </>
  );
};

export default WorkoutSessionPage;
