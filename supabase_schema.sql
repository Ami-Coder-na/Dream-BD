
-- Update Users Table
ALTER TABLE users ADD COLUMN IF NOT EXISTS "subscriptionTier" text DEFAULT 'Free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS "imageUploadCount" int DEFAULT 0;

-- Update Service Links Table
ALTER TABLE service_links ADD COLUMN IF NOT EXISTS views int DEFAULT 0;

-- Create Payment Requests Table
CREATE TABLE IF NOT EXISTS payment_requests (
  id text PRIMARY KEY,
  "userId" text,
  "userName" text,
  "planId" text,
  tier text,
  amount numeric,
  method text,
  "userPhone" text,
  "trxId" text,
  status text DEFAULT 'Pending',
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
  id text PRIMARY KEY,
  code text,
  discount numeric,
  "isActive" boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create Pricing Plans Table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id text PRIMARY KEY,
  "nameEn" text,
  "nameBn" text,
  price numeric,
  tier text,
  "limit" int,
  "featuresEn" text[],
  "featuresBn" text[],
  color text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create Site Config Table (For dynamic settings like Merchant Number)
CREATE TABLE IF NOT EXISTS site_config (
  key text PRIMARY KEY,
  value jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS) Policies (Basic Public Access for Demo)
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access to plans and site config
CREATE POLICY "Allow public read plans" ON pricing_plans FOR SELECT USING (true);
CREATE POLICY "Allow public read promo codes" ON promo_codes FOR SELECT USING (true);
CREATE POLICY "Allow public read site config" ON site_config FOR SELECT USING (true);

-- Allow authenticated users to insert payment requests
CREATE POLICY "Allow insert payment requests" ON payment_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to see own requests" ON payment_requests FOR SELECT USING (true);
