import { ActionType, DeletedSavedSearch, EditedSavedSearch, OwnerType } from "@artsy/cohesion"
import { Dialog, quoteLeft, quoteRight } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { LengthUnitPreference } from "__generated__/UserPrefsModelQuery.graphql"
import {
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { updateMyUserProfile } from "app/Scenes/MyAccount/updateMyUserProfile"
import { getAlertByCriteria } from "app/Scenes/SavedSearchAlert/queries/getAlertByCriteria"
import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate, popToRoot } from "app/system/navigation/navigate"
import { refreshSavedAlerts } from "app/utils/refreshHelpers"
import { FormikProvider, useFormik } from "formik"
import { useEffect, useState } from "react"
import { Alert, StyleProp, ViewStyle } from "react-native"
import { useTracking } from "react-tracking"
import { useFirstMountState } from "react-use/lib/useFirstMountState"
import { Form } from "./Components/Form"
import {
  CreateSavedSearchAlertNavigationStack,
  SavedSearchAlertFormValues,
  SavedSearchAlertMutationResult,
  SavedSearchPill,
} from "./SavedSearchAlertModel"
import { SavedSearchStore } from "./SavedSearchStore"
import {
  checkOrRequestPushPermissions,
  clearDefaultAttributes,
  localizeHeightAndWidthAttributes,
  showWarningMessageForDuplicateAlert,
  useSearchCriteriaAttributes,
} from "./helpers"
import { createSavedSearchAlert } from "./mutations/createSavedSearchAlert"
import { deleteSavedSearchMutation } from "./mutations/deleteSavedSearchAlert"
import { updateNotificationPreferences } from "./mutations/updateNotificationPreferences"
import { updateSavedSearchAlert } from "./mutations/updateSavedSearchAlert"
import { useSavedSearchPills } from "./useSavedSearchPills"

export interface SavedSearchAlertFormProps {
  initialValues: SavedSearchAlertFormValues
  savedSearchAlertId?: string
  userAllowsEmails: boolean
  contentContainerStyle?: StyleProp<ViewStyle>
  isLoading?: boolean
  onUpdateEmailPreferencesPress?: () => void
  onComplete?: (result: SavedSearchAlertMutationResult) => void
  onDeleteComplete?: () => void
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const {
    initialValues,
    savedSearchAlertId,
    userAllowsEmails,
    contentContainerStyle,
    onComplete,
    ...other
  } = props

  const isUpdateForm = !!savedSearchAlertId
  const isFirstRender = useFirstMountState()

  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
  const hasChangedFilters = SavedSearchStore.useStoreState((state) => state.dirty)
  const unit = SavedSearchStore.useStoreState((state) => state.unit)

  const pills = useSavedSearchPills()

