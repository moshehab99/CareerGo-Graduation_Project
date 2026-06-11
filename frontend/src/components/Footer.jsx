import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-0">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 text-xs font-bold text-white">
                CG
              </div>
              <span className="text-sm font-semibold tracking-tight">
                CareerGo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Helping professionals across Egypt and the MENA region discover
              meaningful work opportunities. Join thousands of candidates
              growing their careers every day.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Product
            </h4>
            <button className="block text-xs text-slate-300 hover:text-white">
              Browse Jobs
            </button>
            <button className="block text-xs text-slate-300 hover:text-white">
              Explore Companies
            </button>
            <button className="block text-xs text-slate-300 hover:text-white">
              Career Coaching
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              For Employers
            </h4>
            <button className="block text-xs text-slate-300 hover:text-white">
              Post a Job
            </button>
            <button className="block text-xs text-slate-300 hover:text-white">
              Talent Solutions
            </button>
            <button className="block text-xs text-slate-300 hover:text-white">
              Employer Branding
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CareerGo. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="hover:text-slate-300">Privacy</button>
            <button className="hover:text-slate-300">Terms</button>
            <button className="hover:text-slate-300">Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

