import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { supabase } from "../services/supabaseService";

interface AddWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddWorkoutDialog: React.FC<AddWorkoutDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError(userError?.message || "User not wuthenticated");
    }

    if (user) {
      const { error } = await supabase.from("workouts").insert([
        {
          user_id: user.id,
          title,
          next_workout: new Date().toISOString().slice(0, 10),
          duration: duration * 60,
        },
      ]);

      setLoading(false);

      if (error) {
        setError(error.message);
      } else {
        onSuccess();
        onClose();
        setTitle("");
        setDuration(0);
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
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
              placeholder="Workout title"
              className="w-full border px-3 py-2 rounded-md mb-4"
            />
            <label>Duration (min)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              required
              placeholder="Enter duration"
              className="w-full border px-3 py-2 rounded-md mb-4"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2">
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
