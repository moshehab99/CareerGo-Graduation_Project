import React from "react";
import jobsData from "../data/jobsData";
import JobCard from "./JobCard";

const FeaturedJobs = () => {
  return (
    <section className="w-full bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Featured jobs for you
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Handpicked opportunities from top companies in Egypt and the MENA
              region.
            </p>
          </div>
          <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700">
            View all jobs
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobsData.map((job) => (
            <JobCard key={job.id} {...job} showActions={false} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;

