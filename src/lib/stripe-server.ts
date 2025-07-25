import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});

// Price IDs
export const PRICE_IDS = {
  ARTIST_ANNUAL: process.env.STRIPE_ARTIST_ANNUAL_PRICE_ID!,
  FAN_MONTHLY: process.env.STRIPE_FAN_MONTHLY_PRICE_ID!,
} as const;