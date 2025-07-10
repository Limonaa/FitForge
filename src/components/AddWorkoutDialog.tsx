import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";
import {
  Dumbbell,
  GaugeCircleIcon,
  ListPlus,
  Repeat,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import Button from "./Button";
import LabeledInput from "./LabeledInput";

interface AddWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: Error) => void;
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
  onError,
}) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    const { data: workoutData, error: workoutError } = await supabase
      .from("workouts")
      .insert([
        {
          user_id: userId,
          title,
          next_workout: new Date().toISOString().slice(0, 10),
          duration: Number(duration) * 60,
        },
      ])
      .select("id")
      .single();

    if (workoutError || !workoutData) {
      onError(workoutError);
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
      onError(exerciseError);
    } else {
      onSuccess();
      onClose();
      setTitle("");
      setDuration("0");
      setExercises([]);
    }

    setLoading(false);
  };

  return (
    <>
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
              <div className="space-y-2">
                <LabeledInput
                  value={title}
                  onChange={setTitle}
                  placeholder="Workout title"
                  icon={<Dumbbell className="text-indigo-500" size={18} />}
                  type="text"
                  required
                />
                <LabeledInput
                  value={duration}
                  onChange={setDuration}
                  placeholder="Duration (min)"
                  icon={<Timer className="text-indigo-500" size={18} />}
                  type="text"
                  required
                />
              </div>

              <div className="mb-4 flex justify-between items-center">
                <p className="font-semibold text-gray-800 text-base">
                  Exercises
                </p>
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

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  loadingText="Adding..."
                >
                  Add
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default AddWorkoutDialog;
