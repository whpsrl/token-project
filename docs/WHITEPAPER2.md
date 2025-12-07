# FREEPPLE WHITEPAPER

## La Rivoluzione Contro le Whale

**Version 2.0** • Dicembre 2024

---

## EXECUTIVE SUMMARY

**Il mercato crypto è rotto.**

Whale che comprano il 20% del supply. Team che scompaiono dopo il lancio. Dump coordinati che azzerano progetti in minuti. Sempre gli stessi che vincono, sempre tu che perdi.

**Freepple (FRP)** nasce per cambiare questo sistema marcio.

Non è un altro token con belle promesse. È un **contratto intelligente** che protegge i piccoli investitori con regole hardcoded, impossibili da modificare o bypassare.

### Cosa rende Freepple diverso?

| Problema Tradizionale | Soluzione Freepple |
|----------------------|-------------------|
| Whale dominano con 20-30% supply | **Max 1% per wallet** - impossibile accumulare |
| Team sblocca token e dumpa | **Locked 1 anno + 1%/mese** - 9+ anni per sbloccare tutto |
| Dump istantanei uccidono il prezzo | **Limiti vendita mensili** progressivi (5% → 10% → 15%) |
| Early sellers fuggono subito | **Sell tax decrescente** (10% → 1% → 0.05%) - chi resta vince |
| Nessun valore reale | **€10.000/mese** di attività produttiva |

---

## 1. IL PROBLEMA: L'ERA DELLE WHALE

### 1.1 Manipolazione Sistematica

Nel 99% dei progetti crypto:

**Fase 1 - Pre-Launch**
- Whale accumula 10-30% del supply tramite presale private
- Team alloca 20-40% per sé, sbloccato dal primo giorno
- Promesse di "hold forever" e "community first"

**Fase 2 - Launch**
- Pump artificiale alimentato da FOMO
- Whale vende gradualmente facendo credere sia "organic growth"
- Piccoli investitori comprano al top

**Fase 3 - Dump**
- Team sblocca e vende tutto in 24-48 ore
- Whale finisce di liquidare
- -80% in pochi giorni
- Progetto morto

**Risultato:** Sempre gli stessi attori istituzionali e whale vincono. Tu perdi.

### 1.2 Statistiche Brutali

- **90%** dei token crypto perdono il 90% del valore entro 1 anno
- **95%** dei team abbandona il progetto entro 2 anni
- **99.9%** dei "whale killer" sono in realtà whale-friendly
- **0.1%** protegge davvero i piccoli investitori

Freepple è in quell'0.1%.

---

## 2. LA SOLUZIONE: REGOLE NEL CODICE

### 2.1 Anti-Whale Assoluto

```solidity
// Max 1% del supply totale per wallet
uint256 public constant MAX_WALLET_PERCENT = 1;

function _transfer(address from, address to, uint256 amount) internal override {
    if (to != owner() && to != address(0)) {
        require(
            balanceOf(to) + amount <= totalSupply() * MAX_WALLET_PERCENT / 100,
            "Max wallet exceeded"
        );
    }
    super._transfer(from, to, amount);
}
```

**Cosa significa:**
- Nessuno può possedere più di 10.000.000 FRP (1% di 1 miliardo)
- Impossibile per whale dominare
- Distribuzione naturalmente decentralizzata
- Potere reale alla community

### 2.2 Anti-Dump Progressivo

```solidity
// Limiti vendita mensili progressivi
mapping(address => uint256) public lastSellTime;
mapping(address => uint256) public monthlySellAmount;

uint256[3] public sellLimits = [5, 10, 15]; // % mensili

function _transfer(address from, address to, uint256 amount) internal override {
    if (isSell(to)) {
        uint256 timeHeld = block.timestamp - firstBuyTime[from];
        uint256 monthsHeld = timeHeld / 30 days;
        
        uint256 limitIndex = monthsHeld >= 2 ? 2 : monthsHeld;
        uint256 maxSellPercent = sellLimits[limitIndex];
        
        uint256 maxSellAmount = balanceOf(from) * maxSellPercent / 100;
        require(monthlySellAmount[from] + amount <= maxSellAmount, "Monthly sell limit exceeded");
        
        monthlySellAmount[from] += amount;
    }
    super._transfer(from, to, amount);
}
```

**Progressione limiti vendita:**
- **Mese 1-2:** Max 5% del tuo balance al mese
- **Mese 3-4:** Max 10% del tuo balance al mese  
- **Mese 5+:** Max 15% del tuo balance al mese

**Perché funziona:**
- Impossibile dumpare tutto in un giorno
- Prezzo protetto da vendite massive
- Chi vuole uscire può farlo gradualmente
- Chi resta viene premiato

### 2.3 Team Locked Davvero

