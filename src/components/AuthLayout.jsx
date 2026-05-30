import React from "react";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/40">
            WZ
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-50">
              Wuzzuf Jobs
            </span>
            <span className="text-xs text-slate-400">
              Sign in to continue your journey
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/70 px-6 py-7 shadow-2xl shadow-slate-950/80 ring-1 ring-slate-800 backdrop-blur">
          {title && (
            <h1 className="text-xl font-semibold tracking-tight text-slate-50">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}

          <div className="mt-5">{children}</div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          Protected and secured with industry-standard encryption.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;

