import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { searchCandidates } from "../lib/api";
import { isAuthenticated } from "../lib/userStorage";

const CompanyCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadCandidates = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      const params = search ? { q: search, limit: 20 } : { limit: 20 };
      const res = await searchCandidates(params);
      setCandidates(res.data || []);
    } catch (err) {
      if (err.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError(err.message || "Could not load candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    loadCandidates();
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadCandidates(query.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Candidates</h1>
          <p className="mt-2 text-sm text-slate-600">
            Search talent who opted in to be discovered by companies.
          </p>

          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or job title…"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Loading candidates…</p>
          ) : error ? (
            <p className="mt-6 text-sm text-red-600">{error}</p>
          ) : candidates.length === 0 ? (
            <p className="mt-6 text-sm text-slate-600">No candidates found.</p>
          ) : (
            <ul className="mt-6 space-y-3">
              {candidates.map((c) => (
                <li
                  key={c._id}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <p className="font-medium text-slate-900">{c.fullName}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {c.careerInterests?.careerLevel || "Level not set"}
                    {c.careerInterests?.targetJobTitles?.length
                      ? ` · ${c.careerInterests.targetJobTitles.slice(0, 2).join(", ")}`
                      : ""}
                  </p>
                  {c.cv?.uploadedAt ? (
                    <p className="mt-1 text-[11px] text-emerald-700">CV uploaded</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/post-job"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Post a job
            </Link>
            <Link
              to="/company/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyCandidates;
