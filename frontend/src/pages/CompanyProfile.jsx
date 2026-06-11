import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Building2, Globe, Mail, MapPin, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import { getCompanyProfile } from "../lib/api";
import { mapJobFromApi } from "../lib/jobMapper";

const CompanyProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getCompanyProfile(id);
        setData(res.data);
      } catch (err) {
        setError(err.message || "Could not load company profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const company = data?.company;
  const jobs = (data?.jobs || []).map(mapJobFromApi);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 md:px-6">
        {loading ? (
          <p className="text-sm text-slate-600">Loading company…</p>
        ) : error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : company ? (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
                  {company.logo || company.companyName?.slice(0, 2)?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-slate-900">
                    {company.companyName}
                  </h1>
                  {company.industry ? (
                    <p className="mt-1 text-sm text-slate-600">{company.industry}</p>
                  ) : null}
                  <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {data.openPositions} open position{data.openPositions !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {company.description ? (
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  {company.description}
                </p>
              ) : null}

              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                {company.location ? (
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {company.location}
                  </div>
                ) : null}
                {company.email ? (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {company.email}
                  </div>
                ) : null}
                {company.website ? (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                ) : null}
                {company.companySize ? (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Users className="h-4 w-4 text-slate-400" />
                    {company.companySize} employees
                  </div>
                ) : null}
                {company.foundedYear ? (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    Founded {company.foundedYear}
                  </div>
                ) : null}
              </dl>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                Open positions
              </h2>
              {jobs.length === 0 ? (
                <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                  No active jobs posted right now.
                </p>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      {...job}
                      companyId={company._id}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}

        <Link
          to="/explore"
          className="inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to explore
        </Link>
      </main>
    </div>
  );
};

export default CompanyProfile;
