import React from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

interface StartEditDialogProps {
  id: number;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const StartEditWorkoutDialog: React.FC<StartEditDialogProps> = ({
  id,
  title,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleStartWorkout = (id: number) => {
    // TODO Navigate to workout session
  };
  const handleEditWorkout = (id: number) => {
    navigate(`/workouts/${id}`);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <Dialog.Title className="text-xl font-semibold mb-4">
            {title}
          </Dialog.Title>
          <div className="flex justify-between items-center">
            <button
              className="bg-green-600 text-white text-lg font-semibold px-4 py-2 rounded-xl"
              onClick={() => handleStartWorkout(id)}
            >
              Start
            </button>
            <button
              className="bg-amber-500 text-white text-lg font-semibold px-4 py-2 rounded-xl"
              onClick={() => handleEditWorkout(id)}
            >
              Edit
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default StartEditWorkoutDialog;
