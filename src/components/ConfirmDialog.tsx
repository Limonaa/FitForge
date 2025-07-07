import React from "react";
import { Dialog } from "@headlessui/react";
import Button from "./Button";
import { X } from "lucide-react";

interface ConfirmDialogProps {
  message: string;
  isOpen: boolean;
  onAccept: () => void;
  onDismiss: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  message,
  isOpen,
  onAccept,
  onDismiss,
}) => {
  return (
    <Dialog open={isOpen} onClose={onDismiss} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-72 max-w-md p-6 relative">
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          <Dialog.Title className="text-2xl font-bold mb-4 text-center tracking-wide flex justify-between ">
            <p className="text-gray-600">{message}</p>
          </Dialog.Title>
          <div className="grid grid-cols-3">
            <Button variant="red" onClick={onDismiss} size="lg">
              Cancel
            </Button>
            <Button
              variant="green"
              onClick={onAccept}
              size="lg"
              className="col-start-3"
            >
              Accept
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
