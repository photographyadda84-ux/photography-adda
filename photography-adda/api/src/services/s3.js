import { S3Client, PutObjectCommand, CreateMultipartUploadCommand, ListPartsCommand, CompleteMultipartUploadCommand, UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION || 'ap-south-1';
const BUCKET = process.env.UPLOAD_BUCKET || 'photos-upload-dev';
const s3 = new S3Client({ region: REGION });

export async function getPresignUrl(key, contentType='image/jpeg') {
  const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType, ACL: 'private' });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 900 });
  return url;
}

export async function createMultipartInfo(key) {
  const create = new CreateMultipartUploadCommand({ Bucket: BUCKET, Key: key, ContentType: 'image/jpeg' });
  const resp = await s3.send(create);
  const uploadId = resp.UploadId;
  // return minimal info - client will request presigned URLs for parts via /multipart/part
  return { uploadId, bucket: BUCKET, key };
}

export async function getPartPresign(key, uploadId, partNumber) {
  const cmd = new UploadPartCommand({ Bucket: BUCKET, Key: key, UploadId: uploadId, PartNumber: partNumber });
  return await getSignedUrl(s3, cmd, { expiresIn: 900 });
}

export async function completeMultipart(key, uploadId, parts) {
  const cmd = new CompleteMultipartUploadCommand({ Bucket: BUCKET, Key: key, UploadId: uploadId, MultipartUpload: { Parts: parts } });
  return await s3.send(cmd);
}
