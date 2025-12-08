-- ============================================================================
-- FIX FOREIGN KEY CONSTRAINT
-- Esegui questo script se ottieni "violates foreign key constraint users_id_fkey"
-- ============================================================================

-- Opzione 1: Rimuovi il foreign key constraint esistente
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Opzione 2: Ricrea il constraint come DEFERRABLE (verifica alla fine della transazione)
ALTER TABLE users 
ADD CONSTRAINT users_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE 
DEFERRABLE INITIALLY DEFERRED;

-- Verifica che il constraint sia stato creato correttamente
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    condeferrable as is_deferrable,
    condeferred as is_deferred
FROM pg_constraint
WHERE conrelid = 'users'::regclass
AND conname = 'users_id_fkey';

