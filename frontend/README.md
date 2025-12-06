# Freepple Frontend

Landing page e dashboard per la presale di Freepple.

## 🚀 Setup

```bash
# Installa dipendenze
npm install

# Avvia development server
npm run dev

# Build per produzione
npm run build
```

## 📁 Struttura

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Dashboard utente
│   ├── presale/              # Pagina presale
│   └── layout.tsx            # Layout principale
├── components/
│   ├── landing/              # Componenti landing
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Presale.tsx
│   │   ├── Tokenomics.tsx
│   │   ├── Roadmap.tsx
│   │   └── CTA.tsx
│   ├── dashboard/            # Componenti dashboard
│   │   ├── DashboardStats.tsx
│   │   ├── ReferralSection.tsx
│   │   ├── PresaleStatus.tsx
│   │   └── AirdropProgress.tsx
│   └── layout/               # Navbar, Footer
├── public/                    # Immagini, assets
└── package.json
```

## 🔧 Configurazione

Crea un file `.env.local`:

```
NEXT_PUBLIC_POLYGON_RPC=https://polygon-rpc.com
NEXT_PUBLIC_PRESALE_CONTRACT=0x...
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WALLET_CONNECT_ID=your_walletconnect_id
```

## 🎨 Design

- **Framework:** Next.js 14 + React 18
- **Styling:** Tailwind CSS
- **Animazioni:** Framer Motion
- **Wallet:** RainbowKit + Wagmi
- **Grafici:** Recharts
- **Colori:** Viola/Pink (Polygon theme)

## 📝 TODO

- [ ] Integrazione smart contract presale
- [ ] Backend API per referral tracking
- [ ] Sistema airdrop gamificato completo
- [ ] Animazioni e transizioni avanzate
- [ ] Mobile responsive completo
- [ ] SEO optimization
- [ ] Analytics

## 🚀 Deploy

Il progetto è pronto per deploy su:
- Vercel (consigliato)
- Netlify
- Altri hosting Next.js
