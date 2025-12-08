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

  // Crea record in tabella users usando funzione SECURITY DEFINER (bypassa RLS)
  const { data: userData, error: userError } = await supabase.rpc('create_user_profile', {
    p_id: authData.user!.id,
    p_email: email,
    p_nome: nome || null,
    p_cognome: cognome || null,
    p_referral_code: userReferralCode,
    p_referred_by: referralCode || null,
  })

  if (userError) {
    console.error('Error creating user profile:', userError)
    throw userError
  }
  
  // La funzione restituisce un array con un oggetto
  const user = Array.isArray(userData) && userData.length > 0 ? userData[0] : userData

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
        referred_id: user.id,
        level: 1,
      })
    }
  }

  return user
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
  // Usa funzione SECURITY DEFINER per bypassare RLS
  const { data, error } = await supabase.rpc('update_user_wallet', {
    p_user_id: userId,
    p_wallet_address: walletAddress,
  })

  if (error) {
    console.error('Error updating wallet:', error)
    throw error
  }
  
  // La funzione restituisce un array con un oggetto
  return Array.isArray(data) && data.length > 0 ? data[0] : data
}

