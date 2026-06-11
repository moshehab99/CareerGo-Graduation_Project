import React from "react";
import { X } from "lucide-react";

function ScoreBar({ score }) {
  const color =
    score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">Match Score</span>
        <span className="text-lg font-bold text-slate-900">{score}%</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}

function SkillList({ title, items, variant = "match" }) {
  if (!items?.length) return null;
  const styles =
    variant === "match"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
      : "bg-amber-50 text-amber-800 ring-amber-100";

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.map((skill) => (
          <li
            key={skill}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${styles}`}
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

const MatchModal = ({ open, onClose, loading, error, result, jobTitle }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">AI Job Match</h2>
            {jobTitle ? (
              <p className="mt-0.5 text-xs text-slate-500">{jobTitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-600">
              Analyzing your profile against this role…
            </p>
          ) : error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : result ? (
            <>
              <ScoreBar score={result.matchScore} />
              {result.recommendation ? (
                <p className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800">
                  {result.recommendation}
                </p>
              ) : null}
              <SkillList title="Matching Skills" items={result.matchedSkills} />
              <SkillList
                title="Missing Skills"
                items={result.missingSkills}
                variant="missing"
              />
              {result.strengths?.length ? (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Strengths</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
                    {result.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {result.recommendations?.length ? (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Recommendations
                  </h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
                    {result.recommendations.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
