const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/jobController');
const { protect, candidateOnly, companyOnly } = require('../middleware/auth');

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Post a new job (Company — Step 1 & 2 of Post Job screen)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJob'
 *     responses:
 *       201:
 *         description: Job posted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Job posted successfully }
 *                 data:    { $ref: '#/components/schemas/Job' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, companyOnly, createJob);

/**
 * @swagger
 * /jobs/draft:
 *   post:
 *     summary: Save a job as a draft
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJob'
 *     responses:
 *       201:
 *         description: Draft saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Draft saved }
 *                 data:    { $ref: '#/components/schemas/Job' }
 *       401:
 *         description: Unauthorized
 */
router.post('/draft', protect, companyOnly, saveDraft);

/**
 * @swagger
 * /jobs/my-posts:
 *   get:
 *     summary: Get all jobs posted by the logged-in company
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Draft, Active, Closed]
 *         description: Filter by job status
 *     responses:
 *       200:
 *         description: List of company's job postings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count:   { type: integer, example: 5 }
 *                 data:    { type: array, items: { $ref: '#/components/schemas/Job' } }
 *       401:
 *         description: Unauthorized
 */
router.get('/my-posts', protect, companyOnly, getMyJobs);

/**
 * @swagger
 * /jobs/explore:
 *   get:
 *     summary: Explore / search jobs — results matched to candidate career interests (Explore Jobs Screen)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search keyword (title, location, company)
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [Full Time, Part Time, Freelance / Project, Internship, Shift Based]
 *       - in: query
 *         name: workplace
 *         schema:
 *           type: string
 *           enum: [On-site, Remote, Hybrid]
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: postType
 *         schema:
 *           type: string
 *           enum: [Job, Internship]
 *       - in: query
 *         name: minSalary
 *         schema: { type: integer }
 *         description: Minimum salary filter (EGP)
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated job list with isApplied and isSaved flags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 total:   { type: integer, example: 120 }
 *                 page:    { type: integer, example: 1 }
 *                 pages:   { type: integer, example: 12 }
 *                 data:    { type: array, items: { $ref: '#/components/schemas/Job' } }
 *       401:
 *         description: Unauthorized
 */
router.get('/explore', protect, candidateOnly, exploreJobs);

/**
 * @swagger
 * /jobs/my-applications:
 *   get:
 *     summary: Get all jobs the candidate has applied to
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applied jobs with status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       job:       { $ref: '#/components/schemas/Job' }
 *                       appliedAt: { type: string, format: date-time }
 *                       status:
 *                         type: string
 *                         enum: [Applied, Under Review, Interview, Rejected, Accepted]
 *       401:
 *         description: Unauthorized
 */
router.get('/my-applications', protect, candidateOnly, getMyApplications);

router.get('/:id', protect, candidateOnly, getJobById);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update a job post
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJob'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:    { $ref: '#/components/schemas/Job' }
 *       403:
 *         description: Not authorized to update this job
 *       404:
 *         description: Job not found
 */
router.put('/:id', protect, companyOnly, updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete a job post
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Job not found
 */
router.delete('/:id', protect, companyOnly, deleteJob);

/**
 * @swagger
 * /jobs/{id}/apply:
 *   post:
 *     summary: Apply to a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Job ID to apply to
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Already applied or job is closed
 *       404:
 *         description: Job not found
 */
router.post('/:id/apply', protect, candidateOnly, applyToJob);

/**
 * @swagger
 * /jobs/{id}/applicants:
 *   get:
 *     summary: Get all applicants for a specific job (Company view)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Job ID
 *     responses:
 *       200:
 *         description: List of applicants with candidate profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count:   { type: integer, example: 24 }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       candidate: { type: object }
 *                       appliedAt: { type: string, format: date-time }
 *                       status:    { type: string, enum: [Applied, Under Review, Interview, Rejected, Accepted] }
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Job not found
 */
router.get('/:id/applicants', protect, companyOnly, getJobApplicants);

/**
 * @swagger
 * /jobs/{id}/applicants/{candidateId}:
 *   put:
 *     summary: Update an applicant's status (e.g. move to Interview)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Job ID
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema: { type: string }
 *         description: Candidate ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateApplicantStatus'
 *     responses:
 *       200:
 *         description: Applicant status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Invalid status value
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Job or applicant not found
 */
router.put('/:id/applicants/:candidateId', protect, companyOnly, updateApplicantStatus);

module.exports = router;
