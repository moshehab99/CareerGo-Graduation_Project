import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const CompanyCandidates = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Candidates</h1>
          <p className="mt-2 text-sm text-slate-600">
            This demo screen stands in for your talent pool and CV search. Wire
            it to your backend when you are ready.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/post-job"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Post a job
            </Link>
            <Link
              to="/company/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyCandidates;
