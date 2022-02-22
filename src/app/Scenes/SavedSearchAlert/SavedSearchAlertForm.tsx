import { ActionType, DeletedSavedSearch, EditedSavedSearch, OwnerType } from "@artsy/cohesion"
import { FormikProvider, useFormik } from "formik"
import {
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { goBack, navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Dialog, quoteLeft, quoteRight, useTheme } from "palette"
import React, { useEffect, useState } from "react"
import { Alert, ScrollView, StyleProp, ViewStyle } from "react-native"
import { useTracking } from "react-tracking"
import { useFirstMountState } from "react-use/lib/useFirstMountState"
import { Form } from "./Components/Form"
import {
  checkOrRequestPushPermissions,
  clearDefaultAttributes,
  getNamePlaceholder,
  showWarningMessageForDuplicateAlert,
} from "./helpers"
import { createSavedSearchAlert } from "./mutations/createSavedSearchAlert"
import { deleteSavedSearchMutation } from "./mutations/deleteSavedSearchAlert"
import { updateEmailFrequency } from "./mutations/updateEmailFrequency"
import { updateSavedSearchAlert } from "./mutations/updateSavedSearchAlert"
import { getSavedSearchIdByCriteria } from "./queries/getSavedSearchIdByCriteria"
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
  const isFirstRender = useFirstMountState()
  const savedSearchPills = SavedSearchStore.useStoreState((state) => state.pills)
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const hasChangedFilters = SavedSearchStore.useStoreState((state) => state.dirty)
  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.removeValueFromAttributesByKeyAction
  )

  const artistPill: SavedSearchPill = {
    label: artistName,
    value: artistId,
    paramName: SearchCriteria.artistID,
  }

  const pills = isEnabledImprovedAlertsFlow ? [artistPill, ...savedSearchPills] : savedSearchPills

  const tracking = useTracking()
  const { space } = useTheme()
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const [shouldShowEmailSubscriptionWarning, setShouldShowEmailSubscriptionWarning] = useState(
    !userAllowsEmails
  )
  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues,
    enableReinitialize: true,
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
        const clearedAttributes = clearDefaultAttributes(attributes)
        const submitHandler = isUpdateForm ? handleUpdateAlert : handleCreateAlert
        let duplicateSavedSearchId: string | undefined

        /**
         * We perform the mutation only if
         *  - the "Email Alerts" toggle was initially disabled and the user turned it on
         *  - the user previously opted out of all marketing emails
         */
        if (!userAllowsEmails && !initialValues.email && values.email) {
          await updateEmailFrequency("alerts_only")
        }

        /**
         * We need to check a duplicate alert if
         * - this is create alert flow
         * - this is update alert flow AND there were changes in filters
         */
        if (isEnabledImprovedAlertsFlow && (!isUpdateForm || (isUpdateForm && hasChangedFilters))) {
          duplicateSavedSearchId = await getSavedSearchIdByCriteria(clearedAttributes)
        }

        if (isEnabledImprovedAlertsFlow && duplicateSavedSearchId) {
          showWarningMessageForDuplicateAlert({
            onReplacePress: () => {
              submitHandler(userAlertSettings, clearedAttributes)
            },
            onViewDuplicatePress: () => {
              goBack()
              navigate(`/my-profile/saved-search-alerts/${duplicateSavedSearchId}`)
            },
          })
          return
        }

        await submitHandler(userAlertSettings, clearedAttributes)
      } catch (error) {
        console.error(error)
      }
    },
  })

  const handleUpdateAlert = async (
    userAlertSettings: SavedSearchAlertFormValues,
    alertAttributes: SearchCriteriaAttributes
  ) => {
    try {
      formik.setSubmitting(true)
      const criteria = isEnabledImprovedAlertsFlow ? alertAttributes : undefined

      const response = await updateSavedSearchAlert(
        savedSearchAlertId!,
        userAlertSettings,
        criteria
      )
      tracking.trackEvent(
        tracks.editedSavedSearch(savedSearchAlertId!, initialValues, userAlertSettings)
      )

      const result: SavedSearchAlertMutationResult = {
        id: response.updateSavedSearch?.savedSearchOrErrors.internalID!,
      }
      onComplete?.(result)
    } catch (error) {
      console.error(error)
    } finally {
      formik.setSubmitting(false)
    }
  }

  const handleCreateAlert = async (
    userAlertSettings: SavedSearchAlertFormValues,
    alertAttributes: SearchCriteriaAttributes
  ) => {
    try {
      formik.setSubmitting(true)
      const response = await createSavedSearchAlert(userAlertSettings, alertAttributes)
      const result: SavedSearchAlertMutationResult = {
        id: response.createSavedSearch?.savedSearchOrErrors.internalID!,
      }

      onComplete?.(result)
    } catch (error) {
      console.error(error)
    } finally {
      formik.setSubmitting(false)
    }
  }

  // Save the previously entered name
  useEffect(() => {
    if (!isFirstRender) {
      formik.setFieldValue("name", formik.values.name)
    }
  }, [initialValues.email, initialValues.push])

  useEffect(() => {
    setShouldShowEmailSubscriptionWarning(!userAllowsEmails)
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
    if (shouldShowEmailSubscriptionWarning && !initialValues.email && enabled) {
      const title = "Artsy would like to send you email notifications"
      const description = `After clicking ${quoteLeft}Save Alert${quoteRight}, you are opting in to receive alert notifications via email. You can update your email preferences by clicking into any alert listed in your profile tab and clicking ${quoteLeft}Update email preferences${quoteRight} underneath the ${quoteLeft}Email Alerts${quoteRight} toggle`

      Alert.alert(title, description, [
        { text: "Cancel" },
        {
          text: "Accept",
          onPress: () => {
            setShouldShowEmailSubscriptionWarning(false)
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

  const shouldShowEmailWarning = !!savedSearchAlertId && !!initialValues.email && !userAllowsEmails

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
          shouldShowEmailWarning={shouldShowEmailWarning}
          {...other}
        />
      </ScrollView>
      {!!savedSearchAlertId && (
        <Dialog
          isVisible={visibleDeleteDialog}
          title="Delete Alert"
          detail="You will no longer receive notifications for artworks matching the criteria in this alert."
          primaryCta={{
            text: "Delete",
            onPress: () => {
              onDelete()
              setVisibleDeleteDialog(false)
            },
          }}
          secondaryCta={{
            text: "Keep Alert",
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
