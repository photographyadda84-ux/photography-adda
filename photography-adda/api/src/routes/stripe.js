import express from 'express';
import Stripe from 'stripe';
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2022-11-15' });

// simple webhook receiver - expects raw body at /webhook/stripe in main server
router.post('/handle', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  // placeholder - in prod verify signature with endpoint secret
  try{
    const event = JSON.parse(req.body.toString());
    // handle checkout.session.completed etc.
    console.log('stripe event', event.type);
    res.json({received:true});
  }catch(e){
    console.error('stripe webhook parse error', e);
    res.status(400).end();
  }
});

export default router;
