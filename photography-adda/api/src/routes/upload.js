import express from 'express';
import { getPresignUrl, createMultipartInfo } from '../services/s3.js';

const router = express.Router();

// Simple presign single object (PUT) - fast uploads for web
router.post('/presign', async (req, res) => {
  const { key, contentType } = req.body;
  if (!key) return res.status(400).json({ error: 'missing key' });
  try {
    const url = await getPresignUrl(key, contentType);
    return res.json({ url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'presign failed' });
  }
});

// Multipart create (returns uploadId and partUploadUrls)
router.post('/multipart/create', async (req, res) => {
  const { key } = req.body;
  if (!key) return res.status(400).json({ error: 'missing key' });
  try {
    const info = await createMultipartInfo(key);
    return res.json(info);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'multipart create failed' });
  }
});

export default router;
