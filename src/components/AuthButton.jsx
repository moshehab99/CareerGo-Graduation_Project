import React from "react";

const AuthButton = ({
  type = "button",
  children,
  className = "",
  disabled,
  onClick,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 transition hover:bg-blue-500 hover:shadow-blue-500/40 active:translate-y-px disabled:cursor-not-allowed disabled:bg-slate-600 disabled:shadow-none ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default AuthButton;

