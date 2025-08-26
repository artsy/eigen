import { useAndroidCreatePushNotificationChannels } from "app/system/notifications/useAndroidCreatePushNotificationChannels"
import { useAndroidListenToFCMMessages } from "app/system/notifications/useAndroidListenToFCMMessages"
import { useHandlePushNotifications } from "app/system/notifications/useHandlePushNotifications"
import { useRegisterForPushNotifications } from "app/system/notifications/useRegisterForRemoteMessages"

/**
 * This hook is used to handle push notifications and display them
 * It does the following:
 * - Creates the Android notification channels
 * - Registers the device with FCM
 * - Listens to remote messages
 * - Handles remote messages
 */
export const usePushNotifications = () => {
  useAndroidCreatePushNotificationChannels()
  useRegisterForPushNotifications()
  useAndroidListenToFCMMessages()
  useHandlePushNotifications()
}
