import { Notification } from "@notifee/react-native"
import { action, Action } from "easy-peasy"

export interface PendingPushNotification extends Notification {
  tappedAt: number
  finish?: () => {}
}

export interface PendingPushNotificationModel {
  notification: Notification | null
  setPendingPushNotification: Action<this, Notification | null>
}

export const getPendingPushNotificationModel = (): PendingPushNotificationModel => ({
  notification: null,
  setPendingPushNotification: action((state, notification) => {
    state.notification = notification
  }),
})
