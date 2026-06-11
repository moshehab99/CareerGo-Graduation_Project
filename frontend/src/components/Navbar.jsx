import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  getAuthUser,
  getUserRole,
  isAuthenticated,
  ROLE_CANDIDATE,
  ROLE_COMPANY,
} from "../lib/userStorage";

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
  const [role, setRole] = useState(() => getUserRole());
  const [user, setUser] = useState(() => getAuthUser());

  useEffect(() => {
    const sync = () => {
      setRole(getUserRole());
      setUser(getAuthUser());
    };
    window.addEventListener("storage", sync);
    window.addEventListener("careergo-auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("careergo-auth-changed", sync);
    };
  }, []);

  const isCompany = role === ROLE_COMPANY;
  const isCandidate = role === ROLE_CANDIDATE;
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const goHome = () => {
    if (isCompany) navigate("/company/dashboard");
    else if (isCandidate) navigate("/explore");
    else navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6 lg:px-0">
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-slate-100"
          aria-label="CareerGo home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold tracking-wide text-white shadow-md shadow-blue-600/25">
            CG
          </div>
          <span className="text-base font-extrabold tracking-wide text-slate-900">
            CareerGo
          </span>
        </button>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {isCompany ? (
            <>
              <NavItem to="/company/dashboard">Dashboard</NavItem>
              <NavItem to="/post-job">Posts</NavItem>
              <NavItem to="/company/candidates">Candidates</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/explore">Explore</NavItem>
              <NavItem to="/internships">Internships</NavItem>
              <NavItem to="/saved">Saved Jobs</NavItem>
              <NavItem to="/applications">My applications</NavItem>
              <NavItem to="/profile">Profile</NavItem>
            </>
          )}
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-3">
          <div className="hidden w-full max-w-sm md:block">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <input
                type="search"
                placeholder={
                  isCompany
                    ? "Search candidates, CVs…"
                    : "Search jobs, companies…"
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>

          {loggedIn && isCandidate ? (
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="hidden rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-700 sm:inline"
            >
              {user?.fullName || "My profile"}
            </button>
          ) : (
            <span className="hidden text-xs font-medium text-slate-500 sm:inline">
              {loggedIn
                ? isCompany
                  ? user?.companyName || "Company"
                  : "Guest"
                : "Guest"}
            </span>
          )}

          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Log out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Log in
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-white md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2">
          {isCompany ? (
            <>
              <NavItem to="/company/dashboard">Dashboard</NavItem>
              <NavItem to="/post-job">Posts</NavItem>
              <NavItem to="/company/candidates">Candidates</NavItem>
            </>
          ) : (
            <>
              <NavItem to="/explore">Explore</NavItem>
              <NavItem to="/internships">Internships</NavItem>
              <NavItem to="/saved">Saved Jobs</NavItem>
              <NavItem to="/applications">My applications</NavItem>
              <NavItem to="/profile">Profile</NavItem>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
