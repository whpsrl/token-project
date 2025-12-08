-- ============================================================================
-- FREEPPLE DATABASE SCHEMA
-- Database: PostgreSQL (Supabase)
-- Version: 2.0
-- ============================================================================

-- ============================================================================
-- TABELLA: users
-- Descrizione: Utenti autenticati (collegati a Supabase Auth)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(100),
    cognome VARCHAR(100),
    wallet_address VARCHAR(42) CHECK (wallet_address IS NULL OR wallet_address ~ '^0x[a-fA-F0-9]{40}$'),
    referral_code VARCHAR(50) NOT NULL UNIQUE,
    referred_by VARCHAR(50) REFERENCES users(referral_code),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address) WHERE wallet_address IS NOT NULL;

-- ============================================================================
-- TABELLA: referrals
-- Descrizione: Relazioni referral tra utenti
-- ============================================================================

CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL CHECK (level IN (1, 2)),
    total_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referrer_id, referred_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_level ON referrals(level);

-- ============================================================================
-- TABELLA: presale_contributions
-- Descrizione: Contributi alla presale
-- ============================================================================

CREATE TABLE IF NOT EXISTS presale_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_address VARCHAR(42) NOT NULL CHECK (wallet_address ~ '^0x[a-fA-F0-9]{40}$'),
    amount_usdt DECIMAL(10, 2) NOT NULL CHECK (amount_usdt > 0),
    amount_frp INTEGER NOT NULL CHECK (amount_frp > 0),
    bonus_frp INTEGER DEFAULT 0,
    referral_code VARCHAR(50),
    transaction_hash VARCHAR(66),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_presale_user ON presale_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_presale_wallet ON presale_contributions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_presale_status ON presale_contributions(status);
CREATE INDEX IF NOT EXISTS idx_presale_tx_hash ON presale_contributions(transaction_hash) WHERE transaction_hash IS NOT NULL;

-- ============================================================================
-- TABELLA: user_ranks
-- Descrizione: Rank e statistiche degli utenti
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_ranks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    rank VARCHAR(20) DEFAULT 'none' 
        CHECK (rank IN ('none', 'bronze', 'silver', 'gold', 'diamond', 'ambassador')),
    level1_referrals INTEGER DEFAULT 0,
    level2_referrals INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_ranks_user ON user_ranks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ranks_rank ON user_ranks(rank);

-- ============================================================================
-- TABELLA: airdrop_tasks
-- Descrizione: Task per airdrop e gamification
-- ============================================================================

CREATE TABLE IF NOT EXISTS airdrop_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL,
    completed BOOLEAN DEFAULT false,
    points INTEGER DEFAULT 0,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_airdrop_user ON airdrop_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_airdrop_type ON airdrop_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_airdrop_completed ON airdrop_tasks(completed);

-- ============================================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applica trigger a tutte le tabelle con updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_presale_contributions_updated_at ON presale_contributions;
CREATE TRIGGER update_presale_contributions_updated_at
    BEFORE UPDATE ON presale_contributions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_ranks_updated_at ON user_ranks;
CREATE TRIGGER update_user_ranks_updated_at
    BEFORE UPDATE ON user_ranks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_airdrop_tasks_updated_at ON airdrop_tasks;
CREATE TRIGGER update_airdrop_tasks_updated_at
    BEFORE UPDATE ON airdrop_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Abilita RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE presale_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE airdrop_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Service role può fare tutto
CREATE POLICY "Service role can do anything on users"
    ON users FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on referrals"
    ON referrals FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on presale_contributions"
    ON presale_contributions FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on user_ranks"
    ON user_ranks FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on airdrop_tasks"
    ON airdrop_tasks FOR ALL
    USING (auth.role() = 'service_role');

-- Policy: Utenti autenticati possono vedere solo i propri dati
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can view own referrals"
    ON referrals FOR SELECT
    USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can view own presale contributions"
    ON presale_contributions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own rank"
    ON user_ranks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own airdrop tasks"
    ON airdrop_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own airdrop tasks"
    ON airdrop_tasks FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================================
-- FUNZIONI UTILITY
-- ============================================================================

-- Funzione: Aggiorna user_ranks quando cambiano i referral
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER AS $$
DECLARE
    level1_count INTEGER;
    level2_count INTEGER;
    new_rank VARCHAR(20);
BEGIN
    -- Conta referral livello 1 e 2
    SELECT 
        COUNT(*) FILTER (WHERE level = 1),
        COUNT(*) FILTER (WHERE level = 2)
    INTO level1_count, level2_count
    FROM referrals
    WHERE referrer_id = NEW.referrer_id;
    
    -- Determina rank
    IF level1_count >= 500 AND level2_count >= 2000 THEN
        new_rank := 'ambassador';
    ELSIF level1_count >= 150 AND level2_count >= 500 THEN
        new_rank := 'diamond';
    ELSIF level1_count >= 50 AND level2_count >= 150 THEN
        new_rank := 'gold';
    ELSIF level1_count >= 20 AND level2_count >= 50 THEN
        new_rank := 'silver';
    ELSIF level1_count >= 5 THEN
        new_rank := 'bronze';
    ELSE
        new_rank := 'none';
    END IF;
    
    -- Aggiorna o crea user_ranks
    INSERT INTO user_ranks (user_id, rank, level1_referrals, level2_referrals)
    VALUES (NEW.referrer_id, new_rank, level1_count, level2_count)
    ON CONFLICT (user_id) DO UPDATE
    SET 
        rank = new_rank,
        level1_referrals = level1_count,
        level2_referrals = level2_count,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger per aggiornare rank quando viene aggiunto un referral
DROP TRIGGER IF EXISTS update_rank_on_referral ON referrals;
CREATE TRIGGER update_rank_on_referral
    AFTER INSERT OR UPDATE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rank();

-- ============================================================================
-- VERIFICA TABELLE
-- ============================================================================

-- Verifica che tutte le tabelle siano state create
SELECT 
    tablename, 
    schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'referrals', 'presale_contributions', 'user_ranks', 'airdrop_tasks')
ORDER BY tablename;

