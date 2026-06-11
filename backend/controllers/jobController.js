const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

// @desc    Create a new job post (Step 1 & 2)
// @route   POST /api/jobs
// @access  Private (company)
const createJob = async (req, res) => {
  try {
    const {
      postType,
      title,
      categories,
      skills,
      jobType,
      workplace,
      location,
      salaryRange,
      description,
      summary,
      applicationForm,
      status,
    } = req.body;

    const job = await Job.create({
      company: req.user.id,
      postType,
      title,
      categories,
      skills,
      jobType,
      workplace,
      location,
      salaryRange,
      description,
      summary,
      applicationForm,
      status: status || 'Active',
    });

    await job.populate('company', 'companyName logo');

    res.status(201).json({ success: true, message: 'Job posted successfully', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save job draft
// @route   POST /api/jobs/draft
// @access  Private (company)
const saveDraft = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, company: req.user.id, status: 'Draft' });
    res.status(201).json({ success: true, message: 'Draft saved', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs posted by the logged-in company
// @route   GET /api/jobs/my-posts
// @access  Private (company)
const getMyJobs = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { company: req.user.id };
    if (status) filter.status = status;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a job post
// @route   PUT /api/jobs/:id
// @access  Private (company)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job post
// @route   DELETE /api/jobs/:id
// @access  Private (company)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const jobId = job._id;

    await Candidate.updateMany(
      {},
      {
        $pull: {
          savedJobs: jobId,
          hiddenJobs: jobId,
          appliedJobs: { job: jobId },
        },
      }
    );

    await job.deleteOne();

    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Private (candidate)
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'company',
      'companyName logo industry website description location companySize foundedYear email'
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const candidate = await Candidate.findById(req.user.id);
    const jobId = job._id.toString();
    const applied = candidate?.appliedJobs?.find((a) => a.job?.toString() === jobId);
    const enriched = {
      ...job.toObject(),
      isSaved: candidate?.savedJobs?.some((id) => id.toString() === jobId) || false,
      isApplied: Boolean(applied),
      applicationStatus: applied?.status,
    };

    res.json({ success: true, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Explore / search jobs (for candidates) — filtered by career interests
// @route   GET /api/jobs/explore
// @access  Private (candidate)
const exploreJobs = async (req, res) => {
  try {
    const {
      q,
      jobType,
      workplace,
      category,
      minSalary,
      postType,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { status: 'Active' };

    // Get candidate's career interests for smart matching
    const candidate = await Candidate.findById(req.user.id);
    const interests = candidate?.careerInterests || {};

    // Apply hidden jobs filter
    if (candidate?.hiddenJobs?.length > 0) {
      filter._id = { $nin: candidate.hiddenJobs };
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { 'company.companyName': { $regex: q, $options: 'i' } },
      ];
    }

    if (jobType) filter.jobType = jobType;
    else if (interests.jobTypes?.length) filter.jobType = { $in: interests.jobTypes };

    if (workplace) filter.workplace = workplace;
    else if (interests.workplaceSettings?.length) filter.workplace = { $in: interests.workplaceSettings };

    if (category) filter.categories = category;
    else if (interests.jobCategories?.length) filter.categories = { $in: interests.jobCategories };

    if (postType) filter.postType = postType;
    if (minSalary) filter['salaryRange.min'] = { $gte: Number(minSalary) };

    const total = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .populate('company', 'companyName logo _id')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Mark applied and saved jobs
    const appliedJobIds = candidate?.appliedJobs?.map((a) => a.job.toString()) || [];
    const savedJobIds = candidate?.savedJobs?.map((id) => id.toString()) || [];

    const enriched = jobs.map((job) => ({
      ...job.toObject(),
      isApplied: appliedJobIds.includes(job._id.toString()),
      isSaved: savedJobIds.includes(job._id.toString()),
    }));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private (candidate)
const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.find(
      (a) => a.candidate.toString() === req.user.id
    );
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    // Add to job applicants
    job.applicants.push({ candidate: req.user.id });
    await job.save();

    // Add to candidate's applied jobs
    await Candidate.findByIdAndUpdate(req.user.id, {
      $push: { appliedJobs: { job: job._id } },
    });

    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applicants for a specific job (company view)
// @route   GET /api/jobs/:id/applicants
// @access  Private (company)
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'applicants.candidate',
      'fullName email careerInterests cv'
    );

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, count: job.applicants.length, data: job.applicants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update applicant status
// @route   PUT /api/jobs/:id/applicants/:candidateId
// @access  Private (company)
const updateApplicantStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Interview', 'Rejected', 'Accepted'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.company.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applicant = job.applicants.find(
      (a) => a.candidate.toString() === req.params.candidateId
    );
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    applicant.status = status;
    await job.save();

    // Sync status on candidate side
    await Candidate.updateOne(
      { _id: req.params.candidateId, 'appliedJobs.job': req.params.id },
      { $set: { 'appliedJobs.$.status': status } }
    );

    res.json({ success: true, message: 'Applicant status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get candidate's applications
// @route   GET /api/jobs/my-applications
// @access  Private (candidate)
const getMyApplications = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.user.id).populate({
      path: 'appliedJobs.job',
      select: 'title location jobType workplace categories skills createdAt status',
      populate: { path: 'company', select: 'companyName logo' },
    });

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    res.json({ success: true, data: candidate.appliedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createJob,
  saveDraft,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobById,
  exploreJobs,
  applyToJob,
  getJobApplicants,
  updateApplicantStatus,
  getMyApplications,
};
