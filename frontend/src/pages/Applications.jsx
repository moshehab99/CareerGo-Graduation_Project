import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import { getMyApplications } from "../lib/api";
import { mapJobFromApi } from "../lib/jobMapper";
import { isAuthenticated } from "../lib/userStorage";

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await getMyApplications();
        const items = (res.data || [])
          .filter((app) => app.job)
          .map((app) => ({
            ...mapJobFromApi(app.job),
            status: app.status || "Applied",
          }));
        setApplications(items);
      } catch (err) {
        if (err.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setError(err.message || "Could not load applications.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const cards = useMemo(
    () => applications.map((j) => ({ ...j, status: j.status || "Applied" })),
    [applications]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-0">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-slate-900">Applications</h1>
          <p className="mt-1 text-xs text-slate-600">
            Track roles you&apos;ve applied to.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            Loading applications…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        ) : cards.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            You have no applications yet.
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                status={job.status}
                showActions={false}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Applications;
