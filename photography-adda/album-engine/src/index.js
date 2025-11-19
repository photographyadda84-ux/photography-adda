import express from 'express';
const app = express();
app.get('/health', (req,res)=>res.json({ok:true}));
app.post('/generate', (req,res)=>{
  // placeholder: receive ordered images and layout rules, return a job id
  res.json({ jobId: 'job-1234' });
});
app.listen(4000, ()=>console.log('album engine running'));
