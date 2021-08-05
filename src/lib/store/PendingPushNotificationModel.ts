import { action, Action } from "easy-peasy"
import { ReceivedNotification } from "react-native-push-notification"

export interface PendingPushNotification extends Omit<ReceivedNotification, "userInfo" | "finish"> {
  tappedAt: number
  finish?: () => {}
}

export interface PendingPushNotificationModel {
  ios: PendingPushNotification | null
  android: PendingPushNotification | null
  setPendingPushNotification: Action<
    this,
    { platform: "ios" | "android"; notification: PendingPushNotification | null }
  >
}

export const getPendingPushNotificationModel = (): PendingPushNotificationModel => ({
  ios: null,
  android: null,
  setPendingPushNotification: action((state, notifObject) => {
    state[notifObject.platform] = notifObject.notification
  }),
})
