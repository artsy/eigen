import { NativeEventEmitter } from "react-native"
import { LegacyNativeModules } from "./LegacyNativeModules"

export const NotificationsManager = new NativeEventEmitter(
  LegacyNativeModules.ARNotificationsManager as any
)
