const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const Candidate = require("../models/Candidate");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register company
// @route   POST /api/companies/register
// @access  Public
const registerCompany = async (req, res) => {
  try {
    const { companyName, email, password, confirmPassword } = req.body;

    if (!companyName || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const existing = await Company.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const company = await Company.create({ companyName, email, password });

    const token = generateToken(company._id, "company");

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      token,
      data: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        role: company.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login company
// @route   POST /api/companies/login
// @access  Public
const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const company = await Company.findOne({ email }).select("+password");
    if (!company || !(await company.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(company._id, "company");

    res.json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: company._id,
        companyName: company.companyName,
        email: company.email,
        role: company.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get company dashboard info
// @route   GET /api/companies/dashboard
// @access  Private (company)
const getDashboard = async (req, res) => {
  try {
    const Job = require("../models/Job");

    const jobs = await Job.find({ company: req.user.id }).select(
      "title status applicants createdAt",
    );

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === "Active").length;
    const totalApplicants = jobs.reduce(
      (sum, j) => sum + j.applicants.length,
      0,
    );

    res.json({
      success: true,
      data: {
        totalJobs,
        activeJobs,
        totalApplicants,
        jobs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search candidates
// @route   GET /api/companies/candidates
// @access  Private (company)
const searchCandidates = async (req, res) => {
  try {
    const {
      q,
      careerLevel,
      jobType,
      workplace,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { "privacySettings.allowCompaniesToFind": true };

    if (careerLevel) filter["careerInterests.careerLevel"] = careerLevel;
    if (jobType) filter["careerInterests.jobTypes"] = jobType;
    if (workplace) filter["careerInterests.workplaceSettings"] = workplace;
    if (category) filter["careerInterests.jobCategories"] = category;

    let query = Candidate.find(filter).select(
      "fullName careerInterests.careerLevel careerInterests.targetJobTitles careerInterests.jobCategories cv.uploadedAt",
    );

    if (q) {
      query = Candidate.find({
        ...filter,
        $or: [
          { fullName: { $regex: q, $options: "i" } },
          { "careerInterests.targetJobTitles": { $regex: q, $options: "i" } },
        ],
      });
    }

    const total = await Candidate.countDocuments(filter);
    const candidates = await query
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public company profile with jobs
// @route   GET /api/companies/:id
// @access  Public
const getCompanyProfile = async (req, res) => {
  try {
    const Job = require("../models/Job");
    const company = await Company.findById(req.params.id).select(
      "-password"
    );

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    const jobs = await Job.find({
      company: company._id,
      status: "Active",
    })
      .select(
        "title location jobType workplace categories skills postType createdAt salaryRange"
      )
      .sort({ createdAt: -1 });

    const openPositions = jobs.length;

    res.json({
      success: true,
      data: {
        company,
        jobs,
        openPositions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerCompany,
  loginCompany,
  getDashboard,
  searchCandidates,
  getCompanyProfile,
};
