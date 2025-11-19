// Simple watcher that finds new files in a folder and calls presign+upload flow (placeholder)
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { uploadFilePresign } from './helpers/uploader.js';

const WATCH_DIR = process.env.WATCH_DIR || './to_upload';
const API_URL = process.env.API_URL || 'http://localhost:3000';

async function processFile(file){
  const key = `uploads/${path.basename(file)}`;
  const resp = await fetch(API_URL+'/upload/presign', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ key }) });
  const data = await resp.json();
  await uploadFilePresign(data.url, file);
  console.log('Uploaded', file);
}

setInterval(()=>{
  const files = fs.readdirSync(WATCH_DIR).filter(f=>f.match(/\.(jpg|jpeg|png)$/i));
  files.forEach(f=>{
    try{ processFile(path.join(WATCH_DIR,f)); }catch(e){ console.error(e); }
  });
}, 5000);
