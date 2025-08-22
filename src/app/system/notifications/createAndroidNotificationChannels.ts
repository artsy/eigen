import notifee, { AndroidChannel, AndroidImportance } from "@notifee/react-native"

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
  await Promise.all(CHANNELS.map((channel) => createChannel(channel)))
}