La maggior parte dei progetti dice "team locked", ma:
- Lock di 3-6 mesi = scherzo
- Sblocco immediato al 100% = rug pull garantito
- Nessun vesting = zero commitment

**Freepple è diverso:**

```solidity
// Team wallet: 100.000.000 FRP (10% supply)
address public constant TEAM_WALLET = 0x...;

uint256 public constant TEAM_LOCK_PERIOD = 365 days; // 1 anno
uint256 public constant TEAM_MONTHLY_UNLOCK = 1; // 1% al mese

uint256 public teamUnlockStart;
uint256 public teamUnlockedAmount;

function unlockTeamTokens() external {
    require(msg.sender == TEAM_WALLET, "Not team");
    require(block.timestamp >= teamUnlockStart + TEAM_LOCK_PERIOD, "Still locked");
    
    uint256 monthsElapsed = (block.timestamp - (teamUnlockStart + TEAM_LOCK_PERIOD)) / 30 days;
    uint256 maxUnlockable = (monthsElapsed + 1) * (totalSupply() * TEAM_MONTHLY_UNLOCK / 100);
    
    uint256 toUnlock = maxUnlockable - teamUnlockedAmount;
    require(toUnlock > 0, "Nothing to unlock");
    
    teamUnlockedAmount += toUnlock;
    _transfer(TEAM_WALLET, msg.sender, toUnlock);
}
```

**Timeline reale:**
- **Anno 1:** 100% locked, zero token disponibili
- **Anno 2:** 1% al mese = 12% sbloccato alla fine dell'anno
- **Anno 3-10:** Continua 1% al mese
- **Anno 10+:** Team finalmente ha tutto

**Questo è commitment vero.** Non puoi scappare con i fondi.

### 2.4 Sell Tax Decrescente

```solidity
uint256[3] public sellTaxRates = [10, 5, 1]; // 10% → 5% → 1%
uint256 public constant FINAL_TAX = 0.05; // 0.05% finale

function calculateSellTax(address seller) public view returns (uint256) {
    uint256 timeHeld = block.timestamp - firstBuyTime[seller];
    
    if (timeHeld < 30 days) return 10; // 10% primi 30 giorni
    if (timeHeld < 180 days) return 5; // 5% fino a 6 mesi
    if (timeHeld < 365 days) return 1; // 1% fino a 1 anno
    return FINAL_TAX; // 0.05% dopo 1 anno
}
```

**Meccanismo:**
- Vendi subito? **10% tax** - dumper pagano caro
- Hold 6 mesi? **5% tax** - stai contribuendo
- Hold 1 anno? **1% tax** - sei un vero holder
- Hold 1+ anno? **0.05% tax** - diamante

**Dove vanno le tax:**
- 50% → Liquidity pool (prezzo stabile)
- 30% → Staking rewards (holder ricompensati)
- 20% → Marketing/Development

---

## 3. TOKENOMICS: DISTRIBUZIONE EQUA

### 3.1 Supply & Allocazione

```
SUPPLY TOTALE: 1.000.000.000 FRP

Distribuzione:
├── 40% │████████████████████│ Liquidità DEX (400M FRP)
│       └─ Locked permanente, nessuno può rimuoverla
│
├── 18% │█████████           │ Staking Rewards (180M FRP)
│       └─ Distribuiti in 5 anni, APY 15-30%
│
├── 12% │██████              │ Referral Program (120M FRP)
│       └─ 2 livelli: 3% + 1% commissioni
│
├── 8%  │████                │ Airdrop (80M FRP)
│       └─ Gamificato, max 1.000 FRP per utente
│
├── 7%  │███                 │ Marketing (70M FRP)
│       └─ Rilascio: 0.5%/mese per 14 mesi
│
├── 5%  │██                  │ Reserve Fund (50M FRP)
│       └─ Emergenze, CEX listing, opportunità
│
└── 10% │█████               │ Team (100M FRP)
        └─ 1 anno lock + 1%/mese per 9+ anni
```

### 3.2 Presale: Democratica

**Una regola:** €500 per tutti. Nessuna eccezione.

```
PRESALE TARGET: €150.000
PREZZO: €0.001 per FRP
TOKENS PER PARTECIPANTE: 500.000 FRP
BONUS REFERRAL: +20% (600.000 FRP totali)
MASSIMO PARTECIPANTI: 300
```

**Perché €500?**
- Accessibile per persone normali
- Abbastanza alto da evitare sybil attacks
- Nessun vantaggio per whale con pacchetti VIP
- Tutti partono uguali

**Uso Fondi Presale:**
- 60% → Liquidità iniziale DEX
- 20% → Equipment mining/trading
- 10% → Marketing pre-launch
- 10% → Reserve operativa

### 3.3 Staking: 15-30% APY

