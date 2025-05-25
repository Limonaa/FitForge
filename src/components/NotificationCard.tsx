import React from "react";

interface NotificationCardProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const colors = {
  success: "bg-green-100 text-green-700 borde-green-400",
  error: "bg-red-100 text-red-700 border-red-400",
  info: "bg-blue-100 text-blue-700 border-blue-400",
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  message,
  type,
  onClose,
}) => {
  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl border shadow-lg z-50 ${colors[type]}`}
    >
      <div className="flex items-center justify-between space-x-4">
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="font-bold text-xl leading-none pb-1"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
