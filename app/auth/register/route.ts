import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Inizializza Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role per bypass RLS
)

// Rate limiting in-memory (in produzione usa Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Verifica reCAPTCHA
async function verifyCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured')
    return true // In dev, bypassa
  }

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    )

    const data = await response.json()
    
    // reCAPTCHA v3: verifica score (> 0.5 = umano)
    if (data.success && data.score > 0.5) {
      return true
    }

    console.warn('reCAPTCHA failed:', data)
    return false
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}

// Rate limiting check
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    // Reset o primo accesso
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 ora
    })
    return true
  }

  if (limit.count >= 5) {
    // Max 5 registrazioni per IP in 1 ora
    return false
  }

  limit.count++
  return true
}

// Validazione email
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validazione wallet
function validateWallet(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export async function POST(request: NextRequest) {
  try {
    // Get IP per rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Troppi tentativi. Riprova tra 1 ora.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      walletAddress,
      referralCode,
      acceptTerms,
      acceptPrivacy,
      newsletter,
      website, // honeypot
      captchaToken,
      timestamp,
      userAgent,
    } = body

    // ANTIBOT: Honeypot check
    if (website && website !== '') {
      console.warn('Bot detected: honeypot filled')
      // Ritorna successo falso senza dare info al bot
      return NextResponse.json(
        { error: 'Errore di validazione' },
        { status: 400 }
      )
    }

    // ANTIBOT: Timestamp check (submit troppo veloce)
    if (timestamp) {
      const submitTime = Date.now() - timestamp
      if (submitTime < 5000) {
        // Meno di 5 secondi = probabile bot
        return NextResponse.json(
          { error: 'Invio troppo veloce. Riprova.' },
          { status: 400 }
        )
      }
    }

    // ANTIBOT: Verifica reCAPTCHA
    if (captchaToken) {
      const captchaValid = await verifyCaptcha(captchaToken)
      if (!captchaValid) {
        return NextResponse.json(
          { error: 'Verifica captcha fallita. Riprova.' },
          { status: 400 }
        )
      }
    }

    // Validazione campi obbligatori
    if (!firstName || !lastName || !email || !walletAddress) {
      return NextResponse.json(
        { error: 'Tutti i campi obbligatori devono essere compilati' },
        { status: 400 }
      )
    }

    // Validazione formato
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      )
    }

    if (!validateWallet(walletAddress)) {
      return NextResponse.json(
        { error: 'Wallet address non valido' },
        { status: 400 }
      )
    }

    if (!acceptTerms || !acceptPrivacy) {
      return NextResponse.json(
        { error: 'Devi accettare termini e privacy policy' },
        { status: 400 }
      )
    }

    // Check email duplicata
    const { data: existingEmail } = await supabase
      .from('presale_registrations')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Questa email è già registrata' },
        { status: 400 }
      )
    }

    // Check wallet duplicato
    const { data: existingWallet } = await supabase
      .from('presale_registrations')
      .select('id')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single()

    if (existingWallet) {
      return NextResponse.json(
        { error: 'Questo wallet è già registrato' },
        { status: 400 }
      )
    }

    // Calcola token amount
    const baseTokens = 500000 // 500K FRP base
    const bonusTokens = referralCode ? 100000 : 0 // +100K se referral
    const totalTokens = baseTokens + bonusTokens

    // Inserisci registrazione
    const { data: registration, error: insertError } = await supabase
      .from('presale_registrations')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        wallet_address: walletAddress.toLowerCase(),
        referral_code: referralCode || null,
        token_amount: totalTokens,
        accept_terms: acceptTerms,
        accept_privacy: acceptPrivacy,
        newsletter: newsletter,
        ip_address: ip,
        user_agent: userAgent,
        status: 'pending', // pending, paid, confirmed, cancelled
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Errore durante la registrazione. Riprova.' },
        { status: 500 }
      )
    }

    // TODO: Invia email con istruzioni pagamento
    // await sendPaymentInstructionsEmail(email, registration.id)

    // Log per analytics
    console.log('New registration:', {
      id: registration.id,
      email: email,
      tokens: totalTokens,
      referral: !!referralCode,
    })

    return NextResponse.json({
      success: true,
      message: 'Registrazione completata con successo',
      data: {
        registrationId: registration.id,
        tokenAmount: totalTokens,
        email: email,
      },
    })

  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// GET: Stats pubbliche (opzionale)
export async function GET() {
  try {
    // Count registrazioni totali
    const { count } = await supabase
      .from('presale_registrations')
      .select('*', { count: 'exact', head: true })

    // Calcola totale raccolto
    const { data: registrations } = await supabase
      .from('presale_registrations')
      .select('status')
      .in('status', ['paid', 'confirmed'])

    const totalRaised = (registrations?.length || 0) * 500

    return NextResponse.json({
      totalRegistrations: count || 0,
      totalRaised: totalRaised,
      spotsRemaining: Math.max(0, 300 - (count || 0)),
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero statistiche' },
      { status: 500 }
    )
  }
}
