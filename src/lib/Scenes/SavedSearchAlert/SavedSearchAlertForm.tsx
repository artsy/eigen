import { ActionType, DeletedSavedSearch, EditedSavedSearch, OwnerType } from "@artsy/cohesion"
import { FormikProvider, useFormik } from "formik"
import { getSearchCriteriaFromFilters } from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { getNotificationPermissionsStatus, PushAuthorizationStatus } from "lib/utils/PushNotification"
import React from "react"
import { Alert, AlertButton, Linking, Platform } from "react-native"
import { useTracking } from "react-tracking"
import { Form } from "./Components/Form"
import { extractPills, getNamePlaceholder } from "./helpers"
import { createSavedSearchAlert } from "./mutations/createSavedSearchAlert"
import { deleteSavedSearchMutation } from "./mutations/deleteSavedSearchAlert"
import { updateSavedSearchAlert } from "./mutations/updateSavedSearchAlert"
import { SavedSearchAlertFormPropsBase, SavedSearchAlertFormValues } from "./SavedSearchAlertModel"

export interface SavedSearchAlertFormProps extends SavedSearchAlertFormPropsBase {
  initialValues: {
    name: string
  }
  savedSearchAlertId?: string
  onComplete?: () => void
  onDeleteComplete?: () => void
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const { filters, aggregations, initialValues, savedSearchAlertId, onComplete, onDeleteComplete, ...other } = props
  const isUpdateForm = !!savedSearchAlertId
  const pills = extractPills(filters, aggregations)
  const tracking = useTracking()
  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues,
    initialErrors: {},
    onSubmit: async (values) => {
      let alertName = values.name

      if (alertName.length === 0) {
        alertName = getNamePlaceholder(props.artist.name, pills)
      }

      try {
        if (isUpdateForm) {
          tracking.trackEvent(tracks.editedSavedSearch(props.artist.id, initialValues, values))
          await updateSavedSearchAlert(alertName, savedSearchAlertId!)
        } else {
          const criteria = getSearchCriteriaFromFilters(props.artist.id, filters)
          await createSavedSearchAlert(alertName, criteria)
        }

        onComplete?.()
      } catch (error) {
        console.error(error)
      }
    },
  })

  const requestNotificationPermissions = () => {
    // permissions not determined: Android should never need this
    if (Platform.OS === "ios") {
      Alert.alert(
        "Artsy would like to send you notifications",
        "We need your permission to send notifications on alerts you have created.",
        [
          {
            text: "Proceed",
            onPress: () => LegacyNativeModules.ARTemporaryAPIModule.requestNotificationPermissions(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      )
    }
  }

  const showHowToEnableNotificationInstructionAlert = () => {
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

  const handleSubmit = async () => {
    const notificationStatus = await getNotificationPermissionsStatus()

    if (notificationStatus === PushAuthorizationStatus.Authorized) {
      formik.handleSubmit()
    } else if (notificationStatus === PushAuthorizationStatus.Denied) {
      showHowToEnableNotificationInstructionAlert()
    } else {
      requestNotificationPermissions()
    }
  }

  const onDelete = async () => {
    try {
      await deleteSavedSearchMutation(savedSearchAlertId!)
      onDeleteComplete?.()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Alert",
      "Once you delete this alert, you will have to recreate it to continue receiving alerts on your favorite artworks.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    )
    tracking.trackEvent(tracks.deletedSavedSearch(props.artist.id))
  }

  return (
    <FormikProvider value={formik}>
      <Form
        pills={pills}
        savedSearchAlertId={savedSearchAlertId}
        onDeletePress={handleDeletePress}
        onSubmitPress={handleSubmit}
        {...other}
      />
    </FormikProvider>
  )
}

export const tracks = {
  deletedSavedSearch: (artistId: string): DeletedSavedSearch => ({
    action: ActionType.deletedSavedSearch,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
  }),
  editedSavedSearch: (
    artistId: string,
    currentValues: SavedSearchAlertFormValues,
    modifiesValues: SavedSearchAlertFormValues
  ): EditedSavedSearch => ({
    action: ActionType.editedSavedSearch,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    current: JSON.stringify(currentValues),
    changed: JSON.stringify(modifiesValues),
  }),
}
