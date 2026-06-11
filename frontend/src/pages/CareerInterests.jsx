import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, X } from "lucide-react";
import AuthButton from "../components/AuthButton";
import { updateCareerInterests } from "../lib/api";
import { mapInterestsToApi } from "../lib/jobMapper";
import {
  USER_INTERESTS_KEY,
  notifyInterestsChange,
} from "../lib/userStorage";

const EXPERIENCE_OPTIONS = [
  "No experience",
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "6–10 years",
  "10+ years",
];

const CAREER_LEVEL_VALUES = [
  "Student",
  "Entry Level",
  "Experienced (Non-Manager)",
  "Manager",
  "Senior Management",
  "Not specified",
];

const CAREER_LEVEL_OPTIONS = [
  { value: "", label: "Select career level" },
  ...CAREER_LEVEL_VALUES.map((v) => ({ value: v, label: v })),
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
  "Engineering - Mechanical / Electrical",
  "Engineering - Oil & Gas / Energy",
  "Creative / Design",
  "Marketing / PR / Advertising",
  "Sales / Retail / Business Development",
  "Customer Service / Support",
  "Business / Management / Operations",
  "Finance / Accounting",
  "Human Resources",
  "Education / Training",
  "Healthcare / Pharmaceutical",
  "Legal",
  "Logistics / Supply Chain",
  "Other",
];

/** Default form values when nothing is stored yet or JSON is invalid */
function getDefaultState() {
  return {
    yearsOfExperience: EXPERIENCE_OPTIONS[2],
    careerLevel: "",
    jobTypes: [],
    workplaceSettings: [],
    jobTitles: [],
    jobCategory: JOB_CATEGORIES[0],
    minSalary: "15000",
    hideSalary: false,
    allowCompanies: true,
    publicProfile: true,
  };
}

/**
 * Reads and normalizes persisted state from localStorage.
 * Unknown option values are dropped so selects stay controlled and valid.
 */
function loadPersistedState() {
  try {
    const raw = localStorage.getItem(USER_INTERESTS_KEY);
    if (!raw) return getDefaultState();

    const data = JSON.parse(raw);
    const defaults = getDefaultState();

    const yearsOfExperience =
      typeof data.yearsOfExperience === "string" &&
      EXPERIENCE_OPTIONS.includes(data.yearsOfExperience)
        ? data.yearsOfExperience
        : defaults.yearsOfExperience;

    const careerLevel =
      typeof data.careerLevel === "string" &&
      CAREER_LEVEL_VALUES.includes(data.careerLevel)
        ? data.careerLevel
        : "";

    const jobTypes = Array.isArray(data.jobTypes)
      ? data.jobTypes.filter((t) => JOB_TYPES.includes(t))
      : [];

    const workplaceSettings = Array.isArray(data.workplaceSettings)
      ? data.workplaceSettings.filter((w) => WORKPLACE_SETTINGS.includes(w))
      : [];

    const jobTitles = Array.isArray(data.jobTitles)
      ? data.jobTitles
          .filter((t) => typeof t === "string" && t.trim().length > 0)
          .map((t) => t.trim())
          .filter((t, i, arr) => arr.indexOf(t) === i)
          .slice(0, 10)
      : [];

    const jobCategory =
      typeof data.jobCategory === "string" &&
      JOB_CATEGORIES.includes(data.jobCategory)
        ? data.jobCategory
        : defaults.jobCategory;

    const minSalary =
      data.minSalary === undefined || data.minSalary === null
        ? defaults.minSalary
        : String(data.minSalary);

    return {
      yearsOfExperience,
      careerLevel,
      jobTypes,
      workplaceSettings,
      jobTitles,
      jobCategory,
      minSalary,
      hideSalary: Boolean(data.hideSalary),
      allowCompanies:
        data.allowCompanies === undefined ? true : Boolean(data.allowCompanies),
      publicProfile:
        data.publicProfile === undefined ? true : Boolean(data.publicProfile),
    };
  } catch {
    return getDefaultState();
  }
}

function SelectField({ id, label, hint, value, onChange, children }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-900"
      >
        {label}
      </label>
      {hint ? <p className="text-sm text-slate-500">{hint}</p> : null}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
      </div>
    </div>
  );
}

