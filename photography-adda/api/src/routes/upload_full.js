import express from 'express';
import { getPresignUrl, createMultipartInfo, getPartPresign, completeMultipart } from '../services/s3.js';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();

router.post('/presign', async (req,res)=>{
  const { key, contentType } = req.body;
  if(!key) return res.status(400).json({ error: 'missing key' });
  const url = await getPresignUrl(key, contentType);
  res.json({ url });
});

router.post('/multipart/create', async (req,res)=>{
  const { key } = req.body;
  if(!key) return res.status(400).json({ error: 'missing key' });
  const info = await createMultipartInfo(key);
  res.json(info);
});

router.get('/multipart/part', async (req,res)=>{
  const { key, uploadId, partNumber } = req.query;
  if(!key||!uploadId||!partNumber) return res.status(400).json({ error: 'missing params' });
  const url = await getPartPresign(key, uploadId, parseInt(partNumber));
  res.json({ url });
});

router.post('/multipart/complete', async (req,res)=>{
  const { key, uploadId, parts } = req.body;
  if(!key||!uploadId||!parts) return res.status(400).json({ error: 'missing params' });
  const resp = await completeMultipart(key, uploadId, parts);
  res.json({ ok: true, resp });
});

// pairing
router.post('/pair/request', async (req,res)=>{
  // create temporary pairing token in DB (placeholder) - return token + qr payload
  const token = uuidv4();
  // in prod store token -> device record with TTL
  res.json({ token, qr: `app://pair?token=${token}` });
});

router.post('/pair/confirm', async (req,res)=>{
  const { token, deviceId } = req.body;
  // validate token and register deviceId (placeholder)
  res.json({ ok:true, deviceId });
});

export default router;
