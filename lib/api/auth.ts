import { supabase, User } from '@/lib/supabase'

export async function register(email: string, password: string, nome: string, cognome: string, referralCode?: string) {
  // Genera referral code unico
  const userReferralCode = 'FRP-' + Math.random().toString(36).substr(2, 9).toUpperCase()

  // Crea utente in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  // Crea record in tabella users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user!.id,
      email,
      nome,
      cognome,
      referral_code: userReferralCode,
      referred_by: referralCode || null,
    })
    .select()
    .single()

  if (userError) throw userError

  // Se ha referral code, crea record referral
  if (referralCode) {
    const { data: referrer } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single()

    if (referrer) {
      await supabase.from('referrals').insert({
        referrer_id: referrer.id,
        referred_id: userData.id,
        level: 1,
      })
    }
  }

  return userData
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data
}

export async function updateWalletAddress(userId: string, walletAddress: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ wallet_address: walletAddress })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

