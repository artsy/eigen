import notifee, { AuthorizationStatus } from "@notifee/react-native"
import { Platform } from "react-native"

/**
 * Test utility to display a local notification
 * This helps verify that the notification system is working
 */
export const displayTestNotification = async () => {
  try {
    console.log("DEBUG: Testing local notification display...")

    // Check permissions first
    const settings = await notifee.getNotificationSettings()

    if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
      console.log("DEBUG: Cannot display test notification - not authorized")
      return false
    }

    // Display test notification
    await notifee.displayNotification({
      title: "Test Notification",
      body: "This is a test notification from Artsy app",
      android:
        Platform.OS === "android"
          ? {
              channelId: "Default",
              importance: 4, // High importance
            }
          : undefined,
    })

    console.log("DEBUG: Test notification displayed successfully")
    return true
  } catch (error) {
    console.error("DEBUG: Error displaying test notification:", error)
    return false
  }
}

// Add this to global for easy testing in dev
if (__DEV__) {
  // @ts-ignore
  global.testNotification = displayTestNotification
}
