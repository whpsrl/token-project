-- ============================================================================
-- SETUP COMPLETO DATABASE FREEPPLE
-- Esegui questo script per configurare tutto il database da zero
-- ============================================================================

-- ============================================================================
-- STEP 1: PULIZIA - Elimina tutto quello che esiste
-- ============================================================================

-- Elimina trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_rank_on_referral ON referrals;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_presale_contributions_updated_at ON presale_contributions;
DROP TRIGGER IF EXISTS update_user_ranks_updated_at ON user_ranks;
DROP TRIGGER IF EXISTS update_airdrop_tasks_updated_at ON airdrop_tasks;

-- Elimina funzioni
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_user_rank() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS create_user_profile(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS create_user_profile CASCADE;
DROP FUNCTION IF EXISTS update_user_wallet(UUID, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS update_user_wallet CASCADE;

-- Elimina policy
DROP POLICY IF EXISTS "Service role can do anything on users" ON users;
DROP POLICY IF EXISTS "Service role can do anything on referrals" ON referrals;
DROP POLICY IF EXISTS "Service role can do anything on presale_contributions" ON presale_contributions;
DROP POLICY IF EXISTS "Service role can do anything on user_ranks" ON user_ranks;
DROP POLICY IF EXISTS "Service role can do anything on airdrop_tasks" ON airdrop_tasks;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can insert own referrals" ON referrals;
DROP POLICY IF EXISTS "Users can view own presale contributions" ON presale_contributions;
DROP POLICY IF EXISTS "Users can view own rank" ON user_ranks;
DROP POLICY IF EXISTS "Users can view own airdrop tasks" ON airdrop_tasks;
DROP POLICY IF EXISTS "Users can update own airdrop tasks" ON airdrop_tasks;

-- Elimina tabelle (in ordine di dipendenze)
DROP TABLE IF EXISTS airdrop_tasks CASCADE;
DROP TABLE IF EXISTS user_ranks CASCADE;
DROP TABLE IF EXISTS presale_contributions CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- STEP 2: CREA TABELLE
-- ============================================================================

-- Tabella users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(100),
    cognome VARCHAR(100),
    wallet_address VARCHAR(42) CHECK (wallet_address IS NULL OR wallet_address ~ '^0x[a-fA-F0-9]{40}$'),
    referral_code VARCHAR(50) NOT NULL UNIQUE,
    referred_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -- Foreign key rimosso: gestito a livello applicativo nella funzione create_user_profile
    -- Il controllo viene fatto verificando che l'utente esista in auth.users prima di inserire
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_users_wallet ON users(wallet_address) WHERE wallet_address IS NOT NULL;

-- Tabella referrals
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

-- Tabella presale_contributions
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

-- Tabella user_ranks
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

-- Tabella airdrop_tasks
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
-- STEP 3: CREA FUNZIONI
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
    
    -- Inserisci o aggiorna utente (evita ON CONFLICT per eliminare ambiguità)
    IF EXISTS (SELECT 1 FROM public.users WHERE public.users.id = p_id) THEN
        -- Aggiorna record esistente
        UPDATE public.users
        SET 
            email = p_email,
            nome = COALESCE(p_nome, public.users.nome),
            cognome = COALESCE(p_cognome, public.users.cognome),
            referral_code = COALESCE(v_referral_code, public.users.referral_code),
            referred_by = COALESCE(p_referred_by, public.users.referred_by),
            updated_at = NOW()
        WHERE public.users.id = p_id;
    ELSE
        -- Inserisci nuovo record
        INSERT INTO public.users (id, email, nome, cognome, referral_code, referred_by)
        VALUES (p_id, p_email, p_nome, p_cognome, v_referral_code, p_referred_by);
    END IF;
    
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
-- STEP 4: CREA TRIGGER
-- ============================================================================

-- Trigger per updated_at
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

-- Trigger per aggiornare rank quando viene aggiunto un referral
CREATE TRIGGER update_rank_on_referral
    AFTER INSERT OR UPDATE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rank();

-- ============================================================================
-- STEP 5: CONFIGURA ROW LEVEL SECURITY
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

-- NOTA: L'INSERT nella tabella users viene gestito dalla funzione create_user_profile
-- che ha SECURITY DEFINER e quindi bypassa RLS

-- ============================================================================
-- STEP 6: VERIFICA
-- ============================================================================

-- Verifica tabelle
SELECT 
    'Tables' as type,
    tablename as name
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'referrals', 'presale_contributions', 'user_ranks', 'airdrop_tasks')
ORDER BY tablename;

-- Verifica funzioni
SELECT 
    'Functions' as type,
    routine_name as name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_profile', 'update_user_wallet', 'update_user_rank', 'update_updated_at_column')
ORDER BY routine_name;

-- Verifica policy
SELECT 
    'Policies' as type,
    policyname as name,
    tablename
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verifica trigger
SELECT 
    'Triggers' as type,
    trigger_name as name,
    event_object_table as table_name
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

