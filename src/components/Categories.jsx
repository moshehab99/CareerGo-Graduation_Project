import React from "react";

const CATEGORIES = [
  {
    id: 1,
    name: "Software Development",
    roles: "Frontend, Backend, Full-stack",
    openings: "1,240+ jobs",
    color: "from-sky-500/10 via-sky-400/10 to-indigo-400/10",
    iconBg: "bg-sky-500",
  },
  {
    id: 2,
    name: "Data & AI",
    roles: "Data Scientist, Analyst, ML",
    openings: "540+ jobs",
    color: "from-emerald-500/10 via-teal-400/10 to-sky-400/10",
    iconBg: "bg-emerald-500",
  },
  {
    id: 3,
    name: "Marketing & Growth",
    roles: "Digital Marketing, SEO, Content",
    openings: "320+ jobs",
    color: "from-amber-500/10 via-orange-400/10 to-rose-400/10",
    iconBg: "bg-amber-500",
  },
  {
    id: 4,
    name: "Product & Design",
    roles: "Product Manager, UI/UX",
    openings: "210+ jobs",
    color: "from-indigo-500/10 via-violet-400/10 to-fuchsia-400/10",
    iconBg: "bg-indigo-500",
  },
  {
    id: 5,
    name: "Sales & Business",
    roles: "Account Manager, BDM",
    openings: "780+ jobs",
    color: "from-rose-500/10 via-red-400/10 to-amber-400/10",
    iconBg: "bg-rose-500",
  },
  {
    id: 6,
    name: "Operations & HR",
    roles: "HR, People Ops, Admin",
    openings: "410+ jobs",
    color: "from-slate-500/10 via-slate-400/10 to-sky-400/10",
    iconBg: "bg-slate-700",
  },
];

const Categories = () => {
  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Explore jobs by category
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Browse curated categories to quickly find roles that match your
              expertise.
            </p>
          </div>
          <button className="mt-2 text-sm font-medium text-slate-700 hover:text-blue-700">
            View all categories
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br ${cat.color} p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white ${cat.iconBg}`}
                >
                  {cat.name.split(" ")[0][0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">{cat.roles}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  {cat.openings}
                </span>
                <button className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200/80 transition group-hover:bg-slate-900 group-hover:text-white group-hover:ring-slate-900/80">
                  View jobs
                </button>
              </div>

              <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/30 opacity-0 blur-xl transition group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

