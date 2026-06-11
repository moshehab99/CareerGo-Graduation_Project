import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ConfirmDialog from "../components/ConfirmDialog";
import { deleteJob, getCompanyDashboard } from "../lib/api";
import { isAuthenticated } from "../lib/userStorage";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCompanyDashboard();
      setStats(res.data);
    } catch (err) {
      if (err.status === 401) navigate("/login", { replace: true });
      else setError(err.message || "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    loadDashboard();
  }, [navigate]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJob(deleteTarget._id);
      setDeleteTarget(null);
      await loadDashboard();
    } catch (err) {
      alert(err.message || "Could not delete job.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete job posting?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        danger
      />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Company dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your job postings and track applicants.
          </p>

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Loading stats…</p>
          ) : error ? (
            <p className="mt-6 text-sm text-red-600">{error}</p>
          ) : stats ? (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-500">Total jobs</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalJobs}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-500">Active jobs</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.activeJobs}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase text-slate-500">Applicants</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalApplicants}</p>
              </div>
            </div>
          ) : null}

          {stats?.jobs?.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-slate-900">Your job postings</h2>
              <ul className="mt-3 space-y-2">
                {stats.jobs.map((job) => (
                  <li
                    key={job._id}
                    className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="font-medium text-slate-800">{job.title}</span>
                      <span className="ml-2 text-xs text-slate-500">{job.status}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/post-job?edit=${job._id}`}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(job)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/post-job"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
            >
              Post a Job
            </Link>
            <Link
              to="/company/candidates"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Browse candidates
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
