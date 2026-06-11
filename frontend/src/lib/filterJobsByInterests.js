/**
 * Filters mock jobs using saved career interests (OR across dimensions).
 * If interests are missing or empty, returns the original list order.
 * @param {Array<object>} jobs
 * @param {object|null} interests
 */
export function filterJobsByInterests(jobs, interests) {
  if (!Array.isArray(jobs) || !jobs.length) return jobs;
  if (!interests || typeof interests !== "object") return jobs;

  const jobTitles = Array.isArray(interests.jobTitles) ? interests.jobTitles : [];
  const jobTypes = Array.isArray(interests.jobTypes) ? interests.jobTypes : [];
  const workplaceSettings = Array.isArray(interests.workplaceSettings)
    ? interests.workplaceSettings
    : [];
  const jobCategory =
    typeof interests.jobCategory === "string" ? interests.jobCategory : "";

  const hasSignal =
    jobTitles.some(Boolean) ||
    jobTypes.some(Boolean) ||
    workplaceSettings.some(Boolean) ||
    (jobCategory && jobCategory !== "Other");

  if (!hasSignal) return jobs;

  return jobs.filter((job) => {
    const checks = [];

    if (jobTitles.some(Boolean)) {
      const t = (job.title || "").toLowerCase();
      checks.push(
        jobTitles.some(
          (jt) =>
            jt &&
            (t.includes(String(jt).toLowerCase()) ||
              String(jt).toLowerCase().split(/\s+/).some((w) => w.length > 2 && t.includes(w)))
        )
      );
    }

    if (jobTypes.some(Boolean)) {
      checks.push(jobTypes.some((jt) => (job.tags || []).includes(jt)));
    }

    if (workplaceSettings.some(Boolean)) {
      checks.push(
        workplaceSettings.some(
          (w) =>
            (job.tags || []).includes(w) ||
            (job.location && job.location.includes(w))
        )
      );
    }

    if (jobCategory && jobCategory !== "Other" && job.category) {
      checks.push(job.category === jobCategory);
    }

    if (checks.length === 0) return true;
    return checks.some(Boolean);
  });
}
