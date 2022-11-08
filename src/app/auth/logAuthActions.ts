import AsyncStorage from "@react-native-async-storage/async-storage"

let authActions: Array<{ label: string; data: string }> = []
const authStorageKey = "AUTH_LOG_KEY"

export function logAuthAction(label: string, data: string) {
  console.log("Logging auth action", { label, data })
  authActions = authActions.concat([{ label, data }])
  console.log("Current auth actions", authActions)
  const authJSON = JSON.stringify(authActions)
  AsyncStorage.setItem(authStorageKey, authJSON)
}

export async function readAuthActions(): Promise<string | null> {
  const authJSON = await AsyncStorage.getItem(authStorageKey)
  console.log("Got auth json ", authJSON)
  return authJSON
}

export function clearAuthActions() {
  AsyncStorage.removeItem(authStorageKey)
}
