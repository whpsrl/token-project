-- ============================================================================
-- FREEPPLE DATABASE SCHEMA
-- Database: PostgreSQL (Supabase)
-- Version: 1.0
-- ============================================================================

-- Elimina tabella se esiste (solo per development)
DROP TABLE IF EXISTS presale_registrations CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS referral_stats CASCADE;

-- ============================================================================
-- TABELLA: presale_registrations
-- Descrizione: Registrazioni alla presale con dati utente e wallet
-- ============================================================================

CREATE TABLE presale_registrations (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Dati Personali
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    
    -- Blockchain
    wallet_address VARCHAR(42) NOT NULL UNIQUE CHECK (wallet_address ~ '^0x[a-fA-F0-9]{40}$'),
    token_amount INTEGER NOT NULL DEFAULT 500000 CHECK (token_amount >= 500000),
    
    -- Referral
    referral_code VARCHAR(50),
    my_referral_code VARCHAR(50) UNIQUE, -- Codice generato per questo utente
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'paid', 'confirmed', 'cancelled', 'refunded')),
    payment_method VARCHAR(20) 
        CHECK (payment_method IN ('card', 'crypto', 'bank_transfer', NULL)),
    payment_confirmed_at TIMESTAMP WITH TIME ZONE,
    
    -- Accettazioni
    accept_terms BOOLEAN NOT NULL DEFAULT false,
    accept_privacy BOOLEAN NOT NULL DEFAULT false,
    newsletter BOOLEAN DEFAULT false,
    
    -- Tracking
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata (JSON per flessibilità futura)
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- INDICI per Performance
-- ============================================================================

CREATE INDEX idx_presale_email ON presale_registrations(email);
CREATE INDEX idx_presale_wallet ON presale_registrations(wallet_address);
CREATE INDEX idx_presale_status ON presale_registrations(status);
CREATE INDEX idx_presale_referral ON presale_registrations(referral_code);
CREATE INDEX idx_presale_created ON presale_registrations(created_at DESC);

-- Indice per ricerca full-text su nome
CREATE INDEX idx_presale_name ON presale_registrations USING gin(
    to_tsvector('english', first_name || ' ' || last_name)
);

-- ============================================================================
-- TABELLA: payment_transactions
-- Descrizione: Log di tutte le transazioni di pagamento
-- ============================================================================

CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES presale_registrations(id) ON DELETE CASCADE,
    
    -- Payment Details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    payment_method VARCHAR(20) NOT NULL,
    
    -- External IDs (Stripe, crypto tx, ecc.)
    external_id VARCHAR(255),
    transaction_hash VARCHAR(66), -- Per pagamenti crypto
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_payment_registration ON payment_transactions(registration_id);
CREATE INDEX idx_payment_status ON payment_transactions(status);
CREATE INDEX idx_payment_external ON payment_transactions(external_id);

-- ============================================================================
-- TABELLA: referral_stats
-- Descrizione: Statistiche referral per ogni utente
-- ============================================================================

