import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import MatchModal from "../components/MatchModal";
import { useJobListing } from "../hooks/useJobListing";

const Internships = () => {
  const listing = useJobListing({ postType: "Internship" });

  useEffect(() => {
    listing.loadJobs();
  }, [listing.loadJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    listing.loadJobs();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <MatchModal {...listing.matchModal} onClose={listing.closeMatchModal} />

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-0">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-slate-900">Explore internships</h1>
          <p className="mt-1 text-xs text-slate-600">
            Kickstart your career with internship opportunities matched to your profile.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-4 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row"
        >
          <input
            type="search"
            value={listing.search}
            onChange={(e) => listing.setSearch(e.target.value)}
            placeholder="Search internships…"
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
            Loading internships…
          </div>
        ) : listing.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            {listing.error}
          </div>
        ) : listing.jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            No internships found yet. Check back soon.
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
      </main>
    </div>
  );
};

export default Internships;
