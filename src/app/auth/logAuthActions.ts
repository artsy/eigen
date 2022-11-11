import { addBreadcrumb, captureMessage } from "@sentry/react-native"

export const FB_KEY = "A0TH_FACEBOOK"
export const APPLE_KEY = "A0TH_APPLE"
export const GOOGLE_KEY = "A0TH_GOOGLE"

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
  addBreadcrumb({ message: key + ": " + label, category: "auth", data: { authData: data } })
}

export function reportAuthFailure(value: string) {
  console.log("Reporting auth failure", value)
  captureMessage("AUTH_FAILURE: " + value)
}
