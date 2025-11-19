// Simple Node uploader using presigned URL for PUT uploads
import fs from 'fs';
import fetch from 'node-fetch';

export async function uploadFilePresign(presignUrl, filePath){
  const data = fs.readFileSync(filePath);
  const res = await fetch(presignUrl, { method: 'PUT', body: data, headers: { 'Content-Type':'image/jpeg' }});
  if(!res.ok) throw new Error('upload failed '+res.status);
  return true;
}
