// eslint-disable-next-line no-restricted-imports
import "app/system/notifications/testNotification" // Import to register global test function
import { useCreateAndroidNotificationChannels } from "app/system/notifications/useCreateAndroidChannels"
import { useHandleRemoteMessages } from "app/system/notifications/useHandleRemoteMessages"
import { useListenToRemoteMessages } from "app/system/notifications/useListenToRemoteMessages"
import { useRegisterForRemoteMessages } from "app/system/notifications/useRegisterForRemoteMessages"

/**
 * This hook is used to handle push notifications and display them
 * It does the following:
 * - Creates the Android notification channels
 * - Registers the device with FCM
 * - Listens to remote messages
 * - Handles remote messages
 */
export const usePushNotifications = () => {
  useCreateAndroidNotificationChannels()
  useRegisterForRemoteMessages()
  useListenToRemoteMessages()
  useHandleRemoteMessages()
}
