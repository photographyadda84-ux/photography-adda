import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const REGION = process.env.AWS_REGION || 'ap-south-1';
const BUCKET = process.env.UPLOAD_BUCKET || 'photos-upload-dev';

const s3 = new S3Client({ region: REGION });

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/presign', async (req, res) => {
  try {
    const { key, contentType='image/jpeg' } = req.body;
    if(!key) return res.status(400).json({ error: 'missing key' });
    const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType, ACL: 'private' });
    const url = await getSignedUrl(s3, cmd, { expiresIn: 900 });
    return res.json({ url, fields: {} });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'presign failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API listening on', PORT));
