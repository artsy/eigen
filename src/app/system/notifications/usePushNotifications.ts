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
 */
export const usePushNotifications = () => {
  const [pushNotification, setPushNotification] = useState<PushNotification | null>(null)

  // Preprare Android notifications channels
  // eslint-disable-next-line react-hooks/rules-of-hooks
  Platform.OS === "android" && useAndroidCreatePushNotificationChannels()

  // Fetch token and save it to our backend
  useRegisterForPushNotifications()

  // Listen to FCM messages
  // eslint-disable-next-line react-hooks/rules-of-hooks
  Platform.OS === "android" && useAndroidListenToPushNotifications({ setPushNotification })

  // Listen to APNS messages
  // eslint-disable-next-line react-hooks/rules-of-hooks
  Platform.OS === "ios" && useIOSListenToPushNotifications({ setPushNotification })

  // Handle the push notification
  useHandlePushNotifications({ pushNotification, setPushNotification })
}
