import { ActionType, DeletedSavedSearch, EditedSavedSearch, OwnerType } from "@artsy/cohesion"
import { FormikProvider, useFormik } from "formik"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { Dialog, quoteLeft, quoteRight, useTheme } from "palette"
import React, { useEffect, useState } from "react"
import { Alert, ScrollView, StyleProp, ViewStyle } from "react-native"
import { useTracking } from "react-tracking"
import { Form } from "./Components/Form"
import { checkOrRequestPushPermissions, clearDefaultAttributes, getNamePlaceholder } from "./helpers"
import { createSavedSearchAlert } from "./mutations/createSavedSearchAlert"
import { deleteSavedSearchMutation } from "./mutations/deleteSavedSearchAlert"
import { updateEmailFrequency } from "./mutations/updateEmailFrequency"
import { updateSavedSearchAlert } from "./mutations/updateSavedSearchAlert"
import {
  SavedSearchAlertFormPropsBase,
  SavedSearchAlertFormValues,
  SavedSearchAlertMutationResult,
  SavedSearchPill,
} from "./SavedSearchAlertModel"
import { SavedSearchStore } from "./SavedSearchStore"

export interface SavedSearchAlertFormProps extends SavedSearchAlertFormPropsBase {
  initialValues: SavedSearchAlertFormValues
  savedSearchAlertId?: string
  userAllowsEmails: boolean
  contentContainerStyle?: StyleProp<ViewStyle>
  onUpdateEmailPreferencesPress?: () => void
  onComplete?: (result: SavedSearchAlertMutationResult) => void
  onDeleteComplete?: () => void
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const {
    initialValues,
    savedSearchAlertId,
    artistId,
    artistName,
    userAllowsEmails,
    contentContainerStyle,
    onComplete,
    onDeleteComplete,
    ...other
  } = props
  const isUpdateForm = !!savedSearchAlertId
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")
  const savedSearchPills = SavedSearchStore.useStoreState((state) => state.pills)
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const hasChangedFilters = SavedSearchStore.useStoreState((state) => state.dirty)
  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (state) => state.removeValueFromAttributesByKeyAction
  )

  const artistPill: SavedSearchPill = {
    label: artistName,
    value: artistId,
    paramName: "artistID",
  }
  const pills = isEnabledImprovedAlertsFlow ? [artistPill, ...savedSearchPills] : savedSearchPills

  const tracking = useTracking()
  const { space } = useTheme()
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const [shouldShowEmailWarning, setShouldShowEmailWarning] = useState(!userAllowsEmails)
  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues,
    initialErrors: {},
    onSubmit: async (values) => {
      let alertName = values.name

      if (alertName.length === 0) {
        alertName = getNamePlaceholder(artistName, pills)
      }

      const userAlertSettings: SavedSearchAlertFormValues = {
        name: alertName,
        email: values.email,
        push: values.push,
      }

      try {
        let result: SavedSearchAlertMutationResult

        /**
         * We perform the mutation only if
         *  - the "Email Alerts" toggle was initially disabled and the user turned it on
         *  - the user previously opted out of all marketing emails
         */
        if (!userAllowsEmails && !initialValues.email && values.email) {
          await updateEmailFrequency("alerts_only")
        }

        if (isUpdateForm) {
          const response = await updateSavedSearchAlert(userAlertSettings, savedSearchAlertId!)
          tracking.trackEvent(tracks.editedSavedSearch(savedSearchAlertId!, initialValues, values))

          result = {
            id: response.updateSavedSearch?.savedSearchOrErrors.internalID!,
          }
        } else {
          const clearedAttributes = clearDefaultAttributes(attributes)
          const response = await createSavedSearchAlert(userAlertSettings, clearedAttributes)

          result = {
            id: response.createSavedSearch?.savedSearchOrErrors.internalID!,
          }
        }

        onComplete?.(result)
      } catch (error) {
        console.error(error)
      }
    },
  })

  /**
   * If the initial value of push has changed (for example, the user has minimized the app and turned off Push notifications in settings)
   * then we sync the updated value with the formik state
   */
  useEffect(() => {
    formik.setFieldValue("push", initialValues.push)
  }, [initialValues.push])

  useEffect(() => {
    formik.setFieldValue("email", initialValues.email)
  }, [initialValues.email])

  useEffect(() => {
    setShouldShowEmailWarning(!userAllowsEmails)
  }, [userAllowsEmails])

  const handleTogglePushNotification = async (enabled: boolean) => {
    // If mobile alerts is enabled, then we check the permissions for push notifications
    if (enabled) {
      const granted = await checkOrRequestPushPermissions()

      if (!granted) {
        return
      }
    }

    formik.setFieldValue("push", enabled)
  }

  const handleToggleEmailNotification = (enabled: boolean) => {
    // Show the modal only when the user is opted out of email and changes the "email alerts" toggle from off to on state
    if (shouldShowEmailWarning && !initialValues.email && enabled) {
      const title = "Artsy would like to send you email notifications"
      const description = `After clicking ${quoteLeft}Save Alert${quoteRight}, you are opting in to receive alert notifications via email. You can update your email preferences by clicking into any alert listed in your profile tab and clicking ${quoteLeft}Update email preferences${quoteRight} underneath the ${quoteLeft}Email Alerts${quoteRight} toggle`

      Alert.alert(title, description, [
        { text: "Cancel" },
        {
          text: "Accept",
          onPress: () => {
            setShouldShowEmailWarning(false)
            formik.setFieldValue("email", enabled)
          },
        },
      ])
      return
    }

    formik.setFieldValue("email", enabled)
  }

  const onDelete = async () => {
    try {
      await deleteSavedSearchMutation(savedSearchAlertId!)
      tracking.trackEvent(tracks.deletedSavedSearch(savedSearchAlertId!))
      onDeleteComplete?.()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeletePress = () => {
    setVisibleDeleteDialog(true)
  }

  const handleRemovePill = (deletePill: SavedSearchPill) => {
    removeValueFromAttributesByKeyAction({
      key: deletePill.paramName,
      value: deletePill.value,
    })
  }

  return (
    <FormikProvider value={formik}>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[{ padding: space(2) }, contentContainerStyle]}
      >
        <Form
          pills={pills}
          savedSearchAlertId={savedSearchAlertId}
          artistId={artistId}
          artistName={artistName}
          hasChangedFilters={hasChangedFilters}
          onDeletePress={handleDeletePress}
          onSubmitPress={formik.handleSubmit}
          onTogglePushNotification={handleTogglePushNotification}
          onToggleEmailNotification={handleToggleEmailNotification}
          onRemovePill={handleRemovePill}
          {...other}
        />
      </ScrollView>
      {!!savedSearchAlertId && (
        <Dialog
          isVisible={visibleDeleteDialog}
          title="Delete Alert"
          detail="Once deleted, you will no longer receive notifications for these filter criteria."
          primaryCta={{
            text: "Delete",
            onPress: () => {
              onDelete()
              setVisibleDeleteDialog(false)
            },
          }}
          secondaryCta={{
            text: "Cancel",
            onPress: () => {
              setVisibleDeleteDialog(false)
            },
          }}
        />
      )}
    </FormikProvider>
  )
}

export const tracks = {
  deletedSavedSearch: (savedSearchAlertId: string): DeletedSavedSearch => ({
    action: ActionType.deletedSavedSearch,
    context_screen_owner_type: OwnerType.savedSearch,
    context_screen_owner_id: savedSearchAlertId,
  }),
  editedSavedSearch: (
    savedSearchAlertId: string,
    currentValues: SavedSearchAlertFormValues,
    modifiesValues: SavedSearchAlertFormValues
  ): EditedSavedSearch => ({
    action: ActionType.editedSavedSearch,
    context_screen_owner_type: OwnerType.savedSearch,
    context_screen_owner_id: savedSearchAlertId,
    current: JSON.stringify(currentValues),
    changed: JSON.stringify(modifiesValues),
  }),
}
