const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wuzzuf Jobs API',
      version: '1.0.0',
      description:
        'REST API for the Wuzzuf Jobs platform — supporting candidates (job seekers) and companies (employers). Built with Node.js, Express, and MongoDB.',
      contact: {
        name: 'Wuzzuf Backend Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token. Obtain it from /candidates/login or /companies/login.',
        },
      },
      schemas: {
        // ─── AUTH ───────────────────────────────────────────────────
        RegisterCandidate: {
          type: 'object',
          required: ['fullName', 'email', 'password', 'confirmPassword'],
          properties: {
            fullName:        { type: 'string', example: 'Mohamed Ali' },
            email:           { type: 'string', format: 'email', example: 'mo@example.com' },
            password:        { type: 'string', format: 'password', example: '123456', minLength: 6 },
            confirmPassword: { type: 'string', format: 'password', example: '123456' },
          },
        },
        LoginCandidate: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'mo@example.com' },
            password: { type: 'string', format: 'password', example: '123456' },
          },
        },
        RegisterCompany: {
          type: 'object',
          required: ['companyName', 'email', 'password', 'confirmPassword'],
          properties: {
            companyName:     { type: 'string', example: 'Tech Corp' },
            email:           { type: 'string', format: 'email', example: 'hr@techcorp.com' },
            password:        { type: 'string', format: 'password', example: '123456', minLength: 6 },
            confirmPassword: { type: 'string', format: 'password', example: '123456' },
          },
        },
        LoginCompany: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'hr@techcorp.com' },
            password: { type: 'string', format: 'password', example: '123456' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            token:   { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            data: {
              type: 'object',
              properties: {
                id:          { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
                fullName:    { type: 'string', example: 'Mohamed Ali' },
                email:       { type: 'string', example: 'mo@example.com' },
                role:        { type: 'string', example: 'candidate' },
              },
            },
          },
        },

        // ─── CAREER INTERESTS ────────────────────────────────────────
        CareerInterests: {
          type: 'object',
          properties: {
            yearsOfExperience: {
              type: 'string',
              enum: ['0-1 years', '1-2 years', '2-5 years', '5-10 years', '10+ years'],
              example: '1-2 years',
            },
            careerLevel: {
              type: 'string',
              enum: ['Student', 'Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director', 'C-Level'],
              example: 'Junior',
            },
            jobTypes: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['Full Time', 'Part Time', 'Freelance / Project', 'Internship', 'Shift Based', 'Volunteering', 'Student Activity'],
              },
              example: ['Full Time', 'Part Time'],
            },
            workplaceSettings: {
              type: 'array',
              items: { type: 'string', enum: ['On-site', 'Remote', 'Hybrid'] },
              example: ['Hybrid', 'Remote'],
            },
            targetJobTitles: {
              type: 'array',
              items: { type: 'string' },
              example: ['Frontend Developer', 'React Developer'],
            },
            jobCategories: {
              type: 'array',
              items: { type: 'string' },
              example: ['IT / Software Development'],
            },
            minimumSalary: {
              type: 'object',
              properties: {
                amount:   { type: 'number', example: 15000 },
                currency: { type: 'string', example: 'EGP' },
              },
            },
            privacySettings: {
              type: 'object',
              properties: {
                hideSalary:             { type: 'boolean', example: false },
                allowCompaniesToFind:   { type: 'boolean', example: true },
                makeProfilePublic:      { type: 'boolean', example: true },
              },
            },
          },
        },

        // ─── JOB ─────────────────────────────────────────────────────
        CreateJob: {
          type: 'object',
          required: ['title', 'categories', 'skills', 'jobType', 'workplace', 'location'],
          properties: {
            postType:    { type: 'string', enum: ['Job', 'Internship'], example: 'Job' },
            title:       { type: 'string', example: 'Frontend Developer' },
            categories:  { type: 'array', items: { type: 'string' }, example: ['IT / Software Development'] },
            skills:      { type: 'array', items: { type: 'string' }, example: ['React', 'JavaScript', 'Tailwind CSS'] },
            jobType: {
              type: 'string',
              enum: ['Full Time', 'Part Time', 'Freelance / Project', 'Internship', 'Shift Based'],
              example: 'Full Time',
            },
            workplace:   { type: 'string', enum: ['On-site', 'Remote', 'Hybrid'], example: 'Hybrid' },
            location:    { type: 'string', example: 'Cairo, Egypt' },
            salaryRange: {
              type: 'object',
              properties: {
                min:      { type: 'number', example: 15000 },
                max:      { type: 'number', example: 25000 },
                currency: { type: 'string', example: 'EGP' },
              },
            },
            description: { type: 'string', example: 'We are looking for a skilled Frontend Developer...' },
            summary:     { type: 'string', example: 'Join our team and build amazing products.' },
            status:      { type: 'string', enum: ['Draft', 'Active', 'Closed'], example: 'Active' },
          },
        },
        Job: {
          type: 'object',
          properties: {
            _id:         { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
            company:     { type: 'object', properties: { companyName: { type: 'string' }, logo: { type: 'string' } } },
            postType:    { type: 'string', example: 'Job' },
            title:       { type: 'string', example: 'Frontend Developer' },
            categories:  { type: 'array', items: { type: 'string' } },
            skills:      { type: 'array', items: { type: 'string' } },
            jobType:     { type: 'string', example: 'Full Time' },
            workplace:   { type: 'string', example: 'Hybrid' },
            location:    { type: 'string', example: 'Cairo, Egypt' },
            salaryRange: { type: 'object', properties: { min: { type: 'number' }, max: { type: 'number' }, currency: { type: 'string' } } },
            status:      { type: 'string', example: 'Active' },
            isFeatured:  { type: 'boolean', example: false },
            isApplied:   { type: 'boolean', example: false, description: 'Returned only in explore results' },
            isSaved:     { type: 'boolean', example: false, description: 'Returned only in explore results' },
            createdAt:   { type: 'string', format: 'date-time' },
          },
        },

        // ─── APPLICANT STATUS ────────────────────────────────────────
        UpdateApplicantStatus: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Accepted'],
              example: 'Interview',
            },
          },
        },

        // ─── GENERIC ─────────────────────────────────────────────────
        SuccessMessage: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description' },
          },
        },
      },
    },
    tags: [
      { name: 'Candidates', description: 'Candidate registration, login, profile & CV' },
      { name: 'Companies',  description: 'Company registration, login & dashboard' },
      { name: 'Jobs',       description: 'Job posting, exploration & applications' },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
