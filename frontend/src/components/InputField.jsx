import React from "react";

const variants = {
  auth: {
    label: "block text-xs font-medium text-slate-200",
    input: (hasError) =>
      `w-full rounded-xl border bg-slate-900/60 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 shadow-sm outline-none transition focus:ring-2 ${
        hasError
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
          : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/40"
      }`,
    error: "text-xs text-red-400",
  },
  light: {
    label: "block text-xs font-medium text-slate-700",
    input: (hasError) =>
      `w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:ring-2 ${
        hasError
          ? "border-red-500 focus:border-red-500 focus:ring-red-500/40"
          : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/40"
      }`,
    error: "text-xs text-red-600",
  },
};

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  variant = "auth",
  ...rest
}) => {
  const hasError = Boolean(error);
  const v = variants[variant] || variants.auth;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className={v.label}>
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
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
        className={v.input(hasError)}
        {...rest}
      />
      {hasError ? (
        <p id={`${name}-error`} className={v.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default InputField;
