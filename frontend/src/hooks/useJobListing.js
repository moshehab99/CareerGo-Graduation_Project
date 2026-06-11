import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  applyToJob,
  exploreJobs,
  hideJobApi,
  matchJobWithAI,
  toggleSaveJob,
} from "../lib/api";
import { mapJobFromApi } from "../lib/jobMapper";
import { isAuthenticated } from "../lib/userStorage";

/**
 * Shared job listing logic for Explore and Internships pages.
 */
export function useJobListing({ postType } = {}) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [matchModal, setMatchModal] = useState({
    open: false,
    loading: false,
    error: "",
    result: null,
    jobTitle: "",
  });
  const [matchingJobId, setMatchingJobId] = useState(null);

  const loadJobs = useCallback(async () => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const params = { limit: 50 };
      if (postType) params.postType = postType;
      if (search.trim()) params.q = search.trim();
      if (workplace) params.workplace = workplace;

      const res = await exploreJobs(params);
      setJobs((res.data || []).map(mapJobFromApi));
    } catch (err) {
      if (err.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError(err.message || "Could not load jobs.");
    } finally {
      setLoading(false);
    }
  }, [navigate, postType, search, workplace]);

  const toggleSave = async (job) => {
    try {
      await toggleSaveJob(job.id);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, isSaved: !j.isSaved } : j
        )
      );
    } catch (err) {
      alert(err.message || "Could not update saved jobs.");
    }
  };

  const applyToJobHandler = async (job) => {
    try {
      await applyToJob(job.id);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, isApplied: true, status: "Applied" } : j
        )
      );
    } catch (err) {
      alert(err.message || "Could not apply to this job.");
    }
  };

  const hideJob = async (job) => {
    try {
      await hideJobApi(job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (err) {
      alert(err.message || "Could not hide this job.");
    }
  };

  const shareJob = async (job) => {
    const text = `${job.title} at ${job.company} — ${job.location}`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      }
    } finally {
      alert("Job info copied. Share it anywhere you like.");
    }
  };

  const runMatch = async (job) => {
    setMatchingJobId(job.id);
    setMatchModal({
      open: true,
      loading: true,
      error: "",
      result: null,
      jobTitle: job.title,
    });
    try {
      const res = await matchJobWithAI(job.id);
      setMatchModal((m) => ({
        ...m,
        loading: false,
        result: res.data,
      }));
    } catch (err) {
      setMatchModal((m) => ({
        ...m,
        loading: false,
        error:
          err.message ||
          "Matching failed. Upload and extract your CV first.",
      }));
    } finally {
      setMatchingJobId(null);
    }
  };

  const closeMatchModal = () => {
    setMatchModal({
      open: false,
      loading: false,
      error: "",
      result: null,
      jobTitle: "",
    });
  };

  return {
    jobs,
    loading,
    error,
    search,
    setSearch,
    workplace,
    setWorkplace,
    loadJobs,
    toggleSave,
    applyToJobHandler,
    hideJob,
    shareJob,
    runMatch,
    matchModal,
    closeMatchModal,
    matchingJobId,
  };
}
