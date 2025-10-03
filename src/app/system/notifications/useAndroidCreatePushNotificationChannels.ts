import notifee, { AndroidChannel, AndroidImportance } from "@notifee/react-native"
import { useEffect } from "react"
import { Platform } from "react-native"

/**
 * This hook is used to create the Android push notification channels
 */
export const useAndroidCreatePushNotificationChannels = () => {
  if (Platform.OS !== "android") {
    throw new Error("useAndroidCreatePushNotificationChannels is used for Android only")
  }

  useEffect(() => {
    const createPushNotificationsChannels = async () => {
      try {
        // Create Android channels if on Android
        await createAndroidNotificationChannels()
      } catch (error) {
        console.error("DEBUG: Error requesting Notifee permissions:", error)
      }
    }

    createPushNotificationsChannels()
  }, [])
}

export const CHANNELS: AndroidChannel[] = [
  {
    name: "Artsy's default notifications channel",
    id: "Default",
    description: "Artsy's default notifications channel",
    importance: AndroidImportance.HIGH,
  },
]

export const createChannel = async (channel: AndroidChannel) => {
  try {
    await notifee.createChannel(channel)
    if (__DEV__) {
      console.log(`NEW CHANNEL ${channel.id} CREATED`)
    }
  } catch (error) {
    if (__DEV__) {
      console.warn(`Failed to create channel ${channel.id}:`, error)
    }
  }
}

export const createAndroidNotificationChannels = async () => {
  try {
    await Promise.all(CHANNELS.map((channel) => createChannel(channel)))
  } catch (error) {
    console.error("DEBUG: Error creating Android notification channels:", error)
  }
}
