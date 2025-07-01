import React, { type ReactNode } from "react";

type SelectType = "prof" | "meas" | "goals" | "set";

interface SidebarItemProps {
  label: string;
  icon: ReactNode;
  value: SelectType;
  selected: SelectType;
  onSelect: (value: SelectType) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  value,
  selected,
  onSelect,
}) => {
  const isActive = selected === value;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex flex-row items-center justify-start rounded-xl px-4 py-3 font-semibold gap-5 mt-1 w-full hover:cursor-pointer
        transition duration-300 ease-in-out
        ${isActive ? "bg-blue-100 bg-opacity-75" : "bg-white"}`}
    >
      <div
        className={`transition duration-300 ease-in-out ${
          isActive ? "text-indigo-600" : "text-gray-600"
        }`}
      >
        {icon}
      </div>
      <p
        className={`transition duration-300 ease-in-out truncate ${
          isActive ? "text-indigo-600" : "text-gray-600"
        }`}
      >
        {label}
      </p>
    </button>
  );
};

export default SidebarItem;
