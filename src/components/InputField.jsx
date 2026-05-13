import React from "react";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-medium text-slate-200"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
      />
    </div>
  );
};

export default InputField;

