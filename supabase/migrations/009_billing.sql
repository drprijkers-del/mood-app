-- Billing columns on teams
ALTER TABLE teams ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free'
  CHECK (plan IN ('free', 'pro'));
ALTER TABLE teams ADD COLUMN IF NOT EXISTS mollie_customer_id TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS mollie_subscription_id TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS billing_status TEXT NOT NULL DEFAULT 'none'
  CHECK (billing_status IN ('none', 'pending_mandate', 'active', 'cancelled', 'past_due'));
ALTER TABLE teams ADD COLUMN IF NOT EXISTS billing_period_end TIMESTAMPTZ;

-- Payments log
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  mollie_payment_id TEXT NOT NULL UNIQUE,
  amount_value TEXT NOT NULL,
  amount_currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL,
  description TEXT,
  paid_at TIMESTAMPTZ,
  sequence_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_team_id ON payments(team_id);
CREATE INDEX IF NOT EXISTS idx_payments_mollie_id ON payments(mollie_payment_id);
CREATE INDEX IF NOT EXISTS idx_teams_plan ON teams(plan);
