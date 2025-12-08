-- ============================================================================
-- FIX RLS POLICIES per permettere registrazione
-- Esegui questo script se ottieni "new row violates row-level security policy"
-- ============================================================================

-- Elimina policy esistenti per users (se necessario)
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Policy: Utenti possono inserire il proprio record durante la registrazione
CREATE POLICY "Users can insert own data"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Utenti possono vedere solo i propri dati
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Policy: Utenti possono aggiornare solo i propri dati
CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Policy per referrals: permettere inserimento durante registrazione
DROP POLICY IF EXISTS "Users can insert own referrals" ON referrals;
CREATE POLICY "Users can insert own referrals"
    ON referrals FOR INSERT
    WITH CHECK (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- ============================================================================
-- TRIGGER: Crea automaticamente record in users quando viene creato in auth.users
-- Questo è un backup nel caso la policy RLS non funzioni
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

-- Verifica che le policy siano state create
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

