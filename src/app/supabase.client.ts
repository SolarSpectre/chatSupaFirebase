import { createClient } from '@supabase/supabase-js'

const supabase_url = ''
const anon_key = ''
export const supabase = createClient(supabase_url, anon_key)