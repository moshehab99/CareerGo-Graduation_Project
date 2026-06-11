const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    postType: {
      type: String,
      enum: ['Job', 'Internship'],
      required: [true, 'Post type is required'],
      default: 'Job',
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    categories: [
      {
        type: String,
        required: true,
      },
    ],
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    jobType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Freelance / Project', 'Internship', 'Shift Based'],
      required: [true, 'Job type is required'],
    },
    workplace: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      required: [true, 'Workplace setting is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'EGP' },
    },
    description: {
      type: String,
    },
    summary: {
      type: String,
    },
    applicationForm: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Closed'],
      default: 'Active',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    applicants: [
      {
        candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
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

// Text index for search
jobSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
