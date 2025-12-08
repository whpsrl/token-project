-- ============================================================================
-- MIGRAZIONE COMPLETA: Elimina vecchie tabelle e crea nuovo schema
-- ATTENZIONE: Questo script ELIMINA TUTTE le tabelle vecchie
-- Usa solo se non hai dati importanti da conservare
-- ============================================================================

-- ============================================================================
-- STEP 1: Elimina tabelle vecchie (se esistono)
-- ============================================================================

DROP TABLE IF EXISTS referral_stats CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS presale_registrations CASCADE;

-- Elimina anche le nuove tabelle se esistono già (per ricrearle pulite)
DROP TABLE IF EXISTS airdrop_tasks CASCADE;
DROP TABLE IF EXISTS user_ranks CASCADE;
DROP TABLE IF EXISTS presale_contributions CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Elimina funzioni e trigger vecchi
DROP FUNCTION IF EXISTS update_referral_stats() CASCADE;
DROP FUNCTION IF EXISTS generate_referral_code() CASCADE;
DROP FUNCTION IF EXISTS get_presale_stats() CASCADE;
DROP FUNCTION IF EXISTS get_top_referrers(INTEGER) CASCADE;

-- Elimina views vecchie
DROP VIEW IF EXISTS v_registrations_summary CASCADE;

-- ============================================================================
-- STEP 2: Crea nuovo schema
-- ============================================================================

-- ============================================================================
-- TABELLA: users
-- Descrizione: Utenti autenticati (collegati a Supabase Auth)
-- ============================================================================

CREATE TABLE users (
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_users_wallet ON users(wallet_address) WHERE wallet_address IS NOT NULL;

-- ============================================================================
-- TABELLA: referrals
-- Descrizione: Relazioni referral tra utenti
-- ============================================================================

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL CHECK (level IN (1, 2)),
    total_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referrer_id, referred_id)
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE INDEX idx_referrals_level ON referrals(level);

-- ============================================================================
-- TABELLA: presale_contributions
-- Descrizione: Contributi alla presale
-- ============================================================================

CREATE TABLE presale_contributions (
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

CREATE INDEX idx_presale_user ON presale_contributions(user_id);
CREATE INDEX idx_presale_wallet ON presale_contributions(wallet_address);
CREATE INDEX idx_presale_status ON presale_contributions(status);
CREATE INDEX idx_presale_tx_hash ON presale_contributions(transaction_hash) WHERE transaction_hash IS NOT NULL;

-- ============================================================================
-- TABELLA: user_ranks
-- Descrizione: Rank e statistiche degli utenti
-- ============================================================================

CREATE TABLE user_ranks (
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

CREATE INDEX idx_user_ranks_user ON user_ranks(user_id);
CREATE INDEX idx_user_ranks_rank ON user_ranks(rank);

-- ============================================================================
-- TABELLA: airdrop_tasks
-- Descrizione: Task per airdrop e gamification
-- ============================================================================

CREATE TABLE airdrop_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL,
    completed BOOLEAN DEFAULT false,
    points INTEGER DEFAULT 0,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_airdrop_user ON airdrop_tasks(user_id);
CREATE INDEX idx_airdrop_type ON airdrop_tasks(task_type);
CREATE INDEX idx_airdrop_completed ON airdrop_tasks(completed);

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

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presale_contributions_updated_at
    BEFORE UPDATE ON presale_contributions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_ranks_updated_at
    BEFORE UPDATE ON user_ranks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_airdrop_tasks_updated_at
    BEFORE UPDATE ON airdrop_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE presale_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE airdrop_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Service role può fare tutto
DROP POLICY IF EXISTS "Service role can do anything on users" ON users;
CREATE POLICY "Service role can do anything on users"
    ON users FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can do anything on referrals" ON referrals;
CREATE POLICY "Service role can do anything on referrals"
    ON referrals FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can do anything on presale_contributions" ON presale_contributions;
CREATE POLICY "Service role can do anything on presale_contributions"
    ON presale_contributions FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can do anything on user_ranks" ON user_ranks;
CREATE POLICY "Service role can do anything on user_ranks"
    ON user_ranks FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can do anything on airdrop_tasks" ON airdrop_tasks;
CREATE POLICY "Service role can do anything on airdrop_tasks"
    ON airdrop_tasks FOR ALL
    USING (auth.role() = 'service_role');

-- Policy: Utenti autenticati possono inserire il proprio record durante la registrazione
DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Utenti autenticati possono vedere solo i propri dati
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own referrals" ON referrals;
CREATE POLICY "Users can view own referrals"
    ON referrals FOR SELECT
    USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

DROP POLICY IF EXISTS "Users can view own presale contributions" ON presale_contributions;
CREATE POLICY "Users can view own presale contributions"
    ON presale_contributions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own rank" ON user_ranks;
CREATE POLICY "Users can view own rank"
    ON user_ranks FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own airdrop tasks" ON airdrop_tasks;
CREATE POLICY "Users can view own airdrop tasks"
    ON airdrop_tasks FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own airdrop tasks" ON airdrop_tasks;
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
-- TRIGGER: Crea automaticamente record in users quando viene creato in auth.users
-- Backup nel caso la policy RLS non funzioni durante la registrazione
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_referral_code VARCHAR(50);
BEGIN
    -- Genera referral code unico
    user_referral_code := 'FRP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 9));
    
    -- Assicurati che sia unico
    WHILE EXISTS (SELECT 1 FROM users WHERE referral_code = user_referral_code) LOOP
        user_referral_code := 'FRP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 9));
    END LOOP;
    
    -- Inserisci nella tabella users solo se non esiste già
    INSERT INTO public.users (id, email, referral_code)
    VALUES (NEW.id, NEW.email, user_referral_code)
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crea trigger (solo se non esiste già)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

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

