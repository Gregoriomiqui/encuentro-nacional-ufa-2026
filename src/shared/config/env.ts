export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  makeWebhookUrl: import.meta.env.VITE_MAKE_WEBHOOK_URL ?? '',
  makeWebhookApiKey: import.meta.env.VITE_MAKE_API_KEY ?? '',
} as const
