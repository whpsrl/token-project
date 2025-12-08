-- ============================================================================
-- FREEPPLE TRIGGERS - Execute AFTER database-schema-complete.sql
-- ============================================================================

-- ============================================================================
-- TRIGGER 1: Auto-create presale_registrations after auth signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet TEXT;
  v_referral_code TEXT;
  v_referred_by TEXT;
BEGIN
  -- Extract wallet_address from metadata
  v_wallet := NEW.raw_user_meta_data->>'wallet_address';
  
  -- Extract referred_by from metadata
  v_referred_by := NEW.raw_user_meta_data->>'referred_by';
  
  -- Skip if no wallet_address
  IF v_wallet IS NULL THEN
    RAISE NOTICE 'No wallet_address in metadata for user %', NEW.id;
    RETURN NEW;
  END IF;
  
  -- Generate referral code (8 chars uppercase)
  v_referral_code := UPPER(SUBSTRING(v_wallet, 3, 8));
  
  -- Insert into presale_registrations
  INSERT INTO public.presale_registrations (
    user_id,
    wallet_address,
    email,
    my_referral_code,
    referred_by,
    status,
    email_verified,
    created_at
  )
  VALUES (
    NEW.id,
    v_wallet,
    NEW.email,
    v_referral_code,
    v_referred_by,
    'pending',
    false,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    wallet_address = EXCLUDED.wallet_address,
    my_referral_code = EXCLUDED.my_referral_code,
    updated_at = NOW();
  
  RAISE NOTICE 'Created presale_registration for user % (wallet: %)', NEW.id, v_wallet;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- TRIGGER 2: Auto-update referral_stats when new registration
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_referral_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referrer_wallet TEXT;
  v_referral_count INTEGER;
  v_new_rank TEXT;
BEGIN
  -- Only process if there's a referrer
  IF NEW.referred_by IS NOT NULL THEN
    -- Find referrer's wallet address
    SELECT wallet_address INTO v_referrer_wallet
    FROM presale_registrations
    WHERE my_referral_code = NEW.referred_by
    LIMIT 1;
    
    IF v_referrer_wallet IS NOT NULL THEN
      -- Count total referrals for this referrer
      SELECT COUNT(*) INTO v_referral_count
      FROM presale_registrations
      WHERE referred_by = NEW.referred_by;
      
      -- Determine rank based on referral count
      v_new_rank := CASE
        WHEN v_referral_count >= 100 THEN 'diamond'
        WHEN v_referral_count >= 50 THEN 'gold'
        WHEN v_referral_count >= 20 THEN 'silver'
        ELSE 'bronze'
      END;
      
      -- Insert or update referral_stats
      INSERT INTO referral_stats (
        wallet_address,
        total_referrals,
        direct_referrals,
        rank,
        updated_at
      )
      VALUES (
        v_referrer_wallet,
        v_referral_count,
        v_referral_count, -- For now, all are direct
        v_new_rank,
        NOW()
      )
      ON CONFLICT (wallet_address) DO UPDATE SET
        total_referrals = EXCLUDED.total_referrals,
        direct_referrals = EXCLUDED.direct_referrals,
        rank = EXCLUDED.rank,
        updated_at = NOW();
      
      RAISE NOTICE 'Updated referral stats for % (count: %, rank: %)', 
        v_referrer_wallet, v_referral_count, v_new_rank;
    END IF;
  END IF;
  
  -- Always create referral_stats entry for new user (with 0 referrals)
  INSERT INTO referral_stats (
    wallet_address,
    total_referrals,
    direct_referrals,
    rank
  )
  VALUES (
    NEW.wallet_address,
    0,
    0,
    'bronze'
  )
  ON CONFLICT (wallet_address) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_registration_update_referral_stats ON presale_registrations;

-- Create trigger
CREATE TRIGGER on_registration_update_referral_stats
  AFTER INSERT ON presale_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_referral_stats();

-- ============================================================================
-- Grant permissions
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_referral_stats() TO authenticated, service_role;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify triggers exist
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  OR event_object_schema = 'auth'
ORDER BY event_object_table, trigger_name;

-- Verify functions exist
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'update_referral_stats')
ORDER BY routine_name;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$ 
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Triggers created successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Active triggers:';
  RAISE NOTICE '  1. on_auth_user_created';
  RAISE NOTICE '     → Auto-creates presale_registration';
  RAISE NOTICE '  2. on_registration_update_referral_stats';
  RAISE NOTICE '     → Auto-updates referral stats';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Test registration via API';
  RAISE NOTICE '  2. Check presale_registrations table';
  RAISE NOTICE '  3. Check referral_stats table';
  RAISE NOTICE '========================================';
END $$;
