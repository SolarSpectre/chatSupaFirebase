import { createClient } from '@supabase/supabase-js'

const supabase_url = 'https://ndwwubxxjcixchomnbxj.supabase.co'
const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kd3d1Ynh4amNpeGNob21uYnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODA5NjEsImV4cCI6MjA2NDU1Njk2MX0.GZdXUynHvcpkoFzy3sQhWKDX_B8YiENWj80-UwuliLM'
export const supabase = createClient(supabase_url, anon_key)