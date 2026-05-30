import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import SidebarProfile from "../components/SidebarProfile";
import jobsData from "../data/jobsData";
import { filterJobsByInterests } from "../lib/filterJobsByInterests";
import { getUserInterests } from "../lib/userStorage";

const SAVED_KEY = "savedJobs";
const APPLIED_KEY = "applications";

const readJsonArray = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeJsonArray = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const Explore = () => {
  const [interestsTick, setInterestsTick] = useState(0);
  const [hiddenIds, setHiddenIds] = useState(() => new Set());
  const [savedIds, setSavedIds] = useState(() => {
    const saved = readJsonArray(SAVED_KEY);
    return new Set(saved.map((j) => j.id));
  });
  const [appliedIds, setAppliedIds] = useState(() => {
    const applied = readJsonArray(APPLIED_KEY);
    return new Set(applied.map((j) => j.id));
  });

  useEffect(() => {
    const bump = () => setInterestsTick((t) => t + 1);
    window.addEventListener("wuzzuf-interests-changed", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("wuzzuf-interests-changed", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const interests = useMemo(() => getUserInterests(), [interestsTick]);

  const interestFiltered = useMemo(
    () => filterJobsByInterests(jobsData, interests),
    [interests]
  );

  const visibleJobs = useMemo(
    () => interestFiltered.filter((j) => !hiddenIds.has(j.id)),
    [interestFiltered, hiddenIds]
  );

  const personalized =
    interests &&
    (interests.jobTitles?.length ||
      interests.jobTypes?.length ||
      interests.workplaceSettings?.length ||
      (interests.jobCategory && interests.jobCategory !== "Other"));

  const toggleSave = (job) => {
    const current = readJsonArray(SAVED_KEY);
    const exists = current.some((j) => j.id === job.id);
    const next = exists ? current.filter((j) => j.id !== job.id) : [job, ...current];
    writeJsonArray(SAVED_KEY, next);
    setSavedIds(new Set(next.map((j) => j.id)));
  };

  const applyToJob = (job) => {
    const current = readJsonArray(APPLIED_KEY);
    const exists = current.some((j) => j.id === job.id);
    const next = exists ? current : [{ ...job, status: "Applied" }, ...current];
    writeJsonArray(APPLIED_KEY, next);
    setAppliedIds(new Set(next.map((j) => j.id)));
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

  const hideJob = (job) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.add(job.id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-12 lg:px-0">
        <section className="lg:col-span-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Explore jobs</h1>
              <p className="mt-1 text-xs text-slate-600">
                {personalized
                  ? "Recommendations ranked using your saved career interests."
                  : "Personalized recommendations appear after you complete career interests."}
              </p>
            </div>
            <div className="hidden text-right text-xs text-slate-500 sm:block">
              <div>{visibleJobs.length} jobs</div>
              {personalized && visibleJobs.length < jobsData.length ? (
                <div className="mt-0.5 text-[11px] text-blue-700">
                  Filtered from {jobsData.length} open roles
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            {visibleJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                isSaved={savedIds.has(job.id)}
                status={appliedIds.has(job.id) ? "Applied" : undefined}
                onToggleSave={() => toggleSave(job)}
                onShare={() => shareJob(job)}
                onHide={() => hideJob(job)}
                onApply={() => applyToJob(job)}
              />
            ))}
          </div>
        </section>

        <section className="lg:col-span-4">
          <SidebarProfile interests={interests} />
        </section>
      </main>
    </div>
  );
};

export default Explore;
