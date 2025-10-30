import React from "react";

export default function RadioOption({ value, label, checked, onChange, type }) {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer font-medium ${
        checked
          ? type === "income"
            ? "text-green-700"
            : "text-red-600"
          : "text-gray-600"
      }`}
    >
      <input
        type="radio"
        name="transactionType"
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
      />
      {label}
    </label>
  );
}
