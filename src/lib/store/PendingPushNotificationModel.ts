import { action, Action } from "easy-peasy"
import { ReceivedNotification } from "react-native-push-notification"

export interface PendingPushNotification extends Omit<ReceivedNotification, "userInfo" | "finish"> {
  tappedAt: number
  finish?: () => {}
}

export interface PendingPushNotificationModel {
  notification: PendingPushNotification | null
  setPendingPushNotification: Action<this, PendingPushNotification | null>
}

export const getPendingPushNotificationModel = (): PendingPushNotificationModel => ({
  notification: null,
  setPendingPushNotification: action((state, notification) => {
    state.notification = notification
  }),
})
