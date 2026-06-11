import React from "react";
import { Link } from "react-router-dom";
import JobActions from "./JobActions";

const JobCard = ({
  id,
  title,
  company,
  companyId,
  location,
  tags,
  type,
  experienceLevel,
  skills,
  logo,
  postedAt,
  isFeatured,
  status,
  isSaved,
  onToggleSave,
  onShare,
  onHide,
  onApply,
  onMatch,
  matchLoading,
  showActions = true,
  showApply = true,
  showHide = true,
  showMatch = true,
}) => {
  const badge = status || (isFeatured ? "Featured" : null);

  return (
    <article
      className={`group flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isFeatured
          ? "border-blue-200 ring-1 ring-blue-100"
          : "border-slate-100"
      }`}
    >
      <div className="flex items-start gap-3">
        {companyId ? (
          <Link
            to={`/company/${companyId}`}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
          >
            {logo || company?.[0]}
          </Link>
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
            {logo || company?.[0]}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/jobs/${id}`}
              className="text-sm font-semibold text-slate-900 transition hover:text-blue-700"
            >
              {title}
            </Link>
            {badge && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${
                  badge === "Applied"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                    : "bg-amber-50 text-amber-700 ring-amber-100"
                }`}
              >
                {badge}
              </span>
            )}
          </div>
          {companyId ? (
            <Link
              to={`/company/${companyId}`}
              className="mt-1 block text-xs font-medium text-slate-600 transition hover:text-blue-700"
            >
              {company}
            </Link>
          ) : (
            <p className="mt-1 text-xs font-medium text-slate-600">{company}</p>
          )}
          <p className="mt-0.5 text-xs text-slate-500">{location}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {type && (
          <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100">
            {type}
          </span>
        )}
        {experienceLevel && (
          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-100">
            {experienceLevel}
          </span>
        )}
        {tags?.map((tag) => (
          <span
            key={tag}
            className="inline-flex rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-100"
          >
            {tag}
          </span>
        ))}
      </div>

      {skills?.length ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 ring-1 ring-blue-100"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500">
          {postedAt ? `Posted ${postedAt}` : ""}
        </span>
        <Link
          to={`/jobs/${id}`}
          className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
        >
          View details
        </Link>
      </div>

      {showActions ? (
        <JobActions
          isSaved={!!isSaved}
          onToggleSave={onToggleSave}
          onShare={onShare}
          onHide={onHide}
          onApply={onApply}
          onMatch={onMatch}
          matchLoading={matchLoading}
          showApply={showApply}
          showHide={showHide}
          showMatch={showMatch}
        />
      ) : null}
    </article>
  );
};

export default JobCard;
