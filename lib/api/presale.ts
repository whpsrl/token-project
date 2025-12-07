import { supabase, PresaleContribution } from '@/lib/supabase'

export async function createPresaleContribution(
  userId: string,
  walletAddress: string,
  amountUsdt: number,
  referralCode?: string
) {
  const amountFrp = amountUsdt * 1000 // €0.001 per FRP
  const bonusFrp = amountFrp * 0.2 // 20% bonus

  const { data, error } = await supabase
    .from('presale_contributions')
    .insert({
      user_id: userId,
      wallet_address: walletAddress,
      amount_usdt: amountUsdt,
      amount_frp: amountFrp,
      bonus_frp: bonusFrp,
      referral_code: referralCode,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function confirmPresaleContribution(
  contributionId: string,
  transactionHash: string
) {
  const { data, error } = await supabase
    .from('presale_contributions')
    .update({
      status: 'confirmed',
      transaction_hash: transactionHash,
      confirmed_at: new Date().toISOString()
    })
    .eq('id', contributionId)
    .select()
    .single()

  if (error) throw error

  // Se ha referral code, aggiorna earnings
  if (data.referral_code) {
    const { data: referrer } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', data.referral_code)
      .single()

    if (referrer) {
      // TODO: Chiamare updateReferralEarnings
    }
  }

  return data
}

export async function getPresaleStats() {
  const { data: contributions, error } = await supabase
    .from('presale_contributions')
    .select('*')
    .eq('status', 'confirmed')

  if (error) throw error

  const totalRaised = contributions?.reduce((sum, c) => sum + c.amount_usdt, 0) || 0
  const participants = new Set(contributions?.map(c => c.user_id)).size

  return {
    totalRaised,
    participants,
    contributions: contributions || []
  }
}

export async function getUserPresaleStatus(userId: string): Promise<PresaleContribution | null> {
  const { data, error } = await supabase
    .from('presale_contributions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) return null
  return data
}


