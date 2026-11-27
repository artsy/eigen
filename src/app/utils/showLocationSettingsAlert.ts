import { Alert, Linking } from "react-native"

/** Once denied, the system prompt never shows again, so Settings is the only way back */
export const showLocationSettingsAlert = (reason: string) =>
  Alert.alert(
    "Allow access to your location",
    `${reason}, allow Artsy to access your location in Settings.`,
    [
      { text: "Cancel", style: "cancel" },
      { text: "Open Settings", onPress: () => Linking.openSettings() },
    ]
  )
