-- ============================================================================
-- FIX COMPLETO RLS - Usa funzioni SECURITY DEFINER per bypassare RLS
-- ============================================================================

-- ============================================================================
-- STEP 1: Elimina tutte le policy esistenti per users
-- ============================================================================

DROP POLICY IF EXISTS "Service role can do anything on users" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- ============================================================================
-- STEP 2: Crea funzioni SECURITY DEFINER per bypassare RLS
-- ============================================================================

-- Funzione per creare/aggiornare utente (bypassa RLS)
CREATE OR REPLACE FUNCTION create_user_profile(
    p_id UUID,
    p_email VARCHAR,
    p_nome VARCHAR DEFAULT NULL,
    p_cognome VARCHAR DEFAULT NULL,
    p_referral_code VARCHAR DEFAULT NULL,
    p_referred_by VARCHAR DEFAULT NULL
)
RETURNS users AS $$
DECLARE
    v_referral_code VARCHAR(50);
    v_user users;
BEGIN
    -- Genera referral code se non fornito
    IF p_referral_code IS NULL THEN
        v_referral_code := 'FRP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 9));
        -- Assicurati che sia unico
        WHILE EXISTS (SELECT 1 FROM users WHERE referral_code = v_referral_code) LOOP
            v_referral_code := 'FRP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 9));
        END LOOP;
    ELSE
        v_referral_code := p_referral_code;
    END IF;
    
    -- Inserisci o aggiorna utente
    INSERT INTO users (id, email, nome, cognome, referral_code, referred_by)
    VALUES (p_id, p_email, p_nome, p_cognome, v_referral_code, p_referred_by)
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        nome = COALESCE(EXCLUDED.nome, users.nome),
        cognome = COALESCE(EXCLUDED.cognome, users.cognome),
        referral_code = COALESCE(EXCLUDED.referral_code, users.referral_code),
        referred_by = COALESCE(EXCLUDED.referred_by, users.referred_by),
        updated_at = NOW()
    RETURNING * INTO v_user;
    
    RETURN v_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funzione per aggiornare wallet address (bypassa RLS)
CREATE OR REPLACE FUNCTION update_user_wallet(
    p_user_id UUID,
    p_wallet_address VARCHAR
)
RETURNS users AS $$
DECLARE
    v_user users;
BEGIN
    UPDATE users
    SET wallet_address = p_wallet_address, updated_at = NOW()
    WHERE id = p_user_id
    RETURNING * INTO v_user;
    
    IF v_user IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    RETURN v_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 3: Ricrea policy RLS (solo per SELECT e UPDATE, INSERT gestito da funzione)
-- ============================================================================

-- Service role può fare tutto
CREATE POLICY "Service role can do anything on users"
    ON users FOR ALL
    USING (auth.role() = 'service_role');

-- Utenti possono vedere solo i propri dati
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Utenti possono aggiornare solo i propri dati
CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- NOTA: Non creiamo policy per INSERT perché usiamo la funzione create_user_profile

-- ============================================================================
-- STEP 4: Aggiorna trigger per usare la funzione
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Usa la funzione create_user_profile invece di INSERT diretto
    PERFORM create_user_profile(
        NEW.id,
        NEW.email,
        NULL, -- nome
        NULL, -- cognome
        NULL, -- referral_code (verrà generato)
        NULL  -- referred_by
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verifica che tutto sia stato creato
SELECT 
    'Functions' as type,
    routine_name as name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_profile', 'update_user_wallet', 'handle_new_user')
UNION ALL
SELECT 
    'Policies' as type,
    policyname as name
FROM pg_policies
WHERE tablename = 'users'
ORDER BY type, name;

