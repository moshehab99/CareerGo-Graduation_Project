const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const AI_BASE = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Send a CV file to the FastAPI service for structured extraction.
 * Uses a buffer (not a stream) so multipart boundaries are built correctly for Node fetch.
 */
async function extractCvFromFile(filePath, originalName) {
  const filename = originalName || path.basename(filePath);
  const url = `${AI_BASE}/cv/extract-cv`;
  const fileBuffer = fs.readFileSync(filePath);

  const form = new FormData();
  form.append('file', fileBuffer, {
    filename,
    contentType: 'application/octet-stream',
  });

  const headers = form.getHeaders();
  const body = form.getBuffer();

  console.log('[AI] request URL:', url);
  console.log('[AI] request headers:', headers);
  console.log('[AI] uploaded file:', filename, 'bytes:', body.length);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Length': String(body.length),
    },
    body,
  });

  const data = await res.json().catch(() => ({}));
  console.log('[AI] FastAPI response status:', res.status);
  console.log('[AI] FastAPI response body:', data);

  if (!res.ok) {
    console.error('[AI] /cv/extract-cv failed:', res.status, data);
    const detail = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg || d).join(', ')
      : data.detail;
    throw new Error(detail || data.message || 'AI CV extraction failed');
  }
  return data;
}

/**
 * Match candidate profile against a job via FastAPI.
 */
async function matchCandidateToJob(candidateProfile, jobDescription) {
  const res = await fetch(`${AI_BASE}/match/job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      candidate: candidateProfile,
      job: jobDescription,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg || d).join(', ')
      : data.detail;
    throw new Error(detail || data.message || 'AI matching failed');
  }
  return data;
}

module.exports = { extractCvFromFile, matchCandidateToJob, AI_BASE };
