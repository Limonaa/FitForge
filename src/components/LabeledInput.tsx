import React from "react";

interface LabeledInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  icon: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  value,
  onChange,
  placeholder,
  required,
  icon,
  type,
}) => {
  return (
    <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
      <div className="mr-2">{icon}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent outline-none text-sm"
        min={type === "number" ? 0 : undefined}
        inputMode={type === "number" ? "numeric" : undefined}
      />
    </div>
  );
};

export default LabeledInput;
