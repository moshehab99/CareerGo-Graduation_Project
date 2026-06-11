import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import MatchModal from "../components/MatchModal";
import { getSavedJobs, matchJobWithAI, removeSavedJob } from "../lib/api";
import { mapJobFromApi } from "../lib/jobMapper";
import { isAuthenticated } from "../lib/userStorage";

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchModal, setMatchModal] = useState({
    open: false,
    loading: false,
    error: "",
    result: null,
    jobTitle: "",
  });
  const [matchingJobId, setMatchingJobId] = useState(null);

  const load = async () => {
    try {
      const res = await getSavedJobs();
      setSavedJobs((res.data || []).map((j) => ({ ...mapJobFromApi(j), isSaved: true })));
    } catch (err) {
      if (err.status === 401) navigate("/login", { replace: true });
      else setError(err.message || "Could not load saved jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    load();
  }, [navigate]);

  const savedIds = useMemo(
    () => new Set(savedJobs.map((j) => j.id)),
    [savedJobs]
  );

  const removeSaved = async (job) => {
    try {
      await removeSavedJob(job.id);
      setSavedJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (err) {
      alert(err.message || "Could not remove saved job.");
    }
  };

  const runMatch = async (job) => {
    setMatchingJobId(job.id);
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
      setMatchingJobId(null);
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

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-0">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-slate-900">Saved Jobs</h1>
          <p className="mt-1 text-xs text-slate-600">
            Keep track of roles you want to revisit. Click a job to view details.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            Loading saved jobs…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            You have no saved jobs yet.
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                isSaved={savedIds.has(job.id)}
                onToggleSave={() => removeSaved(job)}
                onShare={() => navigator.clipboard?.writeText?.(`${job.title} at ${job.company}`)}
                onHide={() => removeSaved(job)}
                onApply={() => navigate(`/jobs/${job.id}`)}
                onMatch={() => runMatch(job)}
                matchLoading={matchingJobId === job.id}
                showHide={false}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedJobs;
