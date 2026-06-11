import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Loader2,
  Mic,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { createJob, getMyJobs, saveJobDraft, updateJob } from "../lib/api";
import { mapJobPayloadToApi } from "../lib/jobMapper";
import { mockAiJobDescription } from "../lib/mockAiJobDescription";

const JOB_CATEGORIES_POOL = [
  "Accounting / Finance",
  "Customer Service / Support",
  "Engineering - Mechanical / Electrical",
  "IT / Software Development",
  "Human Resources",
  "Marketing / PR / Advertising",
  "Operations / Logistics",
  "Sales / Business Development",
  "Creative / Design",
  "Healthcare / Pharmaceutical",
  "Education / Training",
  "Other",
];

const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Freelance / Project",
  "Internship",
  "Shift Based",
];

const WORKPLACE_OPTIONS = ["On-site", "Remote", "Hybrid"];

const MAX_CATEGORIES = 3;
const MAX_SKILLS = 12;

function StepIndicator({ currentStep }) {
  const steps = [
    { n: 1, label: "Job Info" },
    { n: 2, label: "Application Form" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-0 sm:gap-2">
        {steps.map((s, i) => {
          const active = currentStep === s.n;
          const done = currentStep > s.n;
          return (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : done
                        ? "bg-blue-100 text-blue-700"
                        : "border-2 border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {done ? <Check className="h-5 w-5" strokeWidth={2.5} /> : s.n}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    active
                      ? "text-blue-700"
                      : done
                        ? "text-slate-700"
                        : "text-slate-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 ? (
                <div
                  className={`mx-1 h-0.5 w-8 sm:mx-2 sm:w-16 ${
                    currentStep > s.n ? "bg-blue-600" : "bg-slate-200"
                  }`}
                  aria-hidden
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-slate-500 sm:hidden">
        Step {currentStep} of 2 — {steps[currentStep - 1].label}
      </p>
    </div>
  );
}

function Card({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 ${className}`}
    >
      {title ? (
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      ) : null}
      <div className={title || subtitle ? "mt-5" : ""}>{children}</div>
    </section>
  );
}

const PostJob = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(Boolean(editId));

  const [postType, setPostType] = useState("job");

  useEffect(() => {
    if (!editId) return;
    (async () => {
      try {
        const res = await getMyJobs();
        const job = (res.data || []).find((j) => j._id === editId);
        if (!job) {
          setSubmitError("Job not found for editing.");
          return;
        }
        setPostType(job.postType === "Internship" ? "internship" : "job");
        setJobTitle(job.title || "");
        setJobCategories(job.categories || []);
        setMainSkills(job.skills || []);
        setJobType(job.jobType || "Full Time");
        setWorkplace(job.workplace || "Hybrid");
        setLocation(job.location || "");
        setSalaryMin(job.salaryRange?.min?.toString() || "");
        setSalaryMax(job.salaryRange?.max?.toString() || "");
        setAiBrief(job.description || job.summary || "");
      } catch (err) {
        setSubmitError(err.message || "Could not load job for editing.");
      } finally {
        setLoadingEdit(false);
      }
    })();
  }, [editId]);

  const [jobTitle, setJobTitle] = useState("");
  const [jobCategories, setJobCategories] = useState([]);
  const [categoryPicker, setCategoryPicker] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [mainSkills, setMainSkills] = useState([]);
  const [jobType, setJobType] = useState("Full Time");
  const [workplace, setWorkplace] = useState("Hybrid");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  const [aiBrief, setAiBrief] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiMode, setAiMode] = useState(null);

  const [requireCoverLetter, setRequireCoverLetter] = useState(true);
  const [applicationNotes, setApplicationNotes] = useState("");

  const [screeningDraft, setScreeningDraft] = useState("");
  const [screeningAnswerType, setScreeningAnswerType] = useState("text");
  const [screeningQuestions, setScreeningQuestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const [companyConfidential, setCompanyConfidential] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState("daily");
  const [notificationEmail, setNotificationEmail] = useState("");

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedExternalUrl, setAdvancedExternalUrl] = useState("");
  const [advancedAutoCloseDays, setAdvancedAutoCloseDays] = useState("");

  const [voiceHint, setVoiceHint] = useState("");

  const mockAiFill = useCallback((mode, titleSnapshot) => {
    setAiGenerating(true);
    setAiMode(mode);
    const snap = (titleSnapshot || "").trim();
    window.setTimeout(() => {
      const effectiveTitle = snap || "Senior Software Engineer";
      setJobTitle((t) => t || effectiveTitle);
      setMainSkills((prev) =>
        prev.length
          ? prev
          : ["React", "TypeScript", "Node.js", "REST APIs", "Agile"]
      );
      setJobCategories((prev) =>
        prev.length ? prev : ["IT / Software Development"]
      );
      setLocation((l) => l || "Cairo, Egypt");
      setSalaryMin((m) => m || "25000");
      setSalaryMax((m) => m || "40000");
      setAiBrief((b) => {
        if (b && b.trim()) return b;
        return mockAiJobDescription(effectiveTitle);
      });
      setAiGenerating(false);
      setAiMode(null);
    }, 1400);
  }, []);

  const handleGenerateWithoutVoice = () => {
    if (aiGenerating) return;
    setVoiceHint("");
    mockAiFill("text", jobTitle);
  };

  const handleVoiceInput = () => {
    if (aiGenerating) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceHint(
        "Voice input is not supported in this browser. Try Generate without voice, or use Chrome."
      );
      return;
    }
    setAiGenerating(true);
    setAiMode("voice");
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (ev) => {
      const text = ev.results[0][0].transcript;
      setAiBrief((prev) =>
        prev && prev.trim() ? `${prev.trim()}\n${text}` : text
      );
    };
    rec.onerror = () => {
      setAiGenerating(false);
      setAiMode(null);
    };
    rec.onend = () => {
      setAiGenerating(false);
      setAiMode(null);
    };
    try {
      rec.start();
    } catch {
      setAiGenerating(false);
      setAiMode(null);
      setVoiceHint("Could not start the microphone. Check permissions.");
    }
  };

  const addCategory = (value) => {
    if (!value || jobCategories.includes(value)) return;
    if (jobCategories.length >= MAX_CATEGORIES) return;
    setJobCategories((c) => [...c, value]);
    setCategoryPicker("");
  };

  const removeCategory = (c) =>
    setJobCategories((prev) => prev.filter((x) => x !== c));

  const addSkill = (raw) => {
    const s = raw.trim();
    if (!s || mainSkills.includes(s) || mainSkills.length >= MAX_SKILLS)
      return;
    setMainSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const onSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(skillInput);
    }
    if (
      e.key === "Backspace" &&
      skillInput === "" &&
      mainSkills.length > 0
    ) {
      e.preventDefault();
      setMainSkills((prev) => prev.slice(0, -1));
    }
  };

  const canGoStep2 =
    jobTitle.trim() &&
    jobCategories.length > 0 &&
    mainSkills.length > 0 &&
    location.trim() &&
    salaryMin.trim() &&
    salaryMax.trim();

  const buildJobPayload = useCallback(
    () => ({
      postType,
      jobTitle,
      jobCategories,
      mainSkills,
      jobType,
      workplace,
      location,
      salaryMin,
      salaryMax,
      aiBrief,
      requireCoverLetter,
      applicationNotes,
      screeningQuestions,
      companyConfidential,
      emailNotifications,
      notificationFrequency,
      notificationEmail,
      advancedExternalUrl,
      advancedAutoCloseDays,
    }),
    [
      postType,
      jobTitle,
      jobCategories,
      mainSkills,
      jobType,
      workplace,
      location,
      salaryMin,
      salaryMax,
      aiBrief,
      requireCoverLetter,
      applicationNotes,
      screeningQuestions,
      companyConfidential,
      emailNotifications,
      notificationFrequency,
      notificationEmail,
      advancedExternalUrl,
      advancedAutoCloseDays,
    ]
  );

  const newQuestionId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `q-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const addScreeningQuestion = () => {
    const text = screeningDraft.trim();
    if (!text || screeningQuestions.length >= 5) return;
    setScreeningQuestions((prev) => [
      ...prev,
      { id: newQuestionId(), text, answerType: screeningAnswerType },
    ]);
    setScreeningDraft("");
  };

  const removeScreeningQuestion = (id) => {
    setScreeningQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleGetSuggestions = () => {
    if (suggestionsLoading || screeningQuestions.length >= 5) return;
    setSuggestionsLoading(true);
    window.setTimeout(() => {
      const pool = [
        {
          text: "Do you have at least 3 years of experience in a similar role?",
          answerType: "yesno",
        },
        {
          text: "Briefly describe a project where you improved performance or reliability.",
          answerType: "text",
        },
        {
          text: "In one minute, explain why you are a strong fit for this team.",
          answerType: "voice",
        },
      ];
      setScreeningQuestions((prev) => {
        const next = [...prev];
        for (const item of pool) {
          if (next.length >= 5) break;
          if (!next.some((q) => q.text === item.text)) {
            next.push({ id: newQuestionId(), ...item });
          }
        }
        return next;
      });
      setSuggestionsLoading(false);
    }, 900);
  };

  const handleSaveDraft = async () => {
    const payload = buildJobPayload();
    setSubmitting(true);
    setSubmitError("");
    try {
      localStorage.setItem("draftJobPost", JSON.stringify(payload));
      await saveJobDraft(mapJobPayloadToApi(payload, "Draft"));
      navigate("/company/dashboard", { replace: false });
    } catch (err) {
      setSubmitError(err.message || "Could not save draft.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostNow = async () => {
    const payload = buildJobPayload();
    setSubmitting(true);
    setSubmitError("");
    try {
      const apiPayload = mapJobPayloadToApi(payload, "Active");
      if (editId) {
        await updateJob(editId, apiPayload);
      } else {
        await createJob(apiPayload);
      }
      navigate("/company/dashboard", { replace: true });
    } catch (err) {
      setSubmitError(err.message || "Could not post job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 ${step === 2 ? "pb-36 sm:pb-32" : "pb-10"}`}
    >
      <Navbar />

      <div className="border-b border-slate-200 bg-white/90">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Employer
            </p>
            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
              {editId ? "Edit Job" : "Post New Job"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 sm:text-right">
            Drafts autosave locally when you use &quot;Save and post later&quot;.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-8">
        <p className="mb-6 text-center text-sm text-slate-500">
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Clone a previous post
          </button>{" "}
          <span className="hidden sm:inline">(coming soon)</span>
        </p>

        <StepIndicator currentStep={step} />

        {loadingEdit ? (
          <p className="mb-4 text-sm text-slate-600">Loading job for editing…</p>
        ) : null}

        {submitError ? (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {submitError}
          </p>
        ) : null}

        {step === 1 ? (
          <div className="flex flex-col gap-5 sm:gap-6">
            <Card
              title="Post type"
              subtitle="Choose whether you are hiring for a permanent role or an internship program."
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { id: "job", label: "Job" },
                  { id: "internship", label: "Internship" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPostType(opt.id)}
                    className={`rounded-2xl border-2 px-4 py-4 text-left text-sm font-semibold transition ${
                      postType === opt.id
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card
              title="AI-powered job post generator"
              subtitle="Describe the role in your own words, then generate a strong draft in one click—or speak it with voice input."
            >
              <div className="flex items-start gap-2 rounded-xl border border-violet-100 bg-violet-50/60 p-3 text-sm text-violet-900">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                <p>
                  Our assistant drafts title, summary, and skill suggestions from
                  your notes. Use{" "}
                  <span className="font-semibold">Generate without voice</span>{" "}
                  to run the model.{" "}
                  <span className="font-semibold">Voice input</span> fills the
                  notes box from your microphone (then generate).
                </p>
              </div>

              {voiceHint ? (
                <p
                  className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
                  role="status"
                >
                  {voiceHint}{" "}
                  <button
                    type="button"
                    className="font-semibold text-amber-950 underline"
                    onClick={() => setVoiceHint("")}
                  >
                    Dismiss
                  </button>
                </p>
              ) : null}

              <label className="mt-4 block text-sm font-medium text-slate-900">
                What should this job post say?
              </label>
              <textarea
                value={aiBrief}
                onChange={(e) => setAiBrief(e.target.value)}
                rows={4}
                placeholder="e.g. Mid-level backend engineer, Cairo hybrid, Python and PostgreSQL, mentoring juniors…"
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleGenerateWithoutVoice}
                  disabled={aiGenerating}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 sm:flex-none sm:px-5"
                >
                  {aiGenerating && aiMode === "text" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate without voice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceHint("");
                    handleVoiceInput();
                  }}
                  disabled={aiGenerating}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-5"
                >
                  {aiGenerating && aiMode === "voice" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  ) : (
                    <Mic className="h-4 w-4 text-blue-600" />
                  )}
                  Voice input
                </button>
              </div>
              {aiGenerating ? (
                <p className="mt-2 text-xs text-slate-500">
                  {aiMode === "voice"
                    ? "Listening… speak clearly. When finished, edit the notes if needed, then use Generate without voice for a full draft."
                    : "Generating a tailored draft from your notes…"}
                </p>
              ) : null}
            </Card>

            <Card title="Job details" subtitle="Core information candidates see first.">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-900">
                    Job title <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-violet-600">
                    <Sparkles className="h-3 w-3" />
                    Our AI assistant can suggest a better-performing alternative.
                  </p>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Management Accountant"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <label className="text-sm font-medium text-slate-900">
                      Job category <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-slate-500">
                      — max. {MAX_CATEGORIES}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                      value={categoryPicker}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCategoryPicker(v);
                        if (v) addCategory(v);
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 sm:max-w-xs"
                    >
                      <option value="">Select categories…</option>
                      {JOB_CATEGORIES_POOL.filter(
                        (c) => !jobCategories.includes(c)
                      ).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {jobCategories.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 py-1 pl-3 pr-1 text-xs font-medium text-blue-900 sm:text-sm"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() => removeCategory(c)}
                          className="rounded-full p-1 text-blue-700 hover:bg-blue-100"
                          aria-label={`Remove ${c}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900">
                    Main skills <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Press Enter after each skill. Backspace on an empty field
                    removes the last chip.
                  </p>
                  <div className="mt-2 min-h-[48px] rounded-xl border border-slate-200 bg-slate-50/80 px-2 py-2 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15 sm:px-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {mainSkills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white py-1 pl-2.5 pr-1 text-xs font-medium text-slate-800 sm:text-sm"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() =>
                              setMainSkills((prev) =>
                                prev.filter((x) => x !== s)
                              )
                            }
                            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            aria-label={`Remove ${s}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                      {mainSkills.length < MAX_SKILLS ? (
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={onSkillKeyDown}
                          placeholder="e.g. React"
                          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Job type <span className="text-red-500">*</span>
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {JOB_TYPES.map((jt) => (
                      <button
                        key={jt}
                        type="button"
                        onClick={() => setJobType(jt)}
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                          jobType === jt
                            ? "border-blue-600 bg-blue-50 text-blue-900"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {jt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Workplace <span className="text-red-500">*</span>
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {WORKPLACE_OPTIONS.map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWorkplace(w)}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                          workplace === w
                            ? "border-blue-600 bg-blue-50 text-blue-900"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="job-location"
                    className="block text-sm font-medium text-slate-900"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="job-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, country or hybrid detail"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Salary range (EGP / month) <span className="text-red-500">*</span>
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                        Min
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        EGP
                      </span>
                    </div>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                        Max
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-12 pr-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        EGP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={!canGoStep2}
                onClick={() => setStep(2)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Continue to application form
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {!canGoStep2 ? (
              <p className="text-center text-xs text-slate-500">
                Fill job title, at least one category, skills, location, and
                salary range to continue.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-5 sm:gap-6">
            <Card
              title="Application form"
              subtitle="Step 2 — configure how candidates apply and what you collect from them."
            >
              <div className="space-y-5">
                <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Require cover letter
                    </p>
                    <p className="text-xs text-slate-500">
                      Candidates upload or paste a short letter.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={requireCoverLetter}
                    onClick={() => setRequireCoverLetter((v) => !v)}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
                      requireCoverLetter ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${
                        requireCoverLetter ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>

                <div>
                  <label className="block text-sm font-medium text-slate-900">
                    Application instructions
                  </label>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Shown at the top of your application page (portfolio links,
                    coding exercise, etc.).
                  </p>
                  <textarea
                    value={applicationNotes}
                    onChange={(e) => setApplicationNotes(e.target.value)}
                    rows={4}
                    placeholder="Optional directions for applicants…"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>
            </Card>

            <Card
              title="Screening questions"
              subtitle="Ask up to five short questions. Choose how each answer should be submitted."
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500">
                  {screeningQuestions.length} / 5 added
                </span>
              </div>

              <label className="block text-sm font-medium text-slate-900">
                Write your own question
              </label>
              <input
                type="text"
                value={screeningDraft}
                onChange={(e) => setScreeningDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addScreeningQuestion();
                  }
                }}
                placeholder="e.g. Have you led a team of 5+ engineers?"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />

              <p className="mt-4 text-sm font-medium text-slate-900">
                Answer type
              </p>
              <div
                className="mt-2 flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Answer type for new screening question"
              >
                {[
                  { id: "yesno", label: "Yes / No" },
                  { id: "text", label: "Text" },
                  { id: "voice", label: "Voice" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      screeningAnswerType === opt.id
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="screeningAnswerType"
                      value={opt.id}
                      checked={screeningAnswerType === opt.id}
                      onChange={() => setScreeningAnswerType(opt.id)}
                      className="sr-only"
                    />
                    {opt.id === "voice" ? (
                      <Mic className="h-4 w-4 text-blue-600" aria-hidden />
                    ) : null}
                    {opt.label}
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={addScreeningQuestion}
                  disabled={
                    !screeningDraft.trim() || screeningQuestions.length >= 5
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
                <button
                  type="button"
                  onClick={handleGetSuggestions}
                  disabled={
                    suggestionsLoading || screeningQuestions.length >= 5
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                >
                  {suggestionsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  ) : (
                    <span className="flex items-center gap-1">
                      <Bot className="h-4 w-4 text-violet-600" />
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    </span>
                  )}
                  Get suggestions
                </button>
              </div>

              {screeningQuestions.length > 0 ? (
                <ul className="mt-5 space-y-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                  {screeningQuestions.map((q) => (
                    <li
                      key={q.id}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900">{q.text}</p>
                        <p className="mt-0.5 text-xs capitalize text-slate-500">
                          {q.answerType === "yesno"
                            ? "Yes / No"
                            : q.answerType === "voice"
                              ? "Voice"
                              : "Text"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeScreeningQuestion(q.id)}
                        className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Remove question"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-xs text-slate-500">
                  No screening questions yet. Add your own or use Get
                  suggestions.
                </p>
              )}
            </Card>

            <Card
              title="Job options"
              subtitle="Visibility and how you stay updated on this post."
            >
              <div className="space-y-4">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50/80">
                  <input
                    type="checkbox"
                    checked={companyConfidential}
                    onChange={(e) => setCompanyConfidential(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/40"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-900">
                      Keep company confidential
                    </span>
                    <span className="text-xs text-slate-500">
                      Hide your company name on the public listing (where
                      supported).
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50/80">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/40"
                  />
                  <span>
                    <span className="block text-sm font-medium text-slate-900">
                      Send me email notifications
                    </span>
                    <span className="text-xs text-slate-500">
                      Get summaries of new applications and activity on this job.
                    </span>
                  </span>
                </label>

                {emailNotifications ? (
                  <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                    <p className="text-sm font-medium text-slate-900">
                      Notification frequency
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "daily", label: "Daily" },
                        { id: "weekly", label: "Weekly" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setNotificationFrequency(opt.id)}
                          className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                            notificationFrequency === opt.id
                              ? "border-blue-600 bg-white text-blue-900 shadow-sm"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label
                        htmlFor="notification-email"
                        className="block text-sm font-medium text-slate-900"
                      >
                        Recipient email
                      </label>
                      <input
                        id="notification-email"
                        type="email"
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                        placeholder="you@company.com"
                        autoComplete="email"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setAdvancedOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-slate-50 sm:px-6"
                aria-expanded={advancedOpen}
              >
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Advanced settings
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Optional links and automation for power users.
                  </p>
                </div>
                {advancedOpen ? (
                  <ChevronUp className="h-5 w-5 shrink-0 text-slate-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />
                )}
              </button>
              {advancedOpen ? (
                <div className="space-y-4 border-t border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
                  <div>
                    <label
                      htmlFor="external-apply-url"
                      className="block text-sm font-medium text-slate-900"
                    >
                      External apply URL
                    </label>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Send candidates to your ATS or careers site (optional).
                    </p>
                    <input
                      id="external-apply-url"
                      type="url"
                      value={advancedExternalUrl}
                      onChange={(e) => setAdvancedExternalUrl(e.target.value)}
                      placeholder="https://"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="auto-close-days"
                      className="block text-sm font-medium text-slate-900"
                    >
                      Auto-close after (days)
                    </label>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Leave empty to keep the post open until you close it.
                    </p>
                    <input
                      id="auto-close-days"
                      type="number"
                      min={0}
                      value={advancedAutoCloseDays}
                      onChange={(e) => setAdvancedAutoCloseDays(e.target.value)}
                      placeholder="e.g. 30"
                      className="mt-2 w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {step === 2 ? (
        <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-white/90 sm:px-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:w-auto"
            >
              Back
            </button>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={submitting}
                className="w-full py-2 text-center text-sm font-semibold text-blue-600 underline decoration-blue-600/40 underline-offset-2 transition hover:text-blue-700 disabled:opacity-50 sm:w-auto sm:py-0"
              >
                {submitting ? "Saving…" : "Save and post later"}
              </button>
              <button
                type="button"
                onClick={handlePostNow}
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
              >
                {submitting ? "Posting…" : "Post now"}
              </button>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
};

export default PostJob;
