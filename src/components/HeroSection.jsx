import React, { useState } from "react";

const HeroSection = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Hook up to real search later
    console.log({ jobTitle, location });
  };

  return (
    <section className="w-full border-b bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6 lg:px-0 lg:py-14">
        <div className="max-w-xl space-y-6">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            #1 Job Platform in MENA
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Find your next{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              dream job
            </span>{" "}
            today.
          </h1>
          <p className="text-sm text-slate-600 sm:text-base">
            Explore thousands of opportunities from top companies. Get matched
            with roles that fit your skills, experience, and career goals.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-4 grid gap-3 rounded-2xl bg-white p-3 shadow-lg shadow-blue-100/70 ring-1 ring-slate-100 sm:grid-cols-[minmax(0,2fr),minmax(0,1.2fr),auto]"
          >
            <div className="flex flex-col">
              <label
                htmlFor="jobTitle"
                className="text-xs font-medium text-slate-500"
              >
                Job Title or Keyword
              </label>
              <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
                <span className="mr-2 text-slate-400">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                </span>
                <input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="location"
                className="text-xs font-medium text-slate-500"
              >
                Location
              </label>
              <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
                <span className="mr-2 text-slate-400">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6c0 4.418 6 10 6 10s6-5.582 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </span>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Cairo, Remote"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-300/60 transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300/70 active:translate-y-px"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.94 2.94a1.5 1.5 0 012.122 0l4.95 4.95 4.95-4.95a1.5 1.5 0 112.122 2.122l-4.95 4.95 4.95 4.95a1.5 1.5 0 01-2.122 2.122l-4.95-4.95-4.95 4.95A1.5 1.5 0 012.94 15.96l4.95-4.95-4.95-4.95a1.5 1.5 0 010-2.12z" />
                </svg>
                Search Jobs
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
            <span>Popular searches:</span>
            <button className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200 transition">
              React
            </button>
            <button className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200 transition">
              Node.js
            </button>
            <button className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200 transition">
              Product Manager
            </button>
            <button className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200 transition">
              Data Analyst
            </button>
          </div>
        </div>

        <div className="relative mt-4 flex-1 md:mt-0">
          <div className="mx-auto max-w-sm rounded-3xl bg-white p-4 shadow-xl shadow-blue-100/70 ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Recommended for you
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Frontend Developer
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                NEW
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Based on your profile and search history. Join now to get
              personalized recommendations.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xs font-semibold text-white">
                    IT
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      ITWorx
                    </p>
                    <p className="text-xs text-slate-500">
                      Cairo, Egypt · On-site
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-600">
                  Actively hiring
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-xs font-semibold text-white">
                    SW
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Software Engineer
                    </p>
                    <p className="text-xs text-slate-500">Remote · Full-time</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  12 applied
                </span>
              </div>
            </div>

            <button className="mt-4 w-full rounded-xl border border-dashed border-slate-200 py-2 text-xs font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition">
              Upload your CV to get matched
            </button>
          </div>

          <div className="pointer-events-none absolute -right-4 -top-4 hidden h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600/80 to-indigo-500/80 blur-2xl md:block" />
          <div className="pointer-events-none absolute -bottom-6 left-6 hidden h-12 w-12 rounded-full bg-gradient-to-br from-sky-400/70 to-emerald-400/70 blur-xl md:block" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

