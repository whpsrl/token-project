-- FREEPPLE DATABASE SCHEMA
-- Supabase PostgreSQL

-- Estensioni
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabella Utenti
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(100),
  cognome VARCHAR(100),
  cellulare VARCHAR(20),
  wallet_address VARCHAR(255) UNIQUE,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_by VARCHAR(20), -- referral_code di chi l'ha invitato
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Presale
CREATE TABLE presale_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wallet_address VARCHAR(255) NOT NULL,
  amount_usdt DECIMAL(18, 2) NOT NULL,
  amount_frp DECIMAL(18, 2) NOT NULL,
  bonus_frp DECIMAL(18, 2) NOT NULL,
  referral_code VARCHAR(20),
  transaction_hash VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, failed
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP
);

-- Tabella Referral
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL, -- 1 o 2
  total_earned DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- Tabella Airdrop
CREATE TABLE airdrop_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_type VARCHAR(50) NOT NULL, -- email, twitter, like, retweet, telegram
  completed BOOLEAN DEFAULT FALSE,
  points INTEGER NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, task_type)
);

-- Tabella Rank
CREATE TABLE user_ranks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rank VARCHAR(20) NOT NULL, -- bronze, silver, gold, diamond, ambassador
  level1_referrals INTEGER DEFAULT 0,
  level2_referrals INTEGER DEFAULT 0,
  total_earned DECIMAL(18, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabella Staking
CREATE TABLE staking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(18, 2) NOT NULL,
  lock_period INTEGER, -- mesi di lock (null = no lock)
  apy_bonus DECIMAL(5, 2) DEFAULT 0, -- bonus APY per lock
  staked_at TIMESTAMP DEFAULT NOW(),
  unstaked_at TIMESTAMP,
  UNIQUE(user_id)
);

-- Indici per performance
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
CREATE INDEX idx_presale_user_id ON presale_contributions(user_id);
CREATE INDEX idx_presale_status ON presale_contributions(status);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_airdrop_user ON airdrop_tasks(user_id);

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_ranks_updated_at BEFORE UPDATE ON user_ranks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

