import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";
import {
  Dumbbell,
  GaugeCircleIcon,
  ListPlus,
  Repeat,
  Trash2,
  X,
} from "lucide-react";

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
      <div className="flex items-center justify-center min-h-screen bg-black/50">
        <Dialog.Panel className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <Dialog.Title className="text-2xl font-bold text-indigo-700 mb-6">
            🏋️ Create New Workout
          </Dialog.Title>

          <form onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-gray-700">
              Workout Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded-md mb-4 bg-gray-50"
            />

            <label className="text-sm font-medium text-gray-700">
              Duration (min)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
              className="w-full border px-3 py-2 rounded-md mb-4 bg-gray-50"
            />

            <div className="mb-4 flex justify-between items-center">
              <p className="font-semibold text-gray-800 text-base">Exercises</p>
              <button
                type="button"
                onClick={handleAddExercise}
                className="flex items-center gap-1 text-indigo-600 text-sm hover:underline"
              >
                <ListPlus size={16} />
                Add exercise
              </button>
            </div>

            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg mb-4 bg-gray-50 space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="flex items-center border rounded-md bg-white px-3 py-2">
                    <Dumbbell size={18} className="text-indigo-500 mr-2" />
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) =>
                        handleExerciseChange(index, "name", e.target.value)
                      }
                      className="w-full outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Sets
                    </label>
                    <div className="flex items-center border rounded-md bg-white px-3 py-2">
                      <Repeat size={16} className="text-orange-500 mr-2" />
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
                        className="w-full outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Reps
                    </label>
                    <div className="flex items-center border rounded-md bg-white px-3 py-2">
                      <Repeat size={16} className="text-teal-500 mr-2" />
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
                        className="w-full outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">
                      Weight (kg)
                    </label>
                    <div className="flex items-center border rounded-md bg-white px-3 py-2">
                      <GaugeCircleIcon
                        size={16}
                        className="text-pink-500 mr-2"
                      />
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
                        className="w-full outline-none text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveExercise(index)}
                  className="flex items-center text-red-500 text-xs mt-1 hover:underline"
                >
                  <Trash2 size={14} className="mr-1" />
                  Remove
                </button>
              </div>
            ))}

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
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
