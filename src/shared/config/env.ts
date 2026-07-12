export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  makeWebhookUrl: import.meta.env.VITE_MAKE_WEBHOOK_URL ?? '',
  makeWebhookApiKey: import.meta.env.VITE_MAKE_API_KEY ?? '',
  makeFailedValidationPath: import.meta.env.VITE_MAKE_FAILED_VALIDATION_PATH ?? '',
  firebaseApiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  firebaseAuthDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  firebaseAppId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  firebaseMessagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  firebaseStorageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
} as const
