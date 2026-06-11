import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Mail, Briefcase, MapPin, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import { extractCVInfo, getCandidateProfile } from "../lib/api";
import { isAuthenticated } from "../lib/userStorage";

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Chip({ children }) {
  return (
    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-100">
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await getCandidateProfile();
        setProfile(res.data);
      } catch (err) {
        if (err.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        if (err.status === 403) {
          navigate("/company/dashboard", { replace: true });
          return;
        }
        setError(err.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const interests = profile?.careerInterests || {};
  const extracted = profile?.extractedProfile;
  const cvUrl = profile?.cv?.filename
    ? `${API_ORIGIN}/uploads/${profile.cv.filename}`
    : null;

  const targetJobs = interests.targetJobTitles || [];
  const categories = interests.jobCategories || [];
  const jobTypes = interests.jobTypes || [];
  const workplaces = interests.workplaceSettings || [];

  const skills = useMemo(() => {
    const fromExtracted = extracted?.skills || [];
    const fromTitles = targetJobs;
    const fromCategories = categories;
    return [...new Set([...fromExtracted, ...fromTitles, ...fromCategories])];
  }, [targetJobs, categories, extracted]);

  const handleExtractCV = async () => {
    if (!cvUrl || !profile?.cv?.filename) {
      setNotice({
        type: "error",
        text: "Please upload a CV first.",
      });
      return;
    }

    setExtracting(true);
    setNotice({ type: "", text: "" });
    try {
      const cvResponse = await fetch(cvUrl);
      if (!cvResponse.ok) {
        throw new Error("Could not read your CV file from the server.");
      }
      const blob = await cvResponse.blob();
      const fileName =
        profile.cv.originalName || profile.cv.filename || "cv.pdf";
      const file = new File([blob], fileName, {
        type: blob.type || "application/pdf",
      });
      console.log("[Profile] selectedFile:", file);
      console.log("[Profile] cvUrl:", cvUrl);

      const res = await extractCVInfo(file);
      setProfile(res.data);
      setNotice({
        type: "success",
        text: "CV information extracted and saved to your profile.",
      });
    } catch (err) {
      console.error("[Profile] extract CV error:", err);
      setNotice({
        type: "error",
        text: err.message || "Could not extract CV information.",
      });
    } finally {
      setExtracting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-10 text-sm text-slate-600">
          Loading profile…
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error || "Profile not found."}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-3xl space-y-5 px-4 py-8 md:px-6">
        {notice.text ? (
          <p
            role="alert"
            className={`rounded-xl px-4 py-3 text-sm ${
              notice.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {notice.text}
          </p>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
              {getInitials(profile.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-slate-900">
                {profile.fullName}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {profile.email}
              </p>
              <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                Candidate
              </p>
            </div>
          </div>
        </section>

        <Section title="CV / Resume">
          {profile.cv?.originalName ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.cv.originalName}
                  </p>
                  {profile.cv.uploadedAt ? (
                    <p className="text-xs text-slate-500">
                      Uploaded{" "}
                      {new Date(profile.cv.uploadedAt).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {cvUrl ? (
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    Download CV
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={handleExtractCV}
                  disabled={extracting || !profile.cv?.originalName}
                  className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {extracting ? "Extracting…" : "Extract CV Info"}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              No CV uploaded yet.{" "}
              <Link
                to="/upload-cv"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Upload your CV
              </Link>
            </div>
          )}
        </Section>

        <Section title="Target jobs">
          {targetJobs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {targetJobs.map((title) => (
                <Chip key={title}>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-3 w-3" aria-hidden />
                    {title}
                  </span>
                </Chip>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              No target roles yet.{" "}
              <Link
                to="/career-interests"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Set career interests
              </Link>
            </p>
          )}
        </Section>

        {extracted ? (
          <>
            {extracted.summary ? (
              <Section title="Professional summary">
                <p className="text-sm leading-relaxed text-slate-700">
                  {extracted.summary}
                </p>
              </Section>
            ) : null}

            {extracted.experience?.length ? (
              <Section title="Work experience (from CV)">
                <ul className="space-y-3">
                  {extracted.experience.map((exp, i) => (
                    <li
                      key={`${exp.jobTitle}-${i}`}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm"
                    >
                      <p className="font-semibold text-slate-900">{exp.jobTitle}</p>
                      <p className="text-slate-600">
                        {exp.company} · {exp.duration}
                      </p>
                      {exp.description ? (
                        <p className="mt-1 text-slate-600">{exp.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {extracted.education?.length ? (
              <Section title="Education (from CV)">
                <ul className="space-y-2 text-sm text-slate-700">
                  {extracted.education.map((edu, i) => (
                    <li key={`${edu.degree}-${i}`}>
                      <span className="font-medium">{edu.degree}</span> —{" "}
                      {edu.institution} ({edu.graduationYear})
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {extracted.certifications?.length ? (
              <Section title="Certifications">
                <ul className="flex flex-wrap gap-2">
                  {extracted.certifications.map((c) => (
                    <Chip key={c.name}>
                      {c.name} — {c.issuer}
                    </Chip>
                  ))}
                </ul>
              </Section>
            ) : null}

            {extracted.languages?.length ? (
              <Section title="Languages">
                <div className="flex flex-wrap gap-2">
                  {extracted.languages.map((lang) => (
                    <Chip key={lang}>{lang}</Chip>
                  ))}
                </div>
              </Section>
            ) : null}
          </>
        ) : null}

        <Section title="Skills & focus areas">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              Add job titles and categories in your career interests to show
              skills here.
            </p>
          )}
        </Section>

        <Section title="Experience & level">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Years of experience
              </dt>
              <dd className="mt-1 font-medium text-slate-900">
                {interests.yearsOfExperience || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Career level
              </dt>
              <dd className="mt-1 font-medium text-slate-900">
                {interests.careerLevel || "—"}
              </dd>
            </div>
          </dl>
        </Section>

        <Section title="Job preferences">
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Job types
              </p>
              {jobTypes.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {jobTypes.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-slate-600">—</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Workplace
              </p>
              {workplaces.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {workplaces.map((w) => (
                    <Chip key={w}>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" aria-hidden />
                        {w}
                      </span>
                    </Chip>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-slate-600">—</p>
              )}
            </div>
            {interests.minimumSalary?.amount ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Minimum salary
                </p>
                <p className="mt-1 font-medium text-slate-900">
                  {interests.minimumSalary.amount.toLocaleString()}{" "}
                  {interests.minimumSalary.currency || "EGP"}
                </p>
              </div>
            ) : null}
          </div>
        </Section>

        <Section title="Activity">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <dt className="text-xs text-slate-500">Applications</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-900">
                {profile.appliedJobs?.length || 0}
              </dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <dt className="text-xs text-slate-500">Saved jobs</dt>
              <dd className="mt-1 text-2xl font-semibold text-slate-900">
                {profile.savedJobs?.length || 0}
              </dd>
            </div>
          </dl>
        </Section>

        <div className="flex flex-wrap gap-3 pb-6">
          <Link
            to="/career-interests"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            Edit career interests
          </Link>
          <Link
            to="/upload-cv"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Update CV
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Profile;
