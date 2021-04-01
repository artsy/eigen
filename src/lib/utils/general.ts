import { GlobalStoreModel } from "lib/store/GlobalStoreModel"
import { Platform } from "react-native"

export const is__DEV__ = () => __DEV__

export const isDevOrArtsyUser = (store: GlobalStoreModel) => {
  if (is__DEV__()) return true

  const userEmail = (() => {
    if (Platform.OS === "ios") {
      return store.native.sessionState.userEmail
    } else if (Platform.OS === "android") {
      return store.auth.userID
    }

    return null
  })()
  if (userEmail !== null && (userEmail.endsWith("@artsymail.com") || userEmail.endsWith("@artsy.net"))) {
    return true
  }

  return false
}
