import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EXPERIENCE_OPTIONS = [
  "No experience",
  "1-2 years",
  "3-5 years",
  "5+ years",
];

const CAREER_LEVELS = [
  "Student",
  "Entry Level",
  "Experienced (Non-Manager)",
  "Manager",
  "Senior Management",
  "Not specified",
];

const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Freelance / Project",
  "Internship",
  "Shift Based",
  "Volunteering",
  "Student Activity",
];

const WORKPLACE_SETTINGS = ["On-site", "Remote", "Hybrid"];

const JOB_CATEGORIES = [
  "IT / Software Development",
  "Engineering",
  "Creative / Design",
  "Business / Management",
  "Customer Service",
];

const CareerInterests = () => {
  const navigate = useNavigate();
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[0]);
  const [careerLevel, setCareerLevel] = useState("");
  const [jobTypes, setJobTypes] = useState([]);
  const [workplaceSettings, setWorkplaceSettings] = useState([]);
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [jobTitles, setJobTitles] = useState([]);
  const [jobCategory, setJobCategory] = useState(JOB_CATEGORIES[0]);
  const [minSalary, setMinSalary] = useState("15000");
  const [hideSalary, setHideSalary] = useState(false);
  const [allowCompanies, setAllowCompanies] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  const toggleFromArray = (current, value) =>
    current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

  const handleJobTypeClick = (type) => {
    setJobTypes((prev) => toggleFromArray(prev, type));
  };

  const handleWorkplaceClick = (mode) => {
    setWorkplaceSettings((prev) => toggleFromArray(prev, mode));
  };

  const handleJobTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = jobTitleInput.trim();
      if (!value || jobTitles.length >= 10) return;
      if (!jobTitles.includes(value)) {
        setJobTitles((prev) => [...prev, value]);
      }
      setJobTitleInput("");
    }
  };

  const removeJobTitle = (title) => {
    setJobTitles((prev) => prev.filter((t) => t !== title));
  };

  const handleDone = () => {
    console.log("Career interests:", {
      experience,
      careerLevel,
      jobTypes,
      workplaceSettings,
      jobTitles,
      jobCategory,
      minSalary,
      hideSalary,
      allowCompanies,
      publicProfile,
    });
    navigate("/explore", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Tell Us About Your Career Interests
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Help us personalize your job recommendations based on your
            experience, preferences, and goals. You can update this information
            later from your profile.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Experience */}
          <section className="rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-slate-950/60 ring-1 ring-slate-800">
            <h2 className="text-sm font-semibold text-slate-100">
              Experience
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              How many years of experience do you have?
            </p>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </section>

          {/* Career level */}
          <section className="rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-slate-950/60 ring-1 ring-slate-800">
            <h2 className="text-sm font-semibold text-slate-100">
              Career Level
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Choose the option that best matches your current level.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {CAREER_LEVELS.map((level) => {
                const active = careerLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setCareerLevel(level)}
                    className={`rounded-xl border px-3 py-2 text-xs text-left transition ${
                      active
                        ? "border-blue-500 bg-blue-600/20 text-blue-200 shadow-sm shadow-blue-700/40"
                        : "border-slate-700 bg-slate-950/60 text-slate-200 hover:border-slate-500 hover:bg-slate-900"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Job types */}
          <section className="rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-slate-950/60 ring-1 ring-slate-800">
            <h2 className="text-sm font-semibold text-slate-100">
              Job Types
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              You can select more than one type.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {JOB_TYPES.map((type) => {
                const active = jobTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleJobTypeClick(type)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      active
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-700/40"
                        : "bg-slate-900 text-slate-200 ring-1 ring-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Workplace settings */}
          <section className="rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-slate-950/60 ring-1 ring-slate-800">
            <h2 className="text-sm font-semibold text-slate-100">
              Workplace Settings
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Where are you open to working?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {WORKPLACE_SETTINGS.map((mode) => {
                const active = workplaceSettings.includes(mode);
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleWorkplaceClick(mode)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      active
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-700/40"
                        : "bg-slate-900 text-slate-200 ring-1 ring-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Job titles & categories, salary, visibility */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Job titles */}
          <section className="lg:col-span-2 rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-slate-950/60 ring-1 ring-slate-800">
            <h2 className="text-sm font-semibold text-slate-100">
              Job Titles
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Add job titles you are interested in (up to 10).
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2">
              {jobTitles.map((title) => (
                <span
                  key={title}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-100"
                >
                  {title}
                  <button
                    type="button"
                    onClick={() => removeJobTitle(title)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    ×
                  </button>
                </span>
              ))}
              {jobTitles.length < 10 && (
                <input
                  type="text"
                  placeholder="e.g. Front End Developer"
                  value={jobTitleInput}
                  onChange={(e) => setJobTitleInput(e.target.value)}
                  onKeyDown={handleJobTitleKeyDown}
                  className="flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
              )}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Press Enter to add a title.
            </p>
          </section>

          {/* Job categories & salary */}
          <section className="space-y-4 rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-slate-950/60 ring-1 ring-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Job Categories
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Choose the main field you are targeting.
              </p>
              <select
                value={jobCategory}
                onChange={(e) => setJobCategory(e.target.value)}
                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              >
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Minimum Salary
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Egyptian Pound (EGP) / Month
              </p>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="w-32 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <label className="mt-3 inline-flex items-center gap-2 text-[11px] text-slate-300">
                <input
                  type="checkbox"
                  checked={hideSalary}
                  onChange={(e) => setHideSalary(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-950 text-blue-500 focus:ring-blue-500/60"
                />
                <span>Hide my minimum salary from companies</span>
              </label>
            </div>
          </section>
        </div>

        {/* Profile visibility */}
        <section className="rounded-2xl bg-slate-900/80 p-5 shadow-lg shadow-slate-950/60 ring-1 ring-slate-800">
          <h2 className="text-sm font-semibold text-slate-100">
            Profile Visibility
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Control how companies can see and reach you on Wuzzuf.
          </p>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between gap-4 rounded-xl bg-slate-950/60 px-3 py-2">
              <div className="text-xs text-slate-200">
                Let companies find me on Wuzzuf
              </div>
              <button
                type="button"
                onClick={() => setAllowCompanies((v) => !v)}
                className={`flex h-5 w-9 items-center rounded-full px-0.5 transition ${
                  allowCompanies ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${
                    allowCompanies ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between gap-4 rounded-xl bg-slate-950/60 px-3 py-2">
              <div className="text-xs text-slate-200">
                Make my profile public
              </div>
              <button
                type="button"
                onClick={() => setPublicProfile((v) => !v)}
                className={`flex h-5 w-9 items-center rounded-full px-0.5 transition ${
                  publicProfile ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${
                    publicProfile ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </label>
          </div>
        </section>

        {/* Footer actions */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleDone}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/40 transition hover:bg-blue-500 hover:shadow-blue-500/40 active:translate-y-px"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerInterests;

