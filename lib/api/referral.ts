import { supabase } from '@/lib/supabase'

export async function getReferralStats(userId: string) {
  const { data: referrals, error } = await supabase
    .from('referrals')
    .select(`
      *,
      referred:users!referrals_referred_id_fkey(id, email, referral_code)
    `)
    .eq('referrer_id', userId)

  if (error) throw error

  const level1 = referrals?.filter(r => r.level === 1) || []
  const level2 = referrals?.filter(r => r.level === 2) || []

  // Calcola rank
  const rank = calculateRank(level1.length, level2.length)

  return {
    level1: level1.length,
    level2: level2.length,
    total: referrals?.length || 0,
    totalEarned: referrals?.reduce((sum, r) => sum + (r.total_earned || 0), 0) || 0,
    rank,
    referrals: referrals || []
  }
}

function calculateRank(level1: number, level2: number): string {
  if (level1 >= 500 && level2 >= 2000) return 'ambassador'
  if (level1 >= 150 && level2 >= 500) return 'diamond'
  if (level1 >= 50 && level2 >= 150) return 'gold'
  if (level1 >= 20 && level2 >= 50) return 'silver'
  if (level1 >= 5) return 'bronze'
  return 'none'
}

export async function updateReferralEarnings(referrerId: string, referredId: string, amount: number, level: number) {
  const commission = level === 1 ? 0.03 : 0.01
  const earned = amount * commission

  // Leggi il valore corrente del referral
  const { data: referral, error: referralError } = await supabase
    .from('referrals')
    .select('total_earned')
    .eq('referrer_id', referrerId)
    .eq('referred_id', referredId)
    .single()

  if (referralError && referralError.code !== 'PGRST116') throw referralError

  const currentEarned = referral?.total_earned || 0
  const newTotalEarned = currentEarned + earned

  // Aggiorna il referral
  const { error: updateError } = await supabase
    .from('referrals')
    .update({
      total_earned: newTotalEarned
    })
    .eq('referrer_id', referrerId)
    .eq('referred_id', referredId)

  if (updateError) throw updateError

  // Leggi il valore corrente del rank
  const { data: rank, error: rankError } = await supabase
    .from('user_ranks')
    .select('total_earned')
    .eq('user_id', referrerId)
    .single()

  if (rankError && rankError.code !== 'PGRST116') throw rankError

  const currentRankEarned = rank?.total_earned || 0
  const newRankTotalEarned = currentRankEarned + earned

  // Aggiorna anche rank earnings
  const { error: rankUpdateError } = await supabase
    .from('user_ranks')
    .upsert({
      user_id: referrerId,
      total_earned: newRankTotalEarned
    }, {
      onConflict: 'user_id'
    })

  if (rankUpdateError) throw rankUpdateError
}


