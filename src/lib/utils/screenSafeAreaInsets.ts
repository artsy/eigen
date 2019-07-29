import { NativeModules } from "react-native"

const { RNStaticSafeAreaInsets } = NativeModules

export const screenSafeAreaInsets = RNStaticSafeAreaInsets as {
  top: number
  bottom: number
  left: number
  right: number
}
