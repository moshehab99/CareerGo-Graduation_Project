const express = require('express');
const router = express.Router();
const {
  registerCandidate,
  loginCandidate,
  getProfile,
  updateCareerInterests,
  uploadCV,
  getSavedJobs,
  removeSavedJob,
  toggleSaveJob,
  hideJob,
  extractCVInfo,
} = require('../controllers/candidateController');
const { protect, candidateOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * @swagger
 * /candidates/register:
 *   post:
 *     summary: Register a new candidate
 *     tags: [Candidates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterCandidate'
 *     responses:
 *       201:
 *         description: Candidate registered successfully
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
router.post('/register', registerCandidate);

/**
 * @swagger
 * /candidates/login:
 *   post:
 *     summary: Candidate login
 *     tags: [Candidates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCandidate'
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
router.post('/login', loginCandidate);

/**
 * @swagger
 * /candidates/me:
 *   get:
 *     summary: Get the logged-in candidate's full profile
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate profile with saved & applied jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:              { type: string }
 *                     fullName:         { type: string, example: Mohamed Ali }
 *                     email:            { type: string }
 *                     cv:               { type: object }
 *                     careerInterests:  { $ref: '#/components/schemas/CareerInterests' }
 *                     privacySettings:  { type: object }
 *                     savedJobs:        { type: array, items: { $ref: '#/components/schemas/Job' } }
 *                     appliedJobs:      { type: array }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', protect, candidateOnly, getProfile);

/**
 * @swagger
 * /candidates/career-interests:
 *   put:
 *     summary: Update career interests and privacy settings (Profile Setup Screen)
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CareerInterests'
 *     responses:
 *       200:
 *         description: Career interests updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/career-interests', protect, candidateOnly, updateCareerInterests);

/**
 * @swagger
 * /candidates/upload-cv:
 *   post:
 *     summary: Upload candidate CV (PDF, DOC, or DOCX — max 5MB)
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [cv]
 *             properties:
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: CV file (PDF, DOC, or DOCX — max 5MB)
 *     responses:
 *       200:
 *         description: CV uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:    { type: boolean, example: true }
 *                 message:    { type: string, example: CV uploaded successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:     { type: string }
 *                     originalName: { type: string }
 *                     path:         { type: string }
 *                     uploadedAt:   { type: string, format: date-time }
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/upload-cv', protect, candidateOnly, upload.single('cv'), uploadCV);

router.get('/saved-jobs', protect, candidateOnly, getSavedJobs);
router.delete('/saved-jobs/:jobId', protect, candidateOnly, removeSavedJob);
router.post('/extract-cv', protect, candidateOnly, upload.single('file'), extractCVInfo);

/**
 * @swagger
 * /candidates/saved-jobs/{jobId}:
 *   post:
 *     summary: Toggle save / unsave a job
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to save or unsave
 *     responses:
 *       200:
 *         description: Saved jobs list returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:   { type: boolean, example: true }
 *                 savedJobs: { type: array, items: { type: string } }
 *       401:
 *         description: Unauthorized
 */
router.post('/saved-jobs/:jobId', protect, candidateOnly, toggleSaveJob);

/**
 * @swagger
 * /candidates/hidden-jobs/{jobId}:
 *   post:
 *     summary: Hide a job from explore results
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to hide
 *     responses:
 *       200:
 *         description: Job hidden successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       401:
 *         description: Unauthorized
 */
router.post('/hidden-jobs/:jobId', protect, candidateOnly, hideJob);

module.exports = router;