function PreferenceCheckbox({ checked, onToggle, title, description }) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600/30 sm:p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
          checked
            ? "border-blue-600 bg-blue-600"
            : "border-slate-300 bg-white"
        }`}
        aria-hidden
      >
        {checked ? (
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-slate-900">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block text-sm text-slate-500">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function IosToggle({ checked, onChange, activeClass }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 focus-visible:ring-offset-2 ${
        checked ? activeClass : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

const CareerInterests = () => {
  const navigate = useNavigate();

  // Hydrate all fields once from localStorage on first mount
  const initial = useMemo(() => loadPersistedState(), []);

  const [yearsOfExperience, setYearsOfExperience] = useState(
    initial.yearsOfExperience
  );
  const [careerLevel, setCareerLevel] = useState(initial.careerLevel);
  const [jobTypes, setJobTypes] = useState(initial.jobTypes);
  const [workplaceSettings, setWorkplaceSettings] = useState(
    initial.workplaceSettings
  );
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [jobTitles, setJobTitles] = useState(initial.jobTitles);
  const [jobCategory, setJobCategory] = useState(initial.jobCategory);
  const [minSalary, setMinSalary] = useState(initial.minSalary);
  const [hideSalary, setHideSalary] = useState(initial.hideSalary);
  const [allowCompanies, setAllowCompanies] = useState(initial.allowCompanies);
  const [publicProfile, setPublicProfile] = useState(initial.publicProfile);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  /** True when required fields are satisfied so "Done" can run */
  const canComplete = Boolean(careerLevel) && jobTypes.length > 0;

  const toggleFromArray = (current, value) =>
    current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

  const handleJobTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = jobTitleInput.trim();
      if (!value || jobTitles.length >= 10) return;
      if (!jobTitles.includes(value)) {
        setJobTitles((prev) => [...prev, value]);
      }
      setJobTitleInput("");
      return;
    }

    // Tag-input UX: empty field + Backspace removes the last chip
    if (e.key === "Backspace" && jobTitleInput === "" && jobTitles.length > 0) {
      e.preventDefault();
      setJobTitles((prev) => prev.slice(0, -1));
    }
  };

  const removeJobTitle = (title) => {
    setJobTitles((prev) => prev.filter((t) => t !== title));
  };

  /** Persist snapshot, sync to API, then continue onboarding flow */
  const handleDone = async () => {
    if (!canComplete || saving) return;

    const payload = {
      yearsOfExperience,
      careerLevel,
      jobTypes,
      workplaceSettings,
      jobTitles,
      jobCategory,
      minSalary,
      hideSalary,
      allowCompanies,
      publicProfile,
    };

    setSaving(true);
    setSaveError("");

    try {
      localStorage.setItem(USER_INTERESTS_KEY, JSON.stringify(payload));
      notifyInterestsChange();
      await updateCareerInterests(mapInterestsToApi(payload));
      navigate("/explore", { replace: true });
    } catch (err) {
      setSaveError(err.message || "Could not save career interests.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 sm:pb-28">
      {/* Main column: tight horizontal padding on very small screens */}
      <div className="mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-8 md:px-6">
        <header className="mb-6 space-y-2 sm:mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
            Career Interests &amp; Profile Settings
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Tell us what you are looking for so we can match you with relevant
            roles. You can update these preferences at any time from your
            profile.
          </p>
        </header>

        {/* Vertical stack of cards on all breakpoints; inner grids collapse to one column on mobile */}
        <div className="flex flex-col gap-5 sm:gap-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              General information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your experience and level help us rank jobs that fit your seniority.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:mt-6 sm:grid-cols-2 sm:gap-6">
              <SelectField
                id="years-experience"
                label="Years of experience"
                hint="Total professional experience in your field."
                value={yearsOfExperience}
                onChange={setYearsOfExperience}
              >
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </SelectField>

              <SelectField
                id="career-level"
                label="Career level"
                hint="Pick the level that best describes you today."
                value={careerLevel}
                onChange={setCareerLevel}
              >
                {CAREER_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value || "placeholder"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </SelectField>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              Job preferences
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select all options you are open to. You can choose more than one in
              each group.
            </p>

            <div className="mt-5 space-y-7 sm:mt-6 sm:space-y-8">
              <div>
                <h3 className="text-sm font-medium text-slate-900">
                  Types of jobs you&apos;re open to
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Contract style and working pattern.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-2">
                  {JOB_TYPES.map((type) => (
                    <PreferenceCheckbox
                      key={type}
                      title={type}
                      checked={jobTypes.includes(type)}
                      onToggle={() =>
                        setJobTypes((prev) => toggleFromArray(prev, type))
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-900">
                  Workplace settings
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Where you are willing to work day to day.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-2 lg:grid-cols-3">
                  {WORKPLACE_SETTINGS.map((mode) => (
                    <PreferenceCheckbox
                      key={mode}
                      title={mode}
                      checked={workplaceSettings.includes(mode)}
                      onToggle={() =>
                        setWorkplaceSettings((prev) =>
                          toggleFromArray(prev, mode)
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              Target job titles
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add up to ten titles you want to be considered for. Press{" "}
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs font-medium text-slate-700">
                Enter
              </kbd>{" "}
              after each one. With an empty field,{" "}
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs font-medium text-slate-700">
                Backspace
              </kbd>{" "}
              removes the last tag.
            </p>
            <div className="mt-3 min-h-[48px] rounded-xl border border-slate-200 bg-slate-50/80 px-2 py-2 shadow-inner focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15 sm:mt-4 sm:min-h-[52px] sm:px-3">
              <div className="flex flex-wrap items-center gap-2">
                {jobTitles.map((title) => (
                  <span
                    key={title}
                    className="inline-flex max-w-full items-center gap-1 rounded-full border border-blue-100 bg-blue-50 py-1 pl-2.5 pr-1 text-xs font-medium text-blue-900 sm:pl-3 sm:text-sm"
                  >
                    <span className="truncate">{title}</span>
                    <button
                      type="button"
                      onClick={() => removeJobTitle(title)}
                      className="rounded-full p-1 text-blue-700 transition hover:bg-blue-100 hover:text-blue-900"
                      aria-label={`Remove ${title}`}
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
                {jobTitles.length < 10 ? (
                  <input
                    type="text"
                    value={jobTitleInput}
                    onChange={(e) => setJobTitleInput(e.target.value)}
                    onKeyDown={handleJobTitleKeyDown}
                    placeholder="e.g. Product Designer"
                    className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:min-w-[10rem]"
                  />
                ) : (
                  <span className="text-xs font-medium text-slate-500">
                    Maximum of 10 titles reached.
                  </span>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {jobTitles.length} / 10 titles added
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              Salary &amp; categories
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              We use this to filter jobs that meet your expectations and industry.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:mt-6 sm:grid-cols-2 sm:gap-6">
              <SelectField
                id="job-category"
                label="Job categories"
                hint="Primary industry or function you are targeting."
                value={jobCategory}
                onChange={setJobCategory}
              >
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </SelectField>

              <div className="space-y-2">
                <label
                  htmlFor="min-salary"
                  className="block text-sm font-medium text-slate-900"
                >
                  Minimum salary expectation
                </label>
                <p className="text-sm text-slate-500">Per month, before taxes.</p>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    EGP
                  </span>
                  <input
                    id="min-salary"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-14 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              Privacy settings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Control what employers see about you on the platform.
            </p>

            <ul className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/50 sm:mt-6">
              <li className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    Hide my salary
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    When enabled, your minimum salary is hidden from company
                    users.
                  </p>
                </div>
                <IosToggle
                  checked={hideSalary}
                  onChange={setHideSalary}
                  activeClass="bg-blue-600"
                />
              </li>
              <li className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    Allow companies to find me
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Recruiters with access can discover your profile in search.
                  </p>
                </div>
                <IosToggle
                  checked={allowCompanies}
                  onChange={setAllowCompanies}
                  activeClass="bg-emerald-500"
                />
              </li>
              <li className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    Make my profile public
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    A public profile may appear in recommendations and similar
                    candidate lists.
                  </p>
                </div>
                <IosToggle
                  checked={publicProfile}
                  onChange={setPublicProfile}
                  activeClass="bg-emerald-500"
                />
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* Fixed footer: full-width AuthButton on mobile, constrained on larger screens */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.06)] backdrop-blur-md supports-[backdrop-filter]:bg-white/80 sm:px-4 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-stretch gap-2 sm:items-end">
          {saveError ? (
            <p
              role="alert"
              className="text-center text-xs text-red-600 sm:text-right sm:text-sm"
            >
              {saveError}
            </p>
          ) : null}

          <AuthButton
            type="button"
            disabled={!canComplete || saving}
            onClick={handleDone}
            className="w-full sm:w-auto sm:min-w-[10rem] sm:px-6 sm:py-3"
          >
            {saving ? "Saving…" : "Done"}
          </AuthButton>

          {!canComplete ? (
            <p
              role="status"
              className="text-center text-xs leading-snug text-red-600 sm:text-right sm:text-sm"
            >
              Please select your career level and at least one job type to
              continue.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CareerInterests;
