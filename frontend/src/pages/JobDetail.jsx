import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MatchModal from "../components/MatchModal";
import JobActions from "../components/JobActions";
import {
  applyToJob,
  getJobById,
  matchJobWithAI,
  toggleSaveJob,
} from "../lib/api";
import { mapJobFromApi } from "../lib/jobMapper";
import { isAuthenticated } from "../lib/userStorage";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchModal, setMatchModal] = useState({
    open: false,
    loading: false,
    error: "",
    result: null,
    jobTitle: "",
  });
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await getJobById(id);
        setJob(mapJobFromApi(res.data));
      } catch (err) {
        if (err.status === 401) navigate("/login", { replace: true });
        else setError(err.message || "Job not found.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const toggleSave = async () => {
    try {
      await toggleSaveJob(job.id);
      setJob((j) => ({ ...j, isSaved: !j.isSaved }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApply = async () => {
    try {
      await applyToJob(job.id);
      setJob((j) => ({ ...j, isApplied: true, status: "Applied" }));
    } catch (err) {
      alert(err.message);
    }
  };

  const runMatch = async () => {
    setMatching(true);
    setMatchModal({ open: true, loading: true, error: "", result: null, jobTitle: job.title });
    try {
      const res = await matchJobWithAI(job.id);
      setMatchModal((m) => ({ ...m, loading: false, result: res.data }));
    } catch (err) {
      setMatchModal((m) => ({
        ...m,
        loading: false,
        error: err.message || "Matching failed.",
      }));
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <MatchModal
        {...matchModal}
        onClose={() =>
          setMatchModal({ open: false, loading: false, error: "", result: null, jobTitle: "" })
        }
      />

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        {loading ? (
          <p className="text-sm text-slate-600">Loading job…</p>
        ) : error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : job ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">{job.title}</h1>
            {job.companyId ? (
              <Link
                to={`/company/${job.companyId}`}
                className="mt-1 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                {job.company}
              </Link>
            ) : (
              <p className="mt-1 text-sm text-slate-600">{job.company}</p>
            )}
            <p className="mt-1 text-sm text-slate-500">{job.location}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.tags?.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-100"
                >
                  {t}
                </span>
              ))}
            </div>

            {job.skills?.length ? (
              <div className="mt-4">
                <h2 className="text-sm font-semibold text-slate-900">Required skills</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {job.description ? (
              <div className="mt-5">
                <h2 className="text-sm font-semibold text-slate-900">Description</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {job.description}
                </p>
              </div>
            ) : null}

            <JobActions
              isSaved={job.isSaved}
              onToggleSave={toggleSave}
              onShare={() => navigator.clipboard?.writeText?.(`${job.title} at ${job.company}`)}
              onHide={() => navigate(-1)}
              onApply={handleApply}
              onMatch={runMatch}
              matchLoading={matching}
              showHide={false}
            />
          </article>
        ) : null}

        <Link
          to="/explore"
          className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to explore
        </Link>
      </main>
    </div>
  );
};

export default JobDetail;
