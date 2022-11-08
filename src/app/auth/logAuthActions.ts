import { addBreadcrumb, captureException, Exception } from "@sentry/react-native"

export function logAuthAction(label: string, data: string) {
  console.log("Logging auth action", { label, data })
  addBreadcrumb({ message: label, category: "auth", data: { authData: data } })
}

export function reportAuthFailure(value: string) {
  const authException: Exception = { type: "AUTH_FAILURE", value }
  captureException(authException)
}
