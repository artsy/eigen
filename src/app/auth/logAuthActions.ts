import { addBreadcrumb, captureException, Exception } from "@sentry/react-native"

export const FB_KEY = "AUTH_FACEBOOK"
export const APPLE_KEY = "AUTH_APPLE"
export const GOOGLE_KEY = "AUTH_GOOGLE"

type AUTH_KEY = typeof FB_KEY | typeof APPLE_KEY | typeof GOOGLE_KEY

export function fbAction(label: string, data: string) {
  logAuthAction(FB_KEY, label, data)
}

export function googleAction(label: string, data: string) {
  logAuthAction(GOOGLE_KEY, label, data)
}

export function appleAction(label: string, data: string) {
  logAuthAction(GOOGLE_KEY, label, data)
}

export function logAuthAction(key: AUTH_KEY, label: string, data: string) {
  console.log("Logging auth action", { label, data })
  addBreadcrumb({ message: key + label, category: "auth", data: { authData: data } })
}

export function reportAuthFailure(value: string) {
  const authException: Exception = { type: "AUTH_FAILURE", value }
  captureException(authException)
}
