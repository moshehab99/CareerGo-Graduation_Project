import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";

const SAVED_KEY = "savedJobs";

const readSaved = () => {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeSaved = (jobs) => {
  localStorage.setItem(SAVED_KEY, JSON.stringify(jobs));
};

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState(() => readSaved());

  const savedIds = useMemo(
    () => new Set(savedJobs.map((j) => j.id)),
    [savedJobs]
  );

  const removeSaved = (job) => {
    const next = savedJobs.filter((j) => j.id !== job.id);
    setSavedJobs(next);
    writeSaved(next);
  };

  const shareJob = async (job) => {
    const text = `${job.title} at ${job.company} — ${job.location}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
    } finally {
      alert("Job info copied. Share it anywhere you like.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-0">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-slate-900">Saved jobs</h1>
          <p className="mt-1 text-xs text-slate-600">
            Keep track of roles you want to revisit.
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            You have no saved jobs yet.
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                isSaved={savedIds.has(job.id)}
                onToggleSave={() => removeSaved(job)}
                onShare={() => shareJob(job)}
                showHide={false}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedJobs;

