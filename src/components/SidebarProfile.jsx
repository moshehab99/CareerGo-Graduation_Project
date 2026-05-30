import React from "react";

const Card = ({ children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    {children}
  </section>
);

const SidebarProfile = ({ interests }) => {
  const titles = interests?.jobTitles?.length
    ? interests.jobTitles.join(", ")
    : "Complete career interests to target roles";
  const cat = interests?.jobCategory || "—";

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <Card>
        <h3 className="text-sm font-semibold text-slate-900">Your matches</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Jobs on Explore are filtered using your saved{" "}
          <span className="font-medium text-slate-800">userInterests</span>{" "}
          profile.
        </p>
        <dl className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-700">
          <div>
            <dt className="font-medium text-slate-500">Target titles</dt>
            <dd className="mt-0.5">{titles}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Primary category</dt>
            <dd className="mt-0.5">{cat}</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-900">
          Kickstart Your Career
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Internships help you gain practical skills.
        </p>
        <button
          type="button"
          className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Explore Internships
        </button>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            YH
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">
              Yousef Helmy
            </div>
            <div className="text-xs text-slate-500">Candidate</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <div className="text-xs font-semibold text-slate-900">
            Add More Experiences
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Add projects or internships to boost your profile and get better
            matches.
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
          >
            Add Experience
          </button>
        </div>
      </Card>
    </aside>
  );
};

export default SidebarProfile;
