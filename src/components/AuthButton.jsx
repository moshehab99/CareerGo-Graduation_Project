import React from "react";

const AuthButton = ({ type = "button", children }) => {
  return (
    <button
      type={type}
      className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 transition hover:bg-blue-500 hover:shadow-blue-500/40 active:translate-y-px disabled:cursor-not-allowed disabled:bg-slate-600 disabled:shadow-none"
    >
      {children}
    </button>
  );
};

export default AuthButton;

