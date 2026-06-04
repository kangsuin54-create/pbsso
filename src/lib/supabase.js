import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://agkktjwpiwykyhencnkw.supabase.co'
const SUPABASE_KEY = 'sb_publishable_IJmNZEt3j5ZNgEOXiP_TLA_bzKycR7l'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)