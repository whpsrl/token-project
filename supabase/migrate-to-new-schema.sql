-- ============================================================================
-- MIGRAZIONE: Da vecchio schema a nuovo schema
-- ATTENZIONE: Questo script ELIMINA le tabelle vecchie
-- Usa solo se non hai dati importanti da conservare
-- ============================================================================

-- Elimina tabelle vecchie (se esistono)
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
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS get_presale_stats() CASCADE;
DROP FUNCTION IF EXISTS get_top_referrers(INTEGER) CASCADE;

-- Elimina views vecchie
DROP VIEW IF EXISTS v_registrations_summary CASCADE;

-- Ora esegui il contenuto di supabase/schema.sql
-- (continua con lo schema completo)

