# Setup Supabase per Freepple

## 🚀 Passo 1: Crea Progetto Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Clicca "New Project"
3. Compila:
   - Name: `freepple`
   - Database Password: (salvala!)
   - Region: (scegli la più vicina)
4. Clicca "Create new project"

## 📊 Passo 2: Crea Database

**IMPORTANTE**: Se hai già eseguito lo schema vecchio, devi eliminare le tabelle vecchie prima.

### Opzione A: Database nuovo (prima volta)
1. Vai su "SQL Editor" nel menu Supabase
2. Copia tutto il contenuto da `supabase/schema.sql`
3. Incolla e clicca "Run"

### Opzione B: Database esistente (migrazione)
1. Vai su "SQL Editor" nel menu Supabase
2. Copia tutto il contenuto da `supabase/full-migration.sql` (elimina vecchie tabelle e crea nuove)
3. Incolla e clicca "Run"
4. ⚠️ **ATTENZIONE**: Questo elimina tutte le tabelle vecchie! Usa solo se non hai dati importanti.

### Verifica
Dopo l'esecuzione, verifica che tutte le tabelle siano state create:
- ✅ `users`
- ✅ `referrals`
- ✅ `presale_contributions`
- ✅ `user_ranks`
- ✅ `airdrop_tasks`

## 🔑 Passo 3: Ottieni API Keys

1. Vai su "Settings" → "API"
2. Copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (backend)

## ⚙️ Passo 4: Configura Frontend

Crea file `.env.local` nella root del progetto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 🔐 Passo 5: Configura Auth

1. Vai su "Authentication" → "Settings"
2. Abilita "Email" provider
3. Configura email templates (opzionale)

## ✅ Verifica

Il database è pronto quando:
- ✅ Tabella `users` esiste (collegata a Supabase Auth)
- ✅ Tabella `referrals` esiste
- ✅ Tabella `presale_contributions` esiste
- ✅ Tabella `user_ranks` esiste
- ✅ Tabella `airdrop_tasks` esiste

**Nota importante**: La tabella `users` deve essere creata PRIMA di provare a registrarsi, altrimenti otterrai l'errore "Could not find the table 'public.users'".

## 📝 Note

- Supabase ha tier gratuito generoso
- PostgreSQL è potente e scalabile
- API REST automatica
- Realtime opzionale per aggiornamenti live


