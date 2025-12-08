-- ============================================================================
-- FREEPPLE DATABASE SCHEMA - COMPLETE
-- Esegui QUESTO PRIMA dei trigger
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop existing tables (se vuoi ricominciare da zero)
-- ============================================================================

-- ATTENZIONE: Questo cancellerà tutti i dati!
-- Commenta questa sezione se vuoi mantenere dati esistenti

/*
DROP TABLE IF EXISTS referral_stats CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS presale_registrations CASCADE;
*/

-- ============================================================================
-- STEP 2: Create presale_registrations table
-- ============================================================================

CREATE TABLE IF NOT EXISTS presale_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  my_referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'paid', 'completed')),
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT wallet_format CHECK (wallet_address ~* '^0x[a-fA-F0-9]{40}$'),
  CONSTRAINT referral_code_format CHECK (my_referral_code ~* '^[A-Z0-9]{8}$')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_presale_wallet ON presale_registrations(wallet_address);
CREATE INDEX IF NOT EXISTS idx_presale_email ON presale_registrations(email);
CREATE INDEX IF NOT EXISTS idx_presale_referral_code ON presale_registrations(my_referral_code);
CREATE INDEX IF NOT EXISTS idx_presale_referred_by ON presale_registrations(referred_by);
CREATE INDEX IF NOT EXISTS idx_presale_status ON presale_registrations(status);

