import { NativeEventEmitter, NativeModules } from "react-native"
const { ARNotificationsManager } = NativeModules

export const NotificationsManager = new NativeEventEmitter(ARNotificationsManager as any)
