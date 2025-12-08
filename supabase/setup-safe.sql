-- ============================================================================
-- SETUP SICURO - Non elimina dati esistenti
-- Usa questo se hai già dati nel database o hai già eseguito altri script
-- ============================================================================

-- ============================================================================
-- STEP 1: Crea tabelle solo se non esistono
-- ============================================================================

-- Tabella users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(100),
    cognome VARCHAR(100),
    wallet_address VARCHAR(42) CHECK (wallet_address IS NULL OR wallet_address ~ '^0x[a-fA-F0-9]{40}$'),
    referral_code VARCHAR(50) NOT NULL UNIQUE,
    referred_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rimuovi foreign key constraint se esiste (causa problemi di timing)
-- Il controllo viene fatto a livello applicativo nella funzione create_user_profile
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Crea indici solo se non esistono
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address) WHERE wallet_address IS NOT NULL;

-- Tabella referrals
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

-- Tabella presale_contributions
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

-- Tabella user_ranks
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

-- Tabella airdrop_tasks
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
-- STEP 2: Crea/aggiorna funzioni
-- ============================================================================

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Funzione per creare profilo utente (bypassa RLS)
CREATE OR REPLACE FUNCTION create_user_profile(
    p_id UUID,
    p_email VARCHAR,
    p_nome VARCHAR DEFAULT NULL,
    p_cognome VARCHAR DEFAULT NULL,
    p_referral_code VARCHAR DEFAULT NULL,
    p_referred_by VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    user_id UUID,
    user_email VARCHAR,
    user_nome VARCHAR,
    user_cognome VARCHAR,
    user_wallet_address VARCHAR,
    user_referral_code VARCHAR,
    user_referred_by VARCHAR,
    user_created_at TIMESTAMPTZ,
    user_updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_referral_code VARCHAR(50);
    auth_user_exists BOOLEAN := false;
    retry_count INTEGER := 0;
BEGIN
    -- Genera referral code se non fornito
    IF p_referral_code IS NULL THEN
        v_referral_code := 'FRP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 9));
        -- Assicurati che sia unico
        WHILE EXISTS (SELECT 1 FROM public.users WHERE referral_code = v_referral_code) LOOP
            v_referral_code := 'FRP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 9));
        END LOOP;
    ELSE
        v_referral_code := p_referral_code;
    END IF;
    
    -- Verifica che l'utente esista in auth.users (con retry per timing)
    WHILE NOT auth_user_exists AND retry_count < 5 LOOP
        SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = p_id) INTO auth_user_exists;
        IF NOT auth_user_exists THEN
            PERFORM pg_sleep(0.1); -- Aspetta 100ms
            retry_count := retry_count + 1;
        END IF;
    END LOOP;
    
    IF NOT auth_user_exists THEN
        RAISE EXCEPTION 'User with id % does not exist in auth.users after retries', p_id;
    END IF;
    
    -- Inserisci o aggiorna utente
    INSERT INTO public.users (id, email, nome, cognome, referral_code, referred_by)
    VALUES (p_id, p_email, p_nome, p_cognome, v_referral_code, p_referred_by)
    ON CONFLICT ON CONSTRAINT users_pkey DO UPDATE
    SET 
        email = EXCLUDED.email,
        nome = COALESCE(EXCLUDED.nome, public.users.nome),
        cognome = COALESCE(EXCLUDED.cognome, public.users.cognome),
        referral_code = COALESCE(EXCLUDED.referral_code, public.users.referral_code),
        referred_by = COALESCE(EXCLUDED.referred_by, public.users.referred_by),
        updated_at = NOW();
    
    -- Ritorna il record con nomi colonne diversi per evitare ambiguità
    RETURN QUERY
    SELECT 
        u.id AS user_id, 
        u.email AS user_email, 
        u.nome AS user_nome, 
        u.cognome AS user_cognome, 
        u.wallet_address AS user_wallet_address, 
        u.referral_code AS user_referral_code, 
        u.referred_by AS user_referred_by, 
        u.created_at AS user_created_at, 
        u.updated_at AS user_updated_at
    FROM public.users u
    WHERE u.id = p_id;
END;
$$;

-- Funzione per aggiornare wallet
CREATE OR REPLACE FUNCTION update_user_wallet(
    p_user_id UUID,
    p_wallet_address VARCHAR
)
RETURNS TABLE (
    user_id UUID,
    user_email VARCHAR,
    user_nome VARCHAR,
    user_cognome VARCHAR,
    user_wallet_address VARCHAR,
    user_referral_code VARCHAR,
    user_referred_by VARCHAR,
    user_created_at TIMESTAMPTZ,
    user_updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.users
    SET wallet_address = p_wallet_address, updated_at = NOW()
    WHERE public.users.id = p_user_id;
    
    RETURN QUERY
    SELECT 
        u.id AS user_id, 
        u.email AS user_email, 
        u.nome AS user_nome, 
        u.cognome AS user_cognome, 
        u.wallet_address AS user_wallet_address, 
        u.referral_code AS user_referral_code, 
        u.referred_by AS user_referred_by, 
        u.created_at AS user_created_at, 
        u.updated_at AS user_updated_at
    FROM public.users u
    WHERE u.id = p_user_id;
END;
$$;

-- Funzione per aggiornare rank utente
CREATE OR REPLACE FUNCTION update_user_rank()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    FROM public.referrals
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
    INSERT INTO public.user_ranks (user_id, rank, level1_referrals, level2_referrals)
    VALUES (NEW.referrer_id, new_rank, level1_count, level2_count)
    ON CONFLICT (user_id) DO UPDATE
    SET 
        rank = new_rank,
        level1_referrals = level1_count,
        level2_referrals = level2_count,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$;

-- ============================================================================
-- STEP 3: Crea/aggiorna trigger (elimina e ricrea per evitare duplicati)
-- ============================================================================

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

DROP TRIGGER IF EXISTS update_rank_on_referral ON referrals;
CREATE TRIGGER update_rank_on_referral
    AFTER INSERT OR UPDATE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rank();

-- ============================================================================
-- STEP 4: Configura RLS (solo se non già abilitato)
-- ============================================================================

-- Abilita RLS (non fa nulla se già abilitato)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE presale_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE airdrop_tasks ENABLE ROW LEVEL SECURITY;

-- Elimina policy esistenti e ricreale (per evitare conflitti)
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

-- Policy utenti (elimina e ricrea)
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
-- VERIFICA
-- ============================================================================

SELECT 
    'Setup completato!' as message,
    COUNT(*) as tabelle_create
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'referrals', 'presale_contributions', 'user_ranks', 'airdrop_tasks');