  const removeValueFromAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.removeValueFromAttributesByKeyAction
  )

  const selectedRriceRange = useSearchCriteriaAttributes(SearchCriteria.priceRange) as string

  const tracking = useTracking()
  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const [shouldShowEmailSubscriptionWarning, setShouldShowEmailSubscriptionWarning] =
    useState(!userAllowsEmails)
  const [visibleErrorDialog, setVisibleErrorDialog] = useState<boolean>(false)

  const navigation =
    useNavigation<NavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">>()

  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues,
    enableReinitialize: true,
    initialErrors: {},
    onSubmit: async (values) => {
      const userAlertSettings: SavedSearchAlertFormValues = {
        name: values.name,
        email: values.email,
        push: values.push,
        details: values.details,
      }

      try {
        const clearedAttributes = clearDefaultAttributes(
          // Our backend currently supports storing only inches for size
          localizeHeightAndWidthAttributes({
            attributes: attributes as SearchCriteriaAttributes,
            from: unit,
            to: "in",
          })
        )

        // Update the user profile metric to be the same as the selected metric
        updateMyUserProfile({
          lengthUnitPreference: unit.toUpperCase() as LengthUnitPreference,
        })
        GlobalStore.actions.userPrefs.setMetric(unit)

        const submitHandler = isUpdateForm ? handleUpdateAlert : handleCreateAlert
        let duplicateAlertID: string | undefined

        /**
         * We perform the mutation only if
         *  - the "Email Alerts" toggle was initially disabled and the user turned it on
         *  - the user previously opted out of all marketing emails
         */
        if (!userAllowsEmails && !initialValues.email && values.email) {
          await updateNotificationPreferences([{ name: "custom_alerts", status: "SUBSCRIBED" }])
        }

        /**
         * We need to check a duplicate alert if
         * - this is create alert flow
         * - this is update alert flow AND there were changes in filters
         */
        if (!isUpdateForm || (isUpdateForm && hasChangedFilters)) {
          duplicateAlertID = await getAlertByCriteria(clearedAttributes)
        }

        if (duplicateAlertID) {
          showWarningMessageForDuplicateAlert({
            onReplacePress: () => {
              submitHandler(userAlertSettings, clearedAttributes)
            },
            onViewDuplicatePress: () => {
              goBack()

              requestAnimationFrame(() => {
                navigate(`/favorites/alerts/${duplicateAlertID}/edit`)
              })
            },
          })
          return
        }

        await submitHandler(userAlertSettings, clearedAttributes)

        // If the user set a price range, we would like to save it in the store to prompt it the next time
        if (selectedRriceRange) {
          GlobalStore.actions.recentPriceRanges.addNewPriceRange(selectedRriceRange)
        }
      } catch (error) {
        console.error(error)
      }
    },
  })

  const handleUpdateAlert = async (
    userAlertSettings: SavedSearchAlertFormValues,
    alertAttributes: SearchCriteriaAttributes
  ) => {
    if (!savedSearchAlertId) return

    try {
      formik.setSubmitting(true)

      const response = await updateSavedSearchAlert(
        savedSearchAlertId,
        userAlertSettings,
        alertAttributes
      )

      tracking.trackEvent(
        tracks.editedSavedSearch(savedSearchAlertId, initialValues, userAlertSettings)
      )

      const result: SavedSearchAlertMutationResult = {
        id: response.updateAlert?.responseOrError?.alert?.internalID,
      }

      onComplete?.(result)
    } catch (error) {
      setVisibleErrorDialog(true)
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
        id: response.createAlert?.responseOrError?.alert?.internalID,
        searchCriteriaID: response.createAlert?.responseOrError?.alert?.searchCriteriaID,
      }

      navigation.navigate("ConfirmationScreen", {
        alertID: result.id,
        searchCriteriaID: result.searchCriteriaID,
      })
      refreshSavedAlerts()
      onComplete?.(result)
    } catch (error) {
      setVisibleErrorDialog(true)
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
    if (!savedSearchAlertId) return

    try {
      await deleteSavedSearchMutation(savedSearchAlertId)
      tracking.trackEvent(tracks.deletedSavedSearch(savedSearchAlertId))
      popToRoot()
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
      <Form
        contentContainerStyle={contentContainerStyle}
        pills={pills}
        savedSearchAlertId={savedSearchAlertId}
        hasChangedFilters={hasChangedFilters}
        onDeletePress={handleDeletePress}
        onSubmitPress={formik.handleSubmit}
        onTogglePushNotification={handleTogglePushNotification}
        onToggleEmailNotification={handleToggleEmailNotification}
        onRemovePill={handleRemovePill}
        shouldShowEmailWarning={shouldShowEmailWarning}
        {...other}
      />
      {!!savedSearchAlertId && (
        <Dialog
          isVisible={visibleDeleteDialog}
          title="Delete Alert"
          detail="You will no longer receive notifications for artworks matching the criteria in this alert."
          primaryCta={{
            text: "Delete",
            onPress: () => {
              onDelete()
              refreshSavedAlerts()
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
      <Dialog
        isVisible={visibleErrorDialog}
        title="Something went wrong"
        detail="Please, check your changes and try again later"
        primaryCta={{
          text: "Ok",
          onPress: () => {
            setVisibleErrorDialog(false)
          },
        }}
      />
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