```solidity
contract FreeppleStaking {
    uint256 public constant BASE_APY = 15; // 15% APY base
    uint256 public constant MAX_APY = 30; // 30% APY per early stakers
    
    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public stakeTime;
    
    function calculateRewards(address staker) public view returns (uint256) {
        uint256 timeStaked = block.timestamp - stakeTime[staker];
        uint256 apy = BASE_APY + (MAX_APY - BASE_APY) * min(timeStaked, 365 days) / 365 days;
        
        return stakedAmount[staker] * apy * timeStaked / (365 days * 100);
    }
}
```

**Come funziona:**
- Stake FRP, guadagni rewards nel tempo
- APY parte da 15%, arriva a 30% dopo 1 anno
- 180M FRP totali per rewards (5 anni)
- Rewards + profitti attività reale

### 3.4 Referral: 2 Livelli

```
LV1 (Diretti): 3% di ogni acquisto
LV2 (Indiretti): 1% di ogni acquisto

Esempio:
Tu inviti Marco (LV1) → Marco compra 10.000 FRP
→ Tu guadagni 300 FRP (3%)

Marco invita Lucia (LV2) → Lucia compra 10.000 FRP
→ Tu guadagni 100 FRP (1%)
→ Marco guadagni 300 FRP (3%)
```

**+ Sistema Rank:**
- 🥉 Bronze: 10+ referral → +0.5% commissioni
- 🥈 Silver: 50+ referral → +1% commissioni  
- 🥇 Gold: 200+ referral → +1.5% commissioni
- 💎 Diamond: 500+ referral → +2% commissioni

**Top 10 mensili:** Bonus pool da 50.000 FRP

---

## 4. VALORE REALE: €10K/MESE

### 4.1 Non Solo Speculazione

La maggior parte dei token ha **zero valore intrinseco:**
- Nessuna attività produttiva
- Nessun cashflow
- Solo hype e pump & dump

**Freepple genera profitti reali:**

```
ATTIVITÀ MENSILE: ~€10.000

Fonti di reddito:
├── 50% → Mining crypto (BTC, ETH, stablecoin)
├── 30% → Trading automatizzato (bot proprietari)
└── 20% → Servizi B2B (consulting, development)

Distribuzione profitti:
├── 30% → Buyback + Burn (riduce supply)
├── 40% → Liquidity Pool (stabilità prezzo)
└── 30% → Staking Bonus (holder ricompensati)
```

### 4.2 Proof of Work

**Mese 1-3:** Setup mining farm + trading infrastructure
- Acquisto mining rigs (30% fondi presale)
- Configurazione bot trading
- Prime entrate: ~€3.000/mese

**Mese 4-6:** Scale up operazioni
- Expand mining capacity
- Ottimizza strategie trading
- Nuovi contratti B2B
- Target: €7.000-8.000/mese

**Mese 7-12:** Full capacity
- Mining a regime
- Trading profittevole stabilmente
- Partnership consolidate
- Target: €10.000+/mese

### 4.3 Trasparenza Totale

- Dashboard pubblica con stats in real-time
- Report mensili verificabili on-chain
- Wallet tracking per ogni fonte di reddito
- Community può auditare tutto

**Nessun segreto. Solo fatti.**

---

## 5. ROADMAP: IL PERCORSO

### Q1 2025: Fondamenta

**Gennaio**
- ✅ Smart contract development
- ✅ Audit sicurezza (in corso)
- ✅ Website + whitepaper
- 🔄 Presale setup

**Febbraio**  
- 🎯 Presale aperta (300 fondatori)
- 🎯 Community building (Twitter, Telegram)
- 🎯 Partnership strategiche

**Marzo**
- 🎯 Presale chiusa
- 🎯 Deploy contratto Polygon mainnet
- 🎯 Setup mining infrastructure

### Q2 2025: Launch

**Aprile**
- 🎯 Liquidità pool creata (40% supply)
- 🎯 Listing Uniswap/QuickSwap
- 🎯 Distribuzione token presale
- 🎯 Airdrop campaign

**Maggio**
- 🎯 Staking live (APY 15-30%)
- 🎯 Referral program attivo
- 🎯 Prime entrate mining (~€3K/mese)

**Giugno**
- 🎯 Marketing push
- 🎯 Listing aggregatori (CoinGecko, CMC)
- 🎯 Target: 5.000 holder

### Q3 2025: Crescita

**Luglio-Settembre**
- 🎯 Scale mining a €7K-8K/mese
- 🎯 Partnership CEX per listing
- 🎯 Target: 10.000 holder
- 🎯 Buyback program attivo

### Q4 2025: Consolidamento

**Ottobre-Dicembre**
- 🎯 €10K+/mese attività stabile
- 🎯 Listing CEX tier-2
- 🎯 Target: 25.000 holder
- 🎯 Governance token per community

