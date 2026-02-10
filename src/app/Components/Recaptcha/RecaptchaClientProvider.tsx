import { Recaptcha, type RecaptchaClient } from "@google-cloud/recaptcha-enterprise-react-native"
import Keys from "react-native-keys"

let cachedClient: RecaptchaClient | null = null
let initPromise: Promise<RecaptchaClient> | null = null

async function initializeClient(isStaging: boolean) {
  const siteKey = isStaging
    ? Keys.secureFor("RECAPTCHA_KEY_STAGING")
    : Keys.secureFor("RECAPTCHA_KEY_PRODUCTION")

  return await Recaptcha.fetchClient(siteKey as string)
}

export async function getRecaptchaClient(isStaging: boolean) {
  if (cachedClient) {
    return cachedClient
  }

  if (initPromise) {
    return initPromise
  }

  initPromise = initializeClient(isStaging)
  cachedClient = await initPromise
  initPromise = null

  return cachedClient
}

export function resetRecaptchaClient(): void {
  cachedClient = null
  initPromise = null
}
