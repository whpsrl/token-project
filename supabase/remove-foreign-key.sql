-- ============================================================================
-- RIMUOVI FOREIGN KEY CONSTRAINT
-- Esegui questo se il foreign key continua a dare problemi
-- Il constraint verrà gestito a livello applicativo
-- ============================================================================

-- Rimuovi il foreign key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Verifica che sia stato rimosso
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'users'::regclass
AND conname = 'users_id_fkey';

-- Se la query non restituisce risultati, il constraint è stato rimosso con successo

