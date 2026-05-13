import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-blue-50 text-blue-700"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      }`
    }
  >
    {children}
  </NavLink>
);

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6 lg:px-0">
        <button
          type="button"
          onClick={() => navigate("/explore")}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-100"
          aria-label="Go to Explore"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold tracking-wide text-white">
            WZ
          </div>
          <span className="text-base font-extrabold tracking-wide text-slate-900">
            WUZZUF
          </span>
        </button>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          <NavItem to="/explore">Explore</NavItem>
          <NavItem to="/saved">Saved</NavItem>
          <NavItem to="/applications">Applications</NavItem>
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-3">
          <div className="hidden w-full max-w-sm md:block">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder="Search jobs, companies..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow-sm ring-1 ring-slate-200"
            aria-label="User menu"
            title="Yousef Helmy"
          >
            YH
          </button>
        </div>
      </div>

      <div className="border-t bg-white md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2">
          <NavItem to="/explore">Explore</NavItem>
          <NavItem to="/saved">Saved</NavItem>
          <NavItem to="/applications">Applications</NavItem>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
