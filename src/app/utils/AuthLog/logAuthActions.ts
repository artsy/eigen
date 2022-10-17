import AsyncStorage from "@react-native-async-storage/async-storage"

const authActions: Array<{ label: string; data: string }> = []
const authStorageKey = "AUTH_LOG_KEY"

export function logAuthAction(label: string, data: string) {
  console.log("Logging auth action", { label, data })
  authActions.concat([{ label, data }])
}

export function storeAuthActions() {
  const authJSON = JSON.stringify(authActions)
  AsyncStorage.setItem(authStorageKey, authJSON)
}

export async function readAuthActions() {
  const authJSON = await AsyncStorage.getItem(authStorageKey)
  return authJSON
}