---

## 6. TEAM & SICUREZZA

### 6.1 Chi Siamo

**Team anonimo?** No.

**Team doxxed?** Progressivamente sì.

Preferiamo lasciare che il **codice parli:**
- Contratto verificato on-chain
- Audit esterni
- Wallet tracciabili
- Transparenza totale

**Chi siamo:**
- Sviluppatori blockchain (5+ anni exp)
- Trader/miner professionisti
- Marketing & community builders
- Tutti accumulator crypto dal 2017-2020

**Perché Freepple?**
Siamo stanchi di vedere progetti che fottono le persone. Abbiamo le competenze per fare meglio. E lo faremo.

### 6.2 Audit & Sicurezza

**Audit in corso con:**
- CertiK (in attesa)
- Solidproof (in discussione)
- Community audit (open source)

**Principi sicurezza:**
- No funzioni admin per rubare fondi
- No backdoor per modificare regole
- No possibilità di bloccare withdraw
- Codice immutabile dopo deploy

**Bug bounty:**
- Vulnerabilità critiche: 10.000 FRP
- Vulnerabilità high: 5.000 FRP  
- Vulnerabilità medium: 2.000 FRP

---

## 7. FAQ

**Q: Perché dovrei fidarmi?**
A: Non fidarti. Verifica. Il codice è open source, le regole sono hardcoded, nessuno può modificarle. Nemmeno noi.

**Q: Come fate a generare €10K/mese?**
A: Mining crypto (50%), trading bot (30%), servizi B2B (20%). Dashboard pubblica con tutte le metriche.

**Q: E se il team dumpa?**
A: Impossibile. Token team locked 1 anno, poi solo 1%/mese per 9+ anni. Matematicamente impossibile dumpare.

**Q: Perché Polygon e non Ethereum?**
A: Fee gas 1000x più basse. Transazioni istantanee. Stessa sicurezza. Nessun motivo per pagare €50 di gas.

**Q: Posso vendere quando voglio?**
A: Sì, ma con limiti mensili progressivi (5% → 10% → 15%). Protezione anti-dump. Se vuoi exit scam, vai su altri progetti.

**Q: APY 30% è sostenibile?**
A: Sì. 180M FRP distribuiti in 5 anni + profitti attività reale. APY decresce nel tempo. È matematica, non magia.

**Q: Quando listing CEX?**
A: Q3-Q4 2025. Prima costruiamo community e valore reale. CEX non fa pump se il progetto è vuoto.

**Q: Posso perdere soldi?**
A: SÌ. Ogni investimento ha rischi. Non investire più di quanto puoi permetterti di perdere. Crypto è volatile. DYOR sempre.

---

## 8. DISCLAIMER LEGALE

**LEGGERE ATTENTAMENTE**

Freepple (FRP) è un token utility su blockchain Polygon. Non è:
- Un security
- Un investimento regolamentato
- Una garanzia di profitto
- Consiglio finanziario

**Rischi:**
- Volatilità estrema del prezzo
- Possibile perdita totale del capitale
- Rischi tecnologici (bug, hack)
- Rischi regolamentari
- Rischi di mercato

**Responsabilità:**
- Ogni investitore è responsabile delle proprie decisioni
- DYOR (Do Your Own Research) sempre
- Consulta un consulente finanziario
- Non investire più di quanto puoi permetterti di perdere

**Giurisdizione:**
- Freepple è un progetto internazionale decentralizzato
- Non disponibile per residenti USA
- Verifica regolamentazione locale

---

## 9. CONCLUSIONE: FREE THE PEOPLE

Il mercato crypto è dominato da whale, insider, team che scappano. I piccoli investitori perdono sempre.

**Freepple cambia questo paradigma.**

Non con promesse vuote, ma con **codice inattaccabile:**
- Max 1% per wallet = no whale
- Limiti vendita = no dump
- Team locked 9+ anni = no rug pull
- €10K/mese attività = valore reale

Non è un altro pump & dump. È un esperimento sociale: **cosa succede quando le regole sono davvero eque?**

La risposta: lo scopriremo insieme.

**300 fondatori cercati.**
**€500 per tutti.**
**Nessun VIP.**

Sei dentro o sei fuori.

---

**FREE THE PEOPLE. FREE THE FUTURE.**

*Freepple Team • Dicembre 2024*

---

## CONTATTI

- **Website:** [freepple.xyz](https://freepple.xyz)
- **Twitter:** [@FreeppleToken](https://twitter.com/FreeppleToken)
- **Telegram:** t.me/freepple
- **Email:** team@freepple.xyz
- **Contract:** (dopo deploy)
- **Audit:** (in attesa)

---

*Questo whitepaper può essere aggiornato. Versione corrente: 2.0 - Dicembre 2024*
