import { useAndroidCreatePushNotificationChannels } from "app/system/notifications/useAndroidCreatePushNotificationChannels"
import { useAndroidListenToPushNotifications } from "app/system/notifications/useAndroidListenToPushNotifications"
import { useHandlePushNotifications } from "app/system/notifications/useHandlePushNotifications"
import { useIOSListenToPushNotifications } from "app/system/notifications/useIOSListenToPushNotifications"
import { useRegisterForPushNotifications } from "app/system/notifications/useRegisterForRemoteMessages"
import { useState } from "react"
import { Platform } from "react-native"

export type PushNotification = {
  label: string | null | undefined
  url: string | null | undefined
  message: string | null | undefined
  data: any
}

/**
 * This hook is used to handle push notifications and displaying them
 * It does the following:
 * - Creates the Android notifications channels
 * - Registers the device for push notifications
 * - Listens to push notifications
 * - Handles the push notification
 */
export const usePushNotifications = () => {
  const [pushNotification, setPushNotification] = useState<PushNotification | null>(null)

  useAndroidCreatePushNotificationChannels()
  useRegisterForPushNotifications()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  Platform.OS === "android" && useAndroidListenToPushNotifications({ setPushNotification })
  // eslint-disable-next-line react-hooks/rules-of-hooks
  Platform.OS === "ios" && useIOSListenToPushNotifications({ setPushNotification })
  useHandlePushNotifications({ pushNotification, setPushNotification })
}
