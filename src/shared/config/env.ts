function parseBooleanEnv(value: string | undefined): boolean {
  if (!value) {
    return false
  }

  const normalized = value.trim().toLowerCase()
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on'
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  makeWebhookUrl: import.meta.env.VITE_MAKE_WEBHOOK_URL ?? '',
  makeWebhookApiKey: import.meta.env.VITE_MAKE_API_KEY ?? '',
  makeFailedValidationPath: import.meta.env.VITE_MAKE_FAILED_VALIDATION_PATH ?? '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  supabaseWorkshopsAmTable: import.meta.env.VITE_SUPABASE_WORKSHOPS_AM_TABLE ?? '',
  supabaseWorkshopsPmTable: import.meta.env.VITE_SUPABASE_WORKSHOPS_PM_TABLE ?? '',
  isMaintenance: parseBooleanEnv(import.meta.env.VITE_IS_MAINTENANCE),
  firebaseApiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  firebaseAuthDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  firebaseAppId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  firebaseMessagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  firebaseStorageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
} as const
