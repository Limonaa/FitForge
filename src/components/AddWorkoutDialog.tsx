import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";

interface AddWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Exercise {
  name: string;
  order_in_workout: number;
  weight: number;
  reps: number;
  sets: number;
}

const AddWorkoutDialog: React.FC<AddWorkoutDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { userId, loading: userLoading } = useUser();

  const handleExerciseChange = (
    index: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    const updated = [...exercises];
    if (field === "name") {
      updated[index][field] = value as string;
    } else {
      updated[index][field] = Number(value) as any;
    }

    setExercises(updated);
  };

  const handleAddExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        name: "",
        reps: 0,
        sets: 0,
        weight: 0,
        order_in_workout: prev.length + 1,
      },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (userLoading) return;
    if (!userId) {
      setLoading(false);
      return;
    }

    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: workoutData, error: workoutError } = await supabase
      .from("workouts")
      .insert([
        {
          user_id: userId,
          title,
          next_workout: new Date().toISOString().slice(0, 10),
          duration: duration * 60,
        },
      ])
      .select("id")
      .single();

    if (workoutError || !workoutData) {
      setError(workoutError?.message || "Failed to create workout");
      setLoading(false);
      return;
    }

    const exercisesToInsert = exercises.map((ex) => ({
      ...ex,
      workout_id: workoutData.id,
      user_id: userId,
    }));

    const { error: exerciseError } = await supabase
      .from("workout_exercises")
      .insert(exercisesToInsert);

    if (exerciseError) {
      setError(exerciseError.message);
    } else {
      onSuccess();
      onClose();
      setTitle("");
      setDuration(0);
      setExercises([]);
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Create new workout
          </Dialog.Title>
          <form onSubmit={handleSubmit}>
            <label>Workout title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-md mb-4"
            />

            <label>Duration (min)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
              className="w-full border px-3 py-2 rounded-md mb-4"
            />

            <div className="mb-2 flex justify-between items-center">
              <p className="font-medium">Exercises</p>
              <button
                type="button"
                onClick={handleAddExercise}
                className="text-blue-500 text-sm"
              >
                + Add exercise
              </button>
            </div>

            {exercises.map((exercise, index) => (
              <div key={index} className="border p-4 rounded-md mb-4 space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) =>
                      handleExerciseChange(index, "name", e.target.value)
                    }
                    className="w-full border px-3 py-2 rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sets
                    </label>
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) =>
                        handleExerciseChange(
                          index,
                          "sets",
                          Number(e.target.value)
                        )
                      }
                      placeholder="e.g., 4"
                      className="w-full border px-3 py-2 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reps
                    </label>
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) =>
                        handleExerciseChange(
                          index,
                          "reps",
                          Number(e.target.value)
                        )
                      }
                      placeholder="e.g., 10"
                      className="w-full border px-3 py-2 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={exercise.weight}
                      onChange={(e) =>
                        handleExerciseChange(
                          index,
                          "weight",
                          Number(e.target.value)
                        )
                      }
                      placeholder="e.g., 60"
                      className="w-full border px-3 py-2 rounded-md"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExercise(index)}
                  className="text-red-500 text-xs mt-1"
                >
                  Remove
                </button>
              </div>
            ))}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddWorkoutDialog;
