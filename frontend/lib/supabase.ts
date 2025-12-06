import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  email: string
  nome?: string
  cognome?: string
  wallet_address?: string
  referral_code: string
  referred_by?: string
  created_at: string
}

export interface PresaleContribution {
  id: string
  user_id: string
  wallet_address: string
  amount_usdt: number
  amount_frp: number
  bonus_frp: number
  referral_code?: string
  transaction_hash?: string
  status: 'pending' | 'confirmed' | 'failed'
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  level: number
  total_earned: number
}

export interface AirdropTask {
  id: string
  user_id: string
  task_type: string
  completed: boolean
  points: number
  verified_at?: string
}

export interface UserRank {
  id: string
  user_id: string
  rank: 'bronze' | 'silver' | 'gold' | 'diamond' | 'ambassador'
  level1_referrals: number
  level2_referrals: number
  total_earned: number
}

