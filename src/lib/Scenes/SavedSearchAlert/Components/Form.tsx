import { useFormikContext } from "formik"
import { navigate } from "lib/navigation/navigate"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { Box, Button, Flex, Input, InputTitle, Pill, Sans, Spacer, Text, Touchable } from "palette"
import React from "react"
import { LayoutAnimation } from "react-native"
import { getNamePlaceholder } from "../helpers"
import { SavedSearchAlertFormValues } from "../SavedSearchAlertModel"
import { SavedSearchAlertSwitch } from "./SavedSearchAlertSwitch"

interface FormProps {
  pills: string[]
  savedSearchAlertId?: string
  artistId: string
  artistName: string
  isLoading?: boolean
  onDeletePress?: () => void
  onSubmitPress?: () => void
  onUpdateEmailPreferencesPress?: () => void
  onTogglePushNotification: (enabled: boolean) => void
  onToggleEmailNotification: (enabled: boolean) => void
}

export const Form: React.FC<FormProps> = (props) => {
  const {
    pills,
    artistId,
    artistName,
    savedSearchAlertId,
    isLoading,
    onDeletePress,
    onSubmitPress,
    onUpdateEmailPreferencesPress,
    onTogglePushNotification,
    onToggleEmailNotification,
  } = props
  const {
    isSubmitting,
    values,
    errors,
    dirty,
    handleBlur,
    handleChange,
  } = useFormikContext<SavedSearchAlertFormValues>()
  const enableSavedSearchToggles = useFeatureFlag("AREnableSavedSearchToggles")
  const namePlaceholder = getNamePlaceholder(artistName, pills)
  const isEditMode = !!savedSearchAlertId
  let isSaveAlertButtonDisabled = false

  // Сhanges have been made by the user
  if (isEditMode && !dirty) {
    isSaveAlertButtonDisabled = true
  }

  // If the saved search alert doesn't have a name, a user can click the save button without any changes.
  // This situation is possible if a user created an alert in Saved Search V1,
  // since we didn't have the opportunity to specify custom name for the alert
  if (isEditMode && !dirty && values.name.length === 0) {
    isSaveAlertButtonDisabled = false
  }

  // Enable "save alert" button if selected at least one of the notification toggle options
  if (enableSavedSearchToggles && !values.push && !values.email) {
    isSaveAlertButtonDisabled = true
  }

  const handleToggleEmailNotification = (value: boolean) => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 300,
    })

    onToggleEmailNotification(value)
  }

  const handleUpdateEmailPreferencesPress = () => {
    if (onUpdateEmailPreferencesPress) {
      return onUpdateEmailPreferencesPress()
    }

    return navigate("/unsubscribe")
  }

  return (
    <Box>
      {!isEditMode && (
        <Box mb={4}>
          <Sans size="8">Create an Alert</Sans>
          {!enableSavedSearchToggles && (
            <Sans size="3t" mt={1}>
              Receive alerts as Push Notifications directly to your device.
            </Sans>
          )}
        </Box>
      )}

      <Box mb={2}>
        <Input
          title="Name"
          placeholder={namePlaceholder}
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          error={errors.name}
          testID="alert-input-name"
          maxLength={75}
        />
      </Box>
      {!!isEditMode && (
        <Box mb={2} height={40} justifyContent="center" alignItems="center">
          <Touchable
            haptic
            testID="view-artworks-button"
            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
            onPress={() =>
              navigate(`artist/${artistId}`, {
                passProps: {
                  searchCriteriaID: savedSearchAlertId,
                },
              })
            }
          >
            <Text variant="xs" color="blue100" style={{ textDecorationLine: "underline" }}>
              View Artworks
            </Text>
          </Touchable>
        </Box>
      )}
      <Box mb={2}>
        <InputTitle>Filters</InputTitle>
        <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
          {pills.map((pill, index) => (
            <Pill testID="alert-pill" m={0.5} key={`filter-label-${index}`}>
              {pill}
            </Pill>
          ))}
        </Flex>
      </Box>
      {!!enableSavedSearchToggles && (
        <>
          <SavedSearchAlertSwitch label="Mobile Alerts" onChange={onTogglePushNotification} active={values.push} />
          <Spacer mt={2} />
          <SavedSearchAlertSwitch label="Email Alerts" onChange={handleToggleEmailNotification} active={values.email} />
          {!!values.email && (
            <Text
              onPress={handleUpdateEmailPreferencesPress}
              variant="xs"
              color="black60"
              style={{ textDecorationLine: "underline" }}
              mt={1}
            >
              Update email preferences
            </Text>
          )}
        </>
      )}
      <Box mt={5}>
        <Button
          testID="save-alert-button"
          disabled={isSaveAlertButtonDisabled}
          loading={isSubmitting || isLoading}
          size="large"
          block
          onPress={onSubmitPress}
        >
          Save Alert
        </Button>
        {!!isEditMode && (
          <>
            <Spacer mt={2} />
            <Button testID="delete-alert-button" variant="outline" size="large" block onPress={onDeletePress}>
              Delete Alert
            </Button>
          </>
        )}
        {!isEditMode && (
          <Text variant="sm" color="black60" textAlign="center" my={2}>
            You will be able to access all your Saved Alerts in your Profile.
          </Text>
        )}
      </Box>
    </Box>
  )
}
