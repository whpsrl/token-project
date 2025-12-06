# Freepple Frontend

Landing page, dashboard e sistema presale con Supabase.

## 🚀 Setup

### 1. Installa Dipendenze

```bash
cd frontend
npm install
```

### 2. Setup Supabase

1. Crea progetto su [supabase.com](https://supabase.com)
2. Esegui lo schema SQL da `supabase/schema.sql`
3. Ottieni API keys da Settings → API

### 3. Configurazione

Crea `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Polygon
NEXT_PUBLIC_POLYGON_RPC=https://polygon-rpc.com

# Contracts (quando pronti)
NEXT_PUBLIC_PRESALE_CONTRACT=0x...
NEXT_PUBLIC_TOKEN_CONTRACT=0x...

# WalletConnect
NEXT_PUBLIC_WALLET_CONNECT_ID=your_id
```

### 4. Avvia Development

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## 📁 Struttura

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Dashboard utente
│   ├── presale/              # Pagina presale
│   ├── auth/
│   │   ├── register/         # Registrazione
│   │   └── login/            # Login
│   └── layout.tsx
├── components/
│   ├── landing/              # Componenti landing
│   ├── dashboard/            # Componenti dashboard
│   └── layout/               # Navbar, Footer
├── lib/
│   ├── supabase.ts           # Client Supabase
│   └── api/                  # API functions
│       ├── auth.ts           # Autenticazione
│       ├── referral.ts       # Sistema referral
│       ├── airdrop.ts        # Sistema airdrop
│       └── presale.ts        # Presale tracking
└── supabase/
    └── schema.sql            # Database schema
```

## 🗄️ Database Supabase

Tabelle:
- `users` - Utenti registrati
- `presale_contributions` - Contributi presale
- `referrals` - Sistema referral
- `airdrop_tasks` - Task airdrop completati
- `user_ranks` - Rank utenti
- `staking` - Staking (futuro)

## 🔧 Funzionalità

✅ Registrazione/Login con Supabase Auth
✅ Dashboard utente
✅ Sistema referral con link personalizzato
✅ Tracking presale
✅ Airdrop gamificato
✅ Wallet connect (RainbowKit)
✅ Integrazione Supabase

## 📝 TODO

- [ ] Integrazione smart contract presale
- [ ] Verifica task social (Twitter, Telegram)
- [ ] Notifiche real-time
- [ ] Admin dashboard
- [ ] Analytics

## 🚀 Deploy

### Vercel (Consigliato)

1. Push su GitHub
2. Connetti repository a Vercel
3. Aggiungi variabili ambiente
4. Deploy automatico!

### Variabili Ambiente Vercel

Aggiungi tutte le variabili da `.env.local` nelle impostazioni Vercel.
