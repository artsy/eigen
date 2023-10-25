import {
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { unsafe_getPushPromptSettings } from "app/store/GlobalStore"
import {
  PushAuthorizationStatus,
  getNotificationPermissionsStatus,
} from "app/utils/PushNotification"
import { requestSystemPermissions } from "app/utils/requestPushNotificationsPermission"
import { isEqual, omit } from "lodash"
import { Alert, AlertButton, Linking, Platform } from "react-native"

export const requestNotificationPermissions = () => {
  Alert.alert(
    "Artsy would like to send you notifications",
    "We need your permission to send notifications on alerts you have created.",
    [
      {
        text: "Proceed",
        onPress: () => {
          requestSystemPermissions()
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]
  )
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

  const pushPromptSettings = unsafe_getPushPromptSettings()
  if (!pushPromptSettings) {
    return
  }

  const { pushNotificationSystemDialogSeen } = pushPromptSettings

  if (notificationStatus === PushAuthorizationStatus.Denied && pushNotificationSystemDialogSeen) {
    showHowToEnableNotificationInstructionAlert()
  } else if (
    notificationStatus === PushAuthorizationStatus.NotDetermined ||
    (notificationStatus === PushAuthorizationStatus.Denied && !pushNotificationSystemDialogSeen)
  ) {
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
      // @ts-ignore
      clearedAttributes[key] = values
    }
  })

  return omit(clearedAttributes, "displayName")
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

export const isValueSelected = ({
  selectedAttributes,
  value,
}: {
  selectedAttributes: ReturnType<typeof useSearchCriteriaAttributes>
  value: any
}) => {
  if (!selectedAttributes) {
    return false
  }
  if (typeof selectedAttributes === "string") {
    return selectedAttributes === value
  }
  if (Array.isArray(selectedAttributes)) {
    return (selectedAttributes as any[]).find((attributeValue) => isEqual(attributeValue, value))
  }
  return isEqual(selectedAttributes, value)
}

// A hook that returns the attributes for a given criterion
export const useSearchCriteriaAttributes = (criterion: SearchCriteria) => {
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)

  return attributes[criterion]
}
