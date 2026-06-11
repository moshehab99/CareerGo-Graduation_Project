const express = require('express');
const router = express.Router();
const {
  registerCompany,
  loginCompany,
  getDashboard,
  searchCandidates,
  getCompanyProfile,
} = require('../controllers/companyController');
const { protect, companyOnly } = require('../middleware/auth');

/**
 * @swagger
 * /companies/register:
 *   post:
 *     summary: Register a new company account
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterCompany'
 *     responses:
 *       201:
 *         description: Company registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', registerCompany);

/**
 * @swagger
 * /companies/login:
 *   post:
 *     summary: Company login
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCompany'
 *     responses:
 *       200:
 *         description: Login successful — returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', loginCompany);

/**
 * @swagger
 * /companies/dashboard:
 *   get:
 *     summary: Get company dashboard — job stats and recent postings
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalJobs:       { type: integer, example: 12 }
 *                     activeJobs:      { type: integer, example: 8 }
 *                     totalApplicants: { type: integer, example: 145 }
 *                     jobs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:        { type: string }
 *                           title:      { type: string }
 *                           status:     { type: string }
 *                           applicants: { type: array }
 *                           createdAt:  { type: string, format: date-time }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/dashboard', protect, companyOnly, getDashboard);

/**
 * @swagger
 * /companies/candidates:
 *   get:
 *     summary: Search and browse candidates (Company Candidates Screen)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search by name or job title
 *       - in: query
 *         name: careerLevel
 *         schema:
 *           type: string
 *           enum: [Student, Entry Level, Junior, Mid-Level, Senior, Lead, Manager, Director, C-Level]
 *         description: Filter by career level
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [Full Time, Part Time, Freelance / Project, Internship, Shift Based]
 *         description: Filter by desired job type
 *       - in: query
 *         name: workplace
 *         schema:
 *           type: string
 *           enum: [On-site, Remote, Hybrid]
 *         description: Filter by workplace preference
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by job category
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated list of candidates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 total:   { type: integer, example: 50 }
 *                 page:    { type: integer, example: 1 }
 *                 pages:   { type: integer, example: 5 }
 *                 data:    { type: array, items: { type: object } }
 *       401:
 *         description: Unauthorized
 */
router.get('/candidates', protect, companyOnly, searchCandidates);

router.get('/:id', getCompanyProfile);

module.exports = router;
