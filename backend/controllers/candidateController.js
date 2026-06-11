const jwt = require('jsonwebtoken');
const fs = require('fs');
const Candidate = require('../models/Candidate');
const { extractCvFromFile } = require('../services/aiService');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc    Register candidate
// @route   POST /api/candidates/register
// @access  Public
const registerCandidate = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const candidate = await Candidate.create({ fullName, email, password });

    const token = generateToken(candidate._id, 'candidate');

    res.status(201).json({
      success: true,
      message: 'Candidate registered successfully',
      token,
      data: {
        id: candidate._id,
        fullName: candidate.fullName,
        email: candidate.email,
        role: candidate.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login candidate
// @route   POST /api/candidates/login
// @access  Public
const loginCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const candidate = await Candidate.findOne({ email }).select('+password');
    if (!candidate || !(await candidate.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(candidate._id, 'candidate');

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: candidate._id,
        fullName: candidate.fullName,
        email: candidate.email,
        role: candidate.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get candidate profile
// @route   GET /api/candidates/me
// @access  Private (candidate)
const getProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.id)
      .populate({
        path: 'savedJobs',
        select: 'title location jobType workplace categories skills createdAt isFeatured',
        populate: { path: 'company', select: 'companyName logo' },
      })
      .populate({
        path: 'appliedJobs.job',
        select: 'title location jobType workplace categories skills createdAt',
        populate: { path: 'company', select: 'companyName logo' },
      });

    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update career interests & profile settings
// @route   PUT /api/candidates/career-interests
// @access  Private (candidate)
const updateCareerInterests = async (req, res) => {
  try {
    const {
      yearsOfExperience,
      careerLevel,
      jobTypes,
      workplaceSettings,
      targetJobTitles,
      jobCategories,
      minimumSalary,
      privacySettings,
    } = req.body;

    const candidate = await Candidate.findByIdAndUpdate(
      req.user.id,
      {
        careerInterests: {
          yearsOfExperience,
          careerLevel,
          jobTypes,
          workplaceSettings,
          targetJobTitles,
          jobCategories,
          minimumSalary,
        },
        privacySettings,
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Career interests updated', data: candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload CV
// @route   POST /api/candidates/upload-cv
// @access  Private (candidate)
const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.user.id,
      {
        cv: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          uploadedAt: new Date(),
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'CV uploaded successfully',
      data: candidate.cv,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get saved jobs
// @route   GET /api/candidates/saved-jobs
// @access  Private (candidate)
const getSavedJobs = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.id).populate({
      path: 'savedJobs',
      select:
        'title location jobType workplace categories skills description summary postType createdAt isFeatured status',
      populate: { path: 'company', select: 'companyName logo _id' },
    });

    res.json({ success: true, count: candidate.savedJobs.length, data: candidate.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save a job
// @route   POST /api/candidates/saved-jobs/:jobId/save
// @access  Private (candidate)
const saveJob = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.id);
    const jobId = req.params.jobId;
    const exists = candidate.savedJobs.some((id) => id.toString() === jobId);
    if (!exists) {
      candidate.savedJobs.push(jobId);
      await candidate.save();
    }
    res.json({ success: true, message: 'Job saved', saved: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove saved job
// @route   DELETE /api/candidates/saved-jobs/:jobId
// @access  Private (candidate)
const removeSavedJob = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.id);
    const jobId = req.params.jobId;
    candidate.savedJobs = candidate.savedJobs.filter((id) => id.toString() !== jobId);
    await candidate.save();
    res.json({ success: true, message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save / unsave a job (toggle)
// @route   POST /api/candidates/saved-jobs/:jobId
// @access  Private (candidate)
const toggleSaveJob = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.id);
    const jobId = req.params.jobId;

    const index = candidate.savedJobs.findIndex(
      (id) => id.toString() === jobId
    );
    if (index === -1) {
      candidate.savedJobs.push(jobId);
    } else {
      candidate.savedJobs.splice(index, 1);
    }

    await candidate.save();
    res.json({ success: true, savedJobs: candidate.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Hide a job
// @route   POST /api/candidates/hidden-jobs/:jobId
// @access  Private (candidate)
const hideJob = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.id);
    const jobId = req.params.jobId;

    const alreadyHidden = candidate.hiddenJobs.some(
      (id) => id.toString() === jobId
    );
    if (!alreadyHidden) {
      candidate.hiddenJobs.push(jobId);
      await candidate.save();
    }

    res.json({ success: true, message: 'Job hidden successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Extract CV info via AI and save to profile
// @route   POST /api/candidates/extract-cv
// @access  Private (candidate)
const extractCVInfo = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.id);

    let filePath;
    let originalName;

    if (req.file) {
      filePath = req.file.path;
      originalName = req.file.originalname;
    } else if (candidate?.cv?.path && fs.existsSync(candidate.cv.path)) {
      filePath = candidate.cv.path;
      originalName = candidate.cv.originalName;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload a CV first (PDF or DOCX)',
      });
    }

    console.log('[extractCVInfo] Node route POST /api/candidates/extract-cv', {
      userId: req.user.id,
      filePath,
      originalName,
      source: req.file ? 'multipart upload (field: file)' : 'saved CV on disk',
      contentType: req.headers['content-type'],
    });

    const extracted = await extractCvFromFile(filePath, originalName);
    console.log('[extractCVInfo] FastAPI extraction succeeded for:', originalName);

    const extractedProfile = {
      fullName: extracted.full_name,
      email: extracted.email,
      phone: extracted.phone,
      location: extracted.location,
      summary: extracted.summary,
      skills: extracted.skills || [],
      languages: extracted.languages || [],
      education: (extracted.education || []).map((e) => ({
        degree: e.degree,
        institution: e.institution,
        graduationYear: e.graduation_year,
      })),
      experience: (extracted.experience || []).map((e) => ({
        jobTitle: e.job_title,
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
      totalExperienceYears: extracted.total_experience_years || 0,
      extractedAt: new Date(),
    };

    const updated = await Candidate.findByIdAndUpdate(
      req.user.id,
      {
        fullName: extracted.full_name || candidate.fullName,
        email: candidate.email,
        phone: extracted.phone,
        location: extracted.location,
        extractedProfile,
        'careerInterests.targetJobTitles': extracted.skills?.slice(0, 10) || [],
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'CV information extracted and saved to your profile',
      data: updated,
    });
  } catch (error) {
    console.error('[extractCVInfo] failed:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerCandidate,
  loginCandidate,
  getProfile,
  updateCareerInterests,
  uploadCV,
  getSavedJobs,
  saveJob,
  removeSavedJob,
  toggleSaveJob,
  hideJob,
  extractCVInfo,
};
