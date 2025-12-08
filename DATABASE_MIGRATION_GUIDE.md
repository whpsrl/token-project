# 🔄 Guida alla Migrazione Database

## Quale script usare?

### 🆕 Database nuovo (nessun dato)
**Usa**: `supabase/setup-complete.sql`
- Elimina tutto e ricrea da zero
- Più pulito e garantito
- ⚠️ Elimina tutti i dati esistenti

### 📊 Database esistente (hai già dati o script)
**Usa**: `supabase/setup-safe.sql`
- Non elimina dati esistenti
- Crea solo quello che manca
- Aggiorna funzioni e policy esistenti
- ✅ Mantiene i tuoi dati

## Cosa succede con gli script precedenti?

### Se hai eseguito `setup-complete.sql`:
- ✅ Tutto viene sostituito
- ✅ Non devi fare nulla con gli script precedenti
- ✅ Il nuovo setup è completo e funzionante

### Se hai eseguito altri script (schema.sql, full-migration.sql, ecc.):
- Se usi `setup-complete.sql`: **TUTTO viene eliminato e ricreato**
- Se usi `setup-safe.sql`: **Viene aggiunto/aggiornato solo quello che manca**

## Cosa fare con le query esistenti?

### Query di test/verifica
- ✅ Puoi tenerle, non fanno male
- ✅ Oppure eliminarle se non servono più

### Query di migrazione vecchie
- ✅ Puoi eliminarle dopo aver eseguito il nuovo setup
- ✅ Oppure tenerle come backup/documentazione

### Dati esistenti
- ⚠️ Se usi `setup-complete.sql`: **Vengono eliminati**
- ✅ Se usi `setup-safe.sql`: **Vengono mantenuti**

## Raccomandazione

### Scenario 1: Database nuovo o di test
```sql
-- Esegui questo
supabase/setup-complete.sql
```

### Scenario 2: Database con dati importanti
```sql
-- PRIMA: Fai un backup
-- POI: Esegui questo
supabase/setup-safe.sql
```

### Scenario 3: Database con problemi/errori
```sql
-- Esegui questo per pulire tutto
supabase/setup-complete.sql
```

## Backup (se hai dati importanti)

Prima di eseguire `setup-complete.sql`, fai un backup:

```sql
-- Backup tabelle (esempio per users)
SELECT * FROM users;
-- Copia i risultati o esporta come CSV

-- Oppure usa pg_dump se hai accesso CLI
pg_dump -h db.xxx.supabase.co -U postgres -d postgres -t users > backup_users.sql
```

## Dopo la migrazione

1. ✅ Verifica che tutte le tabelle siano state create
2. ✅ Verifica che le funzioni funzionino
3. ✅ Testa la registrazione
4. ✅ Se tutto funziona, puoi eliminare gli script vecchi

## Domande Frequenti

**Q: Devo eseguire tutti gli script precedenti?**  
A: No, basta eseguire `setup-complete.sql` o `setup-safe.sql`

**Q: Gli script precedenti creano conflitti?**  
A: `setup-complete.sql` elimina tutto, quindi no. `setup-safe.sql` aggiorna solo quello che serve.

**Q: Posso tenere gli script vecchi?**  
A: Sì, non fanno male. Puoi tenerli come documentazione o eliminarli.

**Q: Cosa succede se eseguo più volte lo stesso script?**  
A: 
- `setup-complete.sql`: Puoi eseguirlo più volte, elimina e ricrea tutto
- `setup-safe.sql`: Puoi eseguirlo più volte, aggiorna solo quello che serve

