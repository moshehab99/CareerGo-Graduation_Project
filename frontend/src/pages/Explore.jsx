import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import MatchModal from "../components/MatchModal";
import SidebarProfile from "../components/SidebarProfile";
import { useJobListing } from "../hooks/useJobListing";
import { getUserInterests } from "../lib/userStorage";

const Explore = () => {
  const [interestsTick, setInterestsTick] = useState(0);
  const listing = useJobListing({ postType: "Job" });

  const interests = useMemo(() => getUserInterests(), [interestsTick]);

  useEffect(() => {
    listing.loadJobs();
  }, [listing.loadJobs]);

  useEffect(() => {
    const bump = () => setInterestsTick((t) => t + 1);
    window.addEventListener("careergo-interests-changed", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("careergo-interests-changed", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const personalized =
    interests &&
    (interests.jobTitles?.length ||
      interests.jobTypes?.length ||
      interests.workplaceSettings?.length ||
      (interests.jobCategory && interests.jobCategory !== "Other"));

  const handleSearch = (e) => {
    e.preventDefault();
    listing.loadJobs();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <MatchModal {...listing.matchModal} onClose={listing.closeMatchModal} />

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-12 lg:px-0">
        <section className="lg:col-span-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Explore jobs</h1>
              <p className="mt-1 text-xs text-slate-600">
                {personalized
                  ? "Recommendations ranked using your saved career interests."
                  : "Personalized recommendations appear after you complete career interests."}
              </p>
            </div>
            <div className="text-xs text-slate-500">{listing.jobs.length} jobs</div>
          </div>

          <form
            onSubmit={handleSearch}
            className="mb-4 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row"
          >
            <input
              type="search"
              value={listing.search}
              onChange={(e) => listing.setSearch(e.target.value)}
              placeholder="Search jobs, companies, locations…"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <select
              value={listing.workplace}
              onChange={(e) => listing.setWorkplace(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="">All workplaces</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {listing.loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              Loading jobs…
            </div>
          ) : listing.error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
              {listing.error}
            </div>
          ) : listing.jobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
              No jobs found. Try adjusting your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {listing.jobs.map((job) => (
                <JobCard
                  key={job.id}
                  {...job}
                  isSaved={job.isSaved}
                  status={job.isApplied ? "Applied" : undefined}
                  onToggleSave={() => listing.toggleSave(job)}
                  onShare={() => listing.shareJob(job)}
                  onHide={() => listing.hideJob(job)}
                  onApply={() => listing.applyToJobHandler(job)}
                  onMatch={() => listing.runMatch(job)}
                  matchLoading={listing.matchingJobId === job.id}
                />
              ))}
            </div>
          )}
        </section>

        <section className="lg:col-span-4">
          <SidebarProfile interests={interests} />
        </section>
      </main>
    </div>
  );
};

export default Explore;
