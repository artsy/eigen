import { NativeEvent } from "app/store/NativeModel"
import { NativeEventEmitter } from "react-native"
import { LegacyNativeModules } from "./LegacyNativeModules"

export const NotificationsManager = new NativeEventEmitter<{ event: [NativeEvent] }>(
  LegacyNativeModules.ARNotificationsManager as any
)
