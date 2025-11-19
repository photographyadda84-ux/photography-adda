import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import uploadRoutes from './routes/upload.js';
import dotenv from 'dotenv';
import stripe from 'stripe';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/upload', uploadRoutes);

// Stripe webhook placeholder
app.post('/webhook/stripe', express.raw({type: 'application/json'}), (req, res) => {
  res.status(200).send('ok');
});

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API listening on', PORT));