CREATE TABLE referral_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES presale_registrations(id) ON DELETE CASCADE,
    
    -- Contatori
    direct_referrals INTEGER DEFAULT 0, -- Livello 1
    indirect_referrals INTEGER DEFAULT 0, -- Livello 2
    total_referrals INTEGER DEFAULT 0,
    
    -- Earnings
    tokens_earned INTEGER DEFAULT 0,
    
    -- Rank
    rank VARCHAR(20) DEFAULT 'bronze' 
        CHECK (rank IN ('bronze', 'silver', 'gold', 'diamond')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referral_registration ON referral_stats(registration_id);
CREATE INDEX idx_referral_rank ON referral_stats(rank);

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

CREATE TRIGGER update_presale_registrations_updated_at
    BEFORE UPDATE ON presale_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referral_stats_updated_at
    BEFORE UPDATE ON referral_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER: Auto-genera referral code
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Genera codice referral unico basato su wallet (primi 8 char)
    NEW.my_referral_code = SUBSTRING(NEW.wallet_address FROM 1 FOR 10);
    
    -- Se esiste già, aggiungi random
    WHILE EXISTS (
        SELECT 1 FROM presale_registrations 
        WHERE my_referral_code = NEW.my_referral_code 
        AND id != NEW.id
    ) LOOP
        NEW.my_referral_code = SUBSTRING(NEW.wallet_address FROM 1 FOR 8) || 
                               SUBSTRING(md5(random()::text) FROM 1 FOR 4);
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_referral_code_trigger
    BEFORE INSERT ON presale_registrations
    FOR EACH ROW
    EXECUTE FUNCTION generate_referral_code();

-- ============================================================================
-- TRIGGER: Update referral stats automaticamente
-- ============================================================================

CREATE OR REPLACE FUNCTION update_referral_stats()
RETURNS TRIGGER AS $$
DECLARE
    referrer_id UUID;
BEGIN
    -- Se c'è un referral code valido
    IF NEW.referral_code IS NOT NULL AND NEW.referral_code != '' THEN
        -- Trova il referrer
        SELECT id INTO referrer_id
        FROM presale_registrations
        WHERE my_referral_code = NEW.referral_code
        LIMIT 1;
        
        IF referrer_id IS NOT NULL THEN
            -- Crea o aggiorna referral stats
            INSERT INTO referral_stats (registration_id, direct_referrals, total_referrals)
            VALUES (referrer_id, 1, 1)
            ON CONFLICT (registration_id) DO UPDATE
            SET direct_referrals = referral_stats.direct_referrals + 1,
                total_referrals = referral_stats.total_referrals + 1,
                updated_at = NOW();
            
            -- Aggiorna rank basato su total_referrals
            UPDATE referral_stats
            SET rank = CASE
                WHEN total_referrals >= 500 THEN 'diamond'
                WHEN total_referrals >= 200 THEN 'gold'
                WHEN total_referrals >= 50 THEN 'silver'
                ELSE 'bronze'
            END
            WHERE registration_id = referrer_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_referral_stats_trigger
    AFTER INSERT ON presale_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_referral_stats();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Abilita RLS
ALTER TABLE presale_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Servizio può fare tutto (per API backend)
CREATE POLICY "Service role can do anything"
    ON presale_registrations
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on payments"
    ON payment_transactions
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on referrals"
    ON referral_stats
    FOR ALL
    USING (auth.role() = 'service_role');

-- Policy: Utenti autenticati possono vedere solo i propri dati
-- (Se implementi auth Supabase in futuro)

-- ============================================================================
-- FUNZIONI UTILITY
-- ============================================================================

-- Funzione: Ottieni statistiche presale
CREATE OR REPLACE FUNCTION get_presale_stats()
RETURNS TABLE (
    total_registrations BIGINT,
    total_paid BIGINT,
    total_confirmed BIGINT,
    total_raised DECIMAL,
    spots_remaining INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT,
        COUNT(*) FILTER (WHERE status = 'paid')::BIGINT,
        COUNT(*) FILTER (WHERE status = 'confirmed')::BIGINT,
        (COUNT(*) FILTER (WHERE status IN ('paid', 'confirmed')) * 500)::DECIMAL,
        GREATEST(0, 300 - COUNT(*)::INTEGER)
    FROM presale_registrations;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funzione: Ottieni top referrer
CREATE OR REPLACE FUNCTION get_top_referrers(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    registration_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    total_referrals INTEGER,
    rank VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        rs.registration_id,
        pr.first_name,
        pr.last_name,
        rs.total_referrals,
        rs.rank
    FROM referral_stats rs
    JOIN presale_registrations pr ON rs.registration_id = pr.id
    ORDER BY rs.total_referrals DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEED DATA (Opzionale - Solo per Testing)
-- ============================================================================

-- Inserisci dati di test solo in development
-- INSERT INTO presale_registrations (
--     first_name, last_name, email, wallet_address, 
--     token_amount, status, accept_terms, accept_privacy
-- ) VALUES
-- ('Test', 'User', 'test@example.com', '0x1234567890123456789012345678901234567890', 
--  600000, 'confirmed', true, true);

-- ============================================================================
-- VIEWS (Opzionali - Per Dashboard Admin)
-- ============================================================================

CREATE OR REPLACE VIEW v_registrations_summary AS
SELECT
    pr.id,
    pr.first_name,
    pr.last_name,
    pr.email,
    pr.wallet_address,
    pr.token_amount,
    pr.status,
    pr.referral_code,
    pr.my_referral_code,
    pr.created_at,
    COALESCE(rs.total_referrals, 0) AS total_referrals,
    COALESCE(rs.rank, 'bronze') AS rank
FROM presale_registrations pr
LEFT JOIN referral_stats rs ON pr.id = rs.registration_id
ORDER BY pr.created_at DESC;

-- ============================================================================
-- BACKUP & MAINTENANCE
-- ============================================================================

-- Comando per backup (esegui da CLI):
-- pg_dump -h db.xxx.supabase.co -U postgres -d postgres -t presale_registrations > backup.sql

-- Comando per restore:
-- psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql

-- ============================================================================
-- FINE SCHEMA
-- ============================================================================

-- Verifica tabelle create
SELECT 
    tablename, 
    schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('presale_registrations', 'payment_transactions', 'referral_stats');

-- Verifica indici
SELECT 
    indexname, 
    tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('presale_registrations', 'payment_transactions', 'referral_stats');

-- Test query: conta registrazioni
SELECT COUNT(*) as total_registrations FROM presale_registrations;

-- Test query: stats presale
SELECT * FROM get_presale_stats();
