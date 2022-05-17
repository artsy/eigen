import {
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import {
  getNotificationPermissionsStatus,
  PushAuthorizationStatus,
} from "app/utils/PushNotification"
import { Alert, AlertButton, Linking, Platform } from "react-native"

export const requestNotificationPermissions = () => {
  // permissions not determined: Android should never need this
  if (Platform.OS === "ios") {
    Alert.alert(
      "Artsy would like to send you notifications",
      "We need your permission to send notifications on alerts you have created.",
      [
        {
          text: "Proceed",
          onPress: () =>
            LegacyNativeModules.ARTemporaryAPIModule.requestDirectNotificationPermissions(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    )
  }
}

export const showHowToEnableNotificationInstructionAlert = () => {
  const deviceText = Platform.select({
    ios: "iOS",
    android: "android",
    default: "device",
  })
  const instruction = Platform.select({
    ios: `Tap 'Artsy' and enable "Allow Notifications" for Artsy.`,
    default: "",
  })

  const buttons: AlertButton[] = [
    {
      text: "Settings",
      onPress: () => {
        if (Platform.OS === "android") {
          Linking.openSettings()
        } else {
          Linking.openURL("App-prefs:NOTIFICATIONS_ID")
        }
      },
    },
    {
      text: "Cancel",
      style: "cancel",
    },
  ]

  Alert.alert(
    "Artsy would like to send you notifications",
    `To receive notifications for your alerts, you will need to enable them in your ${deviceText} Settings. ${instruction}`,
    Platform.OS === "ios" ? buttons : buttons.reverse()
  )
}

export const checkOrRequestPushPermissions = async () => {
  const notificationStatus = await getNotificationPermissionsStatus()

  if (notificationStatus === PushAuthorizationStatus.Denied) {
    showHowToEnableNotificationInstructionAlert()
  }

  if (notificationStatus === PushAuthorizationStatus.NotDetermined) {
    requestNotificationPermissions()
  }

  return notificationStatus === PushAuthorizationStatus.Authorized
}

export const clearDefaultAttributes = (attributes: SearchCriteriaAttributes) => {
  const clearedAttributes: SearchCriteriaAttributes = {}

  Object.entries(attributes).forEach((entry) => {
    const [key, values] = entry as [SearchCriteria, any]
    const isEmptyArray = Array.isArray(values) && values.length === 0
    const isNull = values === null

    if (!isEmptyArray && !isNull) {
      clearedAttributes[key] = values
    }
  })

  return clearedAttributes
}

export const showWarningMessageForDuplicateAlert = ({
  onReplacePress,
  onViewDuplicatePress,
}: {
  onReplacePress: () => void
  onViewDuplicatePress: () => void
}) => {
  Alert.alert(
    "Duplicate Alert",
    "You already have a saved alert with these filters. Do you want to replace it?",
    [
      {
        onPress: onReplacePress,
        style: "destructive",
        text: "Replace",
      },
      {
        onPress: onViewDuplicatePress,
        text: "View Duplicate",
      },
      {
        text: "Cancel",
      },
    ]
  )
  return
}
