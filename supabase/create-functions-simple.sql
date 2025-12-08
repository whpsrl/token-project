-- ============================================================================
-- Crea funzioni per bypassare RLS - Versione semplice
-- ============================================================================

-- Elimina funzione se esiste già
DROP FUNCTION IF EXISTS create_user_profile(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS create_user_profile;

-- Crea funzione per creare/aggiornare utente
CREATE OR REPLACE FUNCTION create_user_profile(
    p_id UUID,
    p_email VARCHAR,
    p_nome VARCHAR DEFAULT NULL,
    p_cognome VARCHAR DEFAULT NULL,
    p_referral_code VARCHAR DEFAULT NULL,
    p_referred_by VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    nome VARCHAR,
    cognome VARCHAR,
    wallet_address VARCHAR,
    referral_code VARCHAR,
    referred_by VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_referral_code VARCHAR(50);
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
    INSERT INTO public.users (id, email, nome, cognome, referral_code, referred_by)
    VALUES (p_id, p_email, p_nome, p_cognome, v_referral_code, p_referred_by)
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        nome = COALESCE(EXCLUDED.nome, public.users.nome),
        cognome = COALESCE(EXCLUDED.cognome, public.users.cognome),
        referral_code = COALESCE(EXCLUDED.referral_code, public.users.referral_code),
        referred_by = COALESCE(EXCLUDED.referred_by, public.users.referred_by),
        updated_at = NOW();
    
    -- Ritorna il record inserito/aggiornato
    RETURN QUERY
    SELECT 
        u.id, 
        u.email, 
        u.nome, 
        u.cognome, 
        u.wallet_address, 
        u.referral_code, 
        u.referred_by, 
        u.created_at, 
        u.updated_at
    FROM public.users u
    WHERE u.id = p_id;
END;
$$;

-- Crea funzione per aggiornare wallet
DROP FUNCTION IF EXISTS update_user_wallet(UUID, VARCHAR);
CREATE OR REPLACE FUNCTION update_user_wallet(
    p_user_id UUID,
    p_wallet_address VARCHAR
)
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    nome VARCHAR,
    cognome VARCHAR,
    wallet_address VARCHAR,
    referral_code VARCHAR,
    referred_by VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
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
        u.id, 
        u.email, 
        u.nome, 
        u.cognome, 
        u.wallet_address, 
        u.referral_code, 
        u.referred_by, 
        u.created_at, 
        u.updated_at
    FROM public.users u
    WHERE u.id = p_user_id;
END;
$$;

-- Verifica che le funzioni siano state create
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_profile', 'update_user_wallet')
ORDER BY routine_name;

