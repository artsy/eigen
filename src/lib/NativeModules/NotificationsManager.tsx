import { NativeEventEmitter } from "react-native"
import { ArtsyNativeModules } from "./ArtsyNativeModules"

export const NotificationsManager = new NativeEventEmitter(ArtsyNativeModules.ARNotificationsManager as any)
