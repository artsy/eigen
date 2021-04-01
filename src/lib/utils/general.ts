import { GlobalStoreModel } from "lib/store/GlobalStoreModel"
import { Platform } from "react-native"

export const is__DEV__ = () => __DEV__

export const isArtsyUser = (email: string) => email.endsWith("@artsymail.com") || email.endsWith("@artsy.net")

export const userEmail = (store: GlobalStoreModel) => {
  if (Platform.OS === "ios") return store.native.sessionState.userEmail
  else if (Platform.OS === "android") return store.auth.userID
  return null
}
