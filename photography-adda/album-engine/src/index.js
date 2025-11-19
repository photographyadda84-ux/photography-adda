import express from 'express'
import bodyParser from 'body-parser'
import { v4 as uuidv4 } from 'uuid'
const app = express()
app.use(bodyParser.json())

app.post('/generate', (req, res) => {
  const { albumName, pages } = req.body
  // placeholder: in production, render templates into spreads and produce PDF
  const jobId = 'album-' + uuidv4()
  return res.json({ jobId, status: 'queued' })
})

app.get('/health', (req,res)=>res.json({ok:true}))

app.listen(4000, ()=>console.log('album engine running on 4000'))
