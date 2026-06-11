import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 lg:px-0">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
            CG
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-slate-900">
              CareerGo
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Discover your next opportunity
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <button className="hover:text-blue-600 transition-colors">
            Jobs
          </button>
          <button className="hover:text-blue-600 transition-colors">
            Companies
          </button>
          {/* <button className="hover:text-blue-600 transition-colors">
            Career Resources
          </button> */}
          <button className="hover:text-blue-600 transition-colors">
            For Employers
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register/user"
            className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Join Now
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

