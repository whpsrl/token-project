# 🗄️ Setup Database Freepple

## Setup Completo (Consigliato)

Il modo più semplice e sicuro per configurare il database è usare lo script completo.

### Passi:

1. **Vai su Supabase Dashboard**
   - Accedi al tuo progetto
   - Vai su "SQL Editor" nel menu laterale

2. **Esegui lo script completo**
   - Apri il file `supabase/setup-complete.sql`
   - Copia TUTTO il contenuto
   - Incolla nel SQL Editor di Supabase
   - Clicca "Run" (o premi Ctrl+Enter)

3. **Verifica**
   - Alla fine dello script vedrai una verifica di:
     - ✅ Tabelle create
     - ✅ Funzioni create
     - ✅ Policy create
     - ✅ Trigger creati

## Cosa fa lo script

Lo script `setup-complete.sql`:

1. **Pulisce tutto** (se esiste già):
   - Elimina trigger
   - Elimina funzioni
   - Elimina policy RLS
   - Elimina tabelle

2. **Crea le tabelle**:
   - `users` - Utenti autenticati
   - `referrals` - Relazioni referral
   - `presale_contributions` - Contributi presale
   - `user_ranks` - Rank e statistiche
   - `airdrop_tasks` - Task airdrop

3. **Crea le funzioni**:
   - `create_user_profile()` - Crea profilo utente (bypassa RLS)
   - `update_user_wallet()` - Aggiorna wallet (bypassa RLS)
   - `update_user_rank()` - Aggiorna rank automaticamente
   - `update_updated_at_column()` - Aggiorna timestamp

4. **Configura RLS**:
   - Service role può fare tutto
   - Utenti possono vedere/aggiornare solo i propri dati
   - INSERT gestito da funzioni SECURITY DEFINER

5. **Crea trigger**:
   - Auto-aggiorna `updated_at`
   - Auto-aggiorna rank quando cambiano i referral

## Risoluzione Problemi

### Errore: "Could not find the table 'public.users'"
**Soluzione**: Esegui `setup-complete.sql` per creare tutte le tabelle.

### Errore: "new row violates row-level security policy"
**Soluzione**: Lo script configura correttamente RLS. Se persiste, verifica che le funzioni `create_user_profile` e `update_user_wallet` siano state create.

### Errore: "Could not find the function create_user_profile"
**Soluzione**: Esegui `setup-complete.sql` per creare tutte le funzioni.

### Errore: "column reference 'id' is ambiguous"
**Soluzione**: Lo script usa riferimenti espliciti (`public.users.id`) per evitare ambiguità.

## Verifica Manuale

Dopo aver eseguito lo script, puoi verificare manualmente:

```sql
-- Verifica tabelle
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'referrals', 'presale_contributions', 'user_ranks', 'airdrop_tasks');

-- Verifica funzioni
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_profile', 'update_user_wallet');

-- Verifica policy
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public';
```

## Supporto

Se hai problemi:
1. Controlla i log di Supabase per errori SQL
2. Verifica che tutte le tabelle/funzioni siano state create
3. Controlla che le variabili d'ambiente siano configurate correttamente

