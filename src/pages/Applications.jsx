import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";

const APPLIED_KEY = "applications";

const readApplied = () => {
  try {
    const raw = localStorage.getItem(APPLIED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const Applications = () => {
  const [applications] = useState(() => readApplied());

  const cards = useMemo(
    () => applications.map((j) => ({ ...j, status: j.status || "Applied" })),
    [applications]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-0">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-slate-900">Applications</h1>
          <p className="mt-1 text-xs text-slate-600">
            Track roles you’ve applied to.
          </p>
        </div>

        {cards.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            You have no applications yet.
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                status="Applied"
                showActions={false}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Applications;

