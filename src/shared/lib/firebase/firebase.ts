import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

import { env } from '@shared/config/env'

const REQUIRED_FIREBASE_FIELDS = [
  env.firebaseApiKey,
  env.firebaseAuthDomain,
  env.firebaseProjectId,
  env.firebaseAppId,
]

export function isFirebaseConfigured() {
  return REQUIRED_FIREBASE_FIELDS.every((value) => Boolean(value))
}

function getFirebaseConfig() {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Faltan variables de entorno de Firebase. Define VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID y VITE_FIREBASE_APP_ID.',
    )
  }

  return {
    apiKey: env.firebaseApiKey,
    authDomain: env.firebaseAuthDomain,
    projectId: env.firebaseProjectId,
    appId: env.firebaseAppId,
    messagingSenderId: env.firebaseMessagingSenderId || undefined,
    storageBucket: env.firebaseStorageBucket || undefined,
  }
}

export function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApp()
  }

  return initializeApp(getFirebaseConfig())
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp())
}
