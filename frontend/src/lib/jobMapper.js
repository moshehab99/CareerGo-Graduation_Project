export function formatPostedAt(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function mapJobFromApi(job) {
  const company = typeof job.company === "object" ? job.company : null;
  const id = job._id || job.id;

  const companyId =
    company?._id || (typeof job.company === "string" ? job.company : null);

  return {
    id,
    _id: id,
    title: job.title,
    company: company?.companyName || "Company",
    companyId,
    description: job.description || job.summary || "",
    postType: job.postType,
    location: job.location,
    tags: [job.jobType, job.workplace].filter(Boolean),
    category: Array.isArray(job.categories) ? job.categories[0] : job.category,
    experienceLevel: "",
    skills: job.skills || [],
    postedAt: formatPostedAt(job.createdAt),
    logo:
      company?.logo ||
      company?.companyName?.slice(0, 2)?.toUpperCase() ||
      "CO",
    type: job.jobType,
    isFeatured: Boolean(job.isFeatured),
    isSaved: Boolean(job.isSaved),
    isApplied: Boolean(job.isApplied),
    status: job.applicationStatus || job.status,
  };
}

const EXPERIENCE_MAP = {
  "No experience": "0-1 years",
  "Less than 1 year": "0-1 years",
  "1–2 years": "1-2 years",
  "3–5 years": "2-5 years",
  "6–10 years": "5-10 years",
  "10+ years": "10+ years",
};

const CAREER_LEVEL_MAP = {
  Student: "Student",
  "Entry Level": "Entry Level",
  "Experienced (Non-Manager)": "Mid-Level",
  Manager: "Manager",
  "Senior Management": "Director",
};

export function mapInterestsToApi(form) {
  const body = {
    jobTypes: form.jobTypes,
    workplaceSettings: form.workplaceSettings,
    targetJobTitles: form.jobTitles || [],
    jobCategories: form.jobCategory ? [form.jobCategory] : [],
    minimumSalary: {
      amount: Number(form.minSalary) || 0,
      currency: "EGP",
    },
    privacySettings: {
      hideSalary: form.hideSalary,
      allowCompaniesToFind: form.allowCompanies,
      makeProfilePublic: form.publicProfile,
    },
  };

  const years = EXPERIENCE_MAP[form.yearsOfExperience];
  if (years) body.yearsOfExperience = years;

  const level =
    CAREER_LEVEL_MAP[form.careerLevel] ||
    (form.careerLevel && form.careerLevel !== "Not specified"
      ? form.careerLevel
      : undefined);
  if (level) body.careerLevel = level;

  return body;
}

function normalizePostType(value) {
  if (!value) return "Job";
  const v = String(value).toLowerCase();
  if (v === "internship") return "Internship";
  return "Job";
}

export function mapJobPayloadToApi(payload, status = "Active") {
  return {
    postType: normalizePostType(payload.postType),
    title: payload.jobTitle,
    categories: payload.jobCategories,
    skills: payload.mainSkills,
    jobType: payload.jobType,
    workplace: payload.workplace,
    location: payload.location,
    salaryRange: {
      min: Number(payload.salaryMin) || undefined,
      max: Number(payload.salaryMax) || undefined,
      currency: "EGP",
    },
    description: payload.aiBrief,
    summary: payload.aiBrief,
    applicationForm: {
      requireCoverLetter: payload.requireCoverLetter,
      applicationNotes: payload.applicationNotes,
      screeningQuestions: payload.screeningQuestions,
      companyConfidential: payload.companyConfidential,
      emailNotifications: payload.emailNotifications,
      notificationFrequency: payload.notificationFrequency,
      notificationEmail: payload.notificationEmail,
      advancedExternalUrl: payload.advancedExternalUrl,
      advancedAutoCloseDays: payload.advancedAutoCloseDays,
    },
    status,
  };
}
