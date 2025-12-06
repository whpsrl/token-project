import { supabase } from '../supabase'

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

  const { error } = await supabase
    .from('referrals')
    .update({
      total_earned: supabase.raw(`total_earned + ${earned}`)
    })
    .eq('referrer_id', referrerId)
    .eq('referred_id', referredId)

  if (error) throw error

  // Aggiorna anche rank earnings
  await supabase
    .from('user_ranks')
    .upsert({
      user_id: referrerId,
      total_earned: supabase.raw(`total_earned + ${earned}`)
    }, {
      onConflict: 'user_id'
    })
}

