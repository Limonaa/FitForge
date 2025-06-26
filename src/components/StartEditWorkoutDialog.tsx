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
    navigate(`/workouts/session/${id}`);
  };
  const handleEditWorkout = (id: number) => {
    navigate(`/workouts/edit/${id}`);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-72 max-w-md p-6">
          <Dialog.Title className="text-2xl font-bold mb-4 text-center tracking-wide">
            {title}
          </Dialog.Title>
          <div className="grid grid-cols-3">
            <button
              className="bg-green-600 text-white text-lg font-semibold px-4 py-2 rounded-xl"
              onClick={() => handleStartWorkout(id)}
            >
              Start
            </button>
            <button
              className="bg-amber-500 text-white text-lg font-semibold px-4 py-2 rounded-xl col-start-3"
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
