const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      default: 'candidate',
    },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    cv: {
      filename: String,
      originalName: String,
      path: String,
      uploadedAt: Date,
    },
    extractedProfile: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      summary: String,
      skills: [String],
      languages: [String],
      education: [
        {
          degree: String,
          institution: String,
          graduationYear: String,
        },
      ],
      experience: [
        {
          jobTitle: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          date: String,
        },
      ],
      totalExperienceYears: Number,
      extractedAt: Date,
    },
    careerInterests: {
      yearsOfExperience: {
        type: String,
        enum: ['0-1 years', '1-2 years', '2-5 years', '5-10 years', '10+ years'],
      },
      careerLevel: {
        type: String,
        enum: ['Student', 'Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director', 'C-Level'],
      },
      jobTypes: [
        {
          type: String,
          enum: ['Full Time', 'Part Time', 'Freelance / Project', 'Internship', 'Shift Based', 'Volunteering', 'Student Activity'],
        },
      ],
      workplaceSettings: [
        {
          type: String,
          enum: ['On-site', 'Remote', 'Hybrid'],
        },
      ],
      targetJobTitles: [{ type: String }],
      jobCategories: [{ type: String }],
      minimumSalary: {
        amount: { type: Number },
        currency: { type: String, default: 'EGP' },
      },
    },
    privacySettings: {
      hideSalary: { type: Boolean, default: false },
      allowCompaniesToFind: { type: Boolean, default: true },
      makeProfilePublic: { type: Boolean, default: true },
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    hiddenJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    appliedJobs: [
      {
        job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Accepted'],
          default: 'Applied',
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
candidateSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
candidateSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Candidate', candidateSchema);
