import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(bodyParser.json());

// simple layout composer: groups images into spreads (2 pages per spread)
function composeSpreads(images){
  const spreads = [];
  for(let i=0;i<images.length;i+=2){
    spreads.push({left: images[i], right: images[i+1] || null});
  }
  return spreads;
}

app.post('/generate', (req,res)=>{
  const { albumName, images } = req.body;
  if(!images || !images.length) return res.status(400).json({ error: 'no images' });
  const jobId = 'album-'+uuidv4();
  const spreads = composeSpreads(images);
  // placeholder: in production render spreads into PDF using headless chrome or wkhtmltopdf
  const result = { jobId, spreads, pageCount: spreads.length*2 };
  return res.json({ jobId, result });
});

app.get('/health', (req,res)=>res.json({ok:true}));
app.listen(4000, ()=>console.log('album engine running on 4000'));
