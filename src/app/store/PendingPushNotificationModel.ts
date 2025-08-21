import { action, Action } from "easy-peasy"

export interface PendingPushNotification {
  id: string
  foreground: boolean
  userInteraction: boolean
  message: string | null
  data: any
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