-- ============================================================================
-- STEP 3: Create payment_transactions table
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES presale_registrations(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  amount DECIMAL(20, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  payment_method TEXT CHECK (payment_method IN ('stripe', 'crypto', 'bank_transfer')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  transaction_hash TEXT,
  stripe_payment_intent_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_wallet ON payment_transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment_transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_registration ON payment_transactions(registration_id);

-- ============================================================================
-- STEP 4: Create referral_stats table
-- ============================================================================

CREATE TABLE IF NOT EXISTS referral_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL REFERENCES presale_registrations(wallet_address) ON DELETE CASCADE,
  total_referrals INTEGER DEFAULT 0,
  direct_referrals INTEGER DEFAULT 0,
  level_2_referrals INTEGER DEFAULT 0,
  total_bonus_earned DECIMAL(20, 2) DEFAULT 0,
  rank TEXT DEFAULT 'bronze' CHECK (rank IN ('bronze', 'silver', 'gold', 'diamond')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referral_wallet ON referral_stats(wallet_address);
CREATE INDEX IF NOT EXISTS idx_referral_rank ON referral_stats(rank);

-- ============================================================================
-- STEP 5: Create updated_at trigger function
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DROP TRIGGER IF EXISTS update_presale_registrations_updated_at ON presale_registrations;
CREATE TRIGGER update_presale_registrations_updated_at
  BEFORE UPDATE ON presale_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_referral_stats_updated_at ON referral_stats;
CREATE TRIGGER update_referral_stats_updated_at
  BEFORE UPDATE ON referral_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 6: Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE presale_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_stats ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 7: RLS Policies
-- ============================================================================

-- presale_registrations policies
DROP POLICY IF EXISTS "Users can view own registration" ON presale_registrations;
CREATE POLICY "Users can view own registration"
  ON presale_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own registration" ON presale_registrations;
CREATE POLICY "Users can insert own registration"
  ON presale_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role has full access to registrations" ON presale_registrations;
CREATE POLICY "Service role has full access to registrations"
  ON presale_registrations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- payment_transactions policies
DROP POLICY IF EXISTS "Users can view own payments" ON payment_transactions;
CREATE POLICY "Users can view own payments"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (
    wallet_address IN (
      SELECT wallet_address FROM presale_registrations WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service role has full access to payments" ON payment_transactions;
CREATE POLICY "Service role has full access to payments"
  ON payment_transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- referral_stats policies
DROP POLICY IF EXISTS "Users can view own referral stats" ON referral_stats;
CREATE POLICY "Users can view own referral stats"
  ON referral_stats FOR SELECT
  TO authenticated
  USING (
    wallet_address IN (
      SELECT wallet_address FROM presale_registrations WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can view referral stats" ON referral_stats;
CREATE POLICY "Anyone can view referral stats"
  ON referral_stats FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Service role has full access to referral stats" ON referral_stats;
CREATE POLICY "Service role has full access to referral stats"
  ON referral_stats FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- STEP 8: Utility Functions
-- ============================================================================

-- Function to get presale stats
CREATE OR REPLACE FUNCTION get_presale_stats()
RETURNS TABLE (
  total_registrations BIGINT,
  verified_registrations BIGINT,
  total_raised DECIMAL,
  total_referrals BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_registrations,
    COUNT(*) FILTER (WHERE email_verified = true)::BIGINT AS verified_registrations,
    COALESCE(SUM(pt.amount), 0) AS total_raised,
    COALESCE(SUM(rs.total_referrals), 0)::BIGINT AS total_referrals
  FROM presale_registrations pr
  LEFT JOIN payment_transactions pt ON pr.id = pt.registration_id AND pt.payment_status = 'completed'
  LEFT JOIN referral_stats rs ON pr.wallet_address = rs.wallet_address;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top referrers
CREATE OR REPLACE FUNCTION get_top_referrers(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  wallet_address TEXT,
  total_referrals INTEGER,
  rank TEXT,
  total_bonus_earned DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    rs.wallet_address,
    rs.total_referrals,
    rs.rank,
    rs.total_bonus_earned
  FROM referral_stats rs
  ORDER BY rs.total_referrals DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 9: Grant permissions
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT ON presale_registrations TO anon, authenticated;
GRANT INSERT ON presale_registrations TO authenticated;
GRANT UPDATE ON presale_registrations TO authenticated;

GRANT SELECT ON payment_transactions TO authenticated;
GRANT INSERT ON payment_transactions TO authenticated;

GRANT SELECT ON referral_stats TO anon, authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_presale_stats() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_top_referrers(INTEGER) TO anon, authenticated;

-- ============================================================================
-- STEP 10: Insert sample data (OPTIONAL - for testing)
-- ============================================================================

/*
-- Uncomment to insert test data

INSERT INTO presale_registrations (
  wallet_address,
  email,
  my_referral_code,
  referred_by,
  status,
  email_verified
) VALUES
  ('0x1111111111111111111111111111111111111111', 'user1@test.com', 'TEST0001', NULL, 'verified', true),
  ('0x2222222222222222222222222222222222222222', 'user2@test.com', 'TEST0002', 'TEST0001', 'verified', true),
  ('0x3333333333333333333333333333333333333333', 'user3@test.com', 'TEST0003', 'TEST0001', 'pending', false)
ON CONFLICT (wallet_address) DO NOTHING;

-- Initialize referral stats for test users
INSERT INTO referral_stats (wallet_address, total_referrals, rank)
SELECT wallet_address, 0, 'bronze'
FROM presale_registrations
ON CONFLICT (wallet_address) DO NOTHING;
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('presale_registrations', 'payment_transactions', 'referral_stats')
ORDER BY table_name;

-- Verify columns
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('presale_registrations', 'payment_transactions', 'referral_stats')
ORDER BY table_name, ordinal_position;

-- Verify indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('presale_registrations', 'payment_transactions', 'referral_stats')
ORDER BY tablename, indexname;

-- Verify RLS policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('presale_registrations', 'payment_transactions', 'referral_stats')
ORDER BY tablename, policyname;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$ 
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - presale_registrations';
  RAISE NOTICE '  - payment_transactions';
  RAISE NOTICE '  - referral_stats';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Verify tables in Table Editor';
  RAISE NOTICE '  2. Execute supabase-triggers.sql';
  RAISE NOTICE '  3. Test registration flow';
  RAISE NOTICE '========================================';
END $$;
