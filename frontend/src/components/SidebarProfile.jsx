import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    {children}
  </section>
);

const SidebarProfile = ({ interests }) => {
  const navigate = useNavigate();
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
          onClick={() => navigate("/internships")}
          className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Explore Internships
        </button>
      </Card>

    </aside>
  );
};

export default SidebarProfile;
