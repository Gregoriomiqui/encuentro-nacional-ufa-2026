import { createClient } from '@supabase/supabase-js'
import { env } from '@shared/config/env'

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).')
}

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey)
