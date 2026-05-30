import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const CompanyDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Company dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Welcome back. Post a role to start receiving applications from
            candidates on Wuzzuf.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/post-job"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
            >
              Post a Job
            </Link>
            <Link
              to="/"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
