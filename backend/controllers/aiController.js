const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const { matchCandidateToJob } = require('../services/aiService');

function buildCandidateForMatch(candidate) {
  const extracted = candidate.extractedProfile || {};

  if (extracted.skills?.length) {
    return {
      full_name: extracted.fullName || candidate.fullName,
      email: extracted.email || candidate.email,
      phone: extracted.phone || candidate.phone || '',
      location: extracted.location || candidate.location || '',
      summary: extracted.summary || '',
      skills: extracted.skills || [],
      languages: extracted.languages || [],
      education: (extracted.education || []).map((e) => ({
        degree: e.degree,
        institution: e.institution,
        graduation_year: e.graduationYear || e.graduation_year,
      })),
      experience: (extracted.experience || []).map((e) => ({
        job_title: e.jobTitle || e.job_title,
        company: e.company,
        duration: e.duration,
        description: e.description,
      })),
      projects: (extracted.projects || []).map((p) => ({
        name: p.name,
        description: p.description,
        technologies: p.technologies || [],
      })),
      certifications: (extracted.certifications || []).map((c) => ({
        name: c.name,
        issuer: c.issuer,
        date: c.date,
      })),
      total_experience_years: extracted.totalExperienceYears || 0,
    };
  }

  return {
    full_name: candidate.fullName,
    email: candidate.email,
    phone: candidate.phone || '',
    location: candidate.location || '',
    summary: '',
    skills: candidate.careerInterests?.targetJobTitles || [],
    languages: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    total_experience_years: 0,
  };
}

// @desc    AI job match
// @route   POST /api/ai/match
// @access  Private (candidate)
const matchJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'jobId is required' });
    }

    const candidate = await Candidate.findById(req.user.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const job = await Job.findById(jobId).populate('company', 'companyName');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const candidatePayload = buildCandidateForMatch(candidate);
    const jobPayload = {
      title: job.title,
      description: job.description || job.summary || '',
      required_skills: job.skills || [],
      required_experience_years: 0,
      preferred_certifications: [],
      required_languages: [],
    };

    const result = await matchCandidateToJob(candidatePayload, jobPayload);

    res.json({
      success: true,
      data: {
        matchScore: result.match_score,
        recommendation: result.recommendation,
        matchedSkills: result.matched_skills,
        missingSkills: result.missing_skills,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        recommendations: [
          ...(result.strengths || []),
          ...(result.weaknesses || []).map((w) => `Improve: ${w}`),
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { matchJob };
