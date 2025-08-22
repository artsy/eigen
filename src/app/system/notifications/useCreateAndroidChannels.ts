import notifee, { AndroidChannel, AndroidImportance } from "@notifee/react-native"
import { useEffect } from "react"
import { Platform } from "react-native"

/**
 * This hook is used to create the Android notification channels
 */
export const useCreateAndroidNotificationChannels = () => {
  useEffect(() => {
    console.log("DEBUG: useCreateAndroidNotificationChannels - Platform:", Platform.OS)

    // Request Notifee permissions first (important for both platforms)
    const requestPermissionsAndCreateChannels = async () => {
      try {
        // Request Notifee permissions
        const settings = await notifee.requestPermission()
        console.log("DEBUG: Notifee permissions requested:", settings)

        // Create Android channels if on Android
        if (Platform.OS === "android") {
          await createAndroidNotificationChannels()
        }
      } catch (error) {
        console.error("DEBUG: Error requesting Notifee permissions:", error)
      }
    }

    requestPermissionsAndCreateChannels()
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
  console.log("DEBUG: Creating Android notification channels...")
  try {
    await Promise.all(CHANNELS.map((channel) => createChannel(channel)))
    console.log("DEBUG: All Android notification channels created successfully")
  } catch (error) {
    console.error("DEBUG: Error creating Android notification channels:", error)
  }
}
