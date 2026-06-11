/**
 * Placeholder “AI” copy — swap for a real model API later.
 * @param {string} jobTitle
 * @returns {string}
 */
export function mockAiJobDescription(jobTitle) {
  const title = (jobTitle || "this role").trim() || "this role";

  return [
    `About the ${title} opportunity`,
    "",
    `We are hiring a ${title} to help us ship reliable product experiences for customers across the region. You will collaborate with product, design, and peers in engineering to plan, build, and measure outcomes.`,
    "",
    "What you will do:",
    "• Own meaningful slices of the roadmap end-to-end.",
    "• Participate in code reviews, design discussions, and incident response.",
    "• Improve quality through testing, observability, and pragmatic refactors.",
    "",
    "What we look for:",
    "• Strong communication and ownership.",
    "• Hands-on experience relevant to the role title and stack.",
    "• Comfort working in a fast-paced, feedback-driven environment.",
    "",
    "This description was generated as a demo preview from the job title you provided.",
  ].join("\n");
}
