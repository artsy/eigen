import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { navigate } from "app/navigation/navigate"
import { useFormikContext } from "formik"
import {
  Box,
  Button,
  CloseIcon as RemoveIcon,
  Flex,
  Input,
  InputTitle,
  Pill,
  Spacer,
  Text,
} from "palette"
import React from "react"
import { LayoutAnimation } from "react-native"
import { SavedSearchAlertFormValues, SavedSearchPill } from "../SavedSearchAlertModel"
import { SavedSearchStore } from "../SavedSearchStore"
import { SavedSearchAlertSwitch } from "./SavedSearchAlertSwitch"

interface FormProps {
  pills: SavedSearchPill[]
  savedSearchAlertId?: string
  isLoading?: boolean
  hasChangedFilters?: boolean
  shouldShowEmailWarning?: boolean
  onDeletePress?: () => void
  onSubmitPress?: () => void
  onUpdateEmailPreferencesPress?: () => void
  onTogglePushNotification: (enabled: boolean) => void
  onToggleEmailNotification: (enabled: boolean) => void
  onRemovePill: (pill: SavedSearchPill) => void
}

export const Form: React.FC<FormProps> = (props) => {
  const {
    pills,
    savedSearchAlertId,
    isLoading,
    hasChangedFilters,
    shouldShowEmailWarning,
    onDeletePress,
    onSubmitPress,
    onUpdateEmailPreferencesPress,
    onTogglePushNotification,
    onToggleEmailNotification,
    onRemovePill,
  } = props
  const { isSubmitting, values, errors, dirty, handleBlur, handleChange } =
    useFormikContext<SavedSearchAlertFormValues>()
  const entity = SavedSearchStore.useStoreState((state) => state.entity)
  const isEditMode = !!savedSearchAlertId
  let isSaveAlertButtonDisabled = false

  // Data has not changed
  if (isEditMode && !dirty) {
    isSaveAlertButtonDisabled = true
  }

  // If the saved search alert doesn't have a name, a user can click the save button without any changes.
  // This situation is possible if a user created an alert in Saved Search V1,
  // since we didn't have the opportunity to specify custom name for the alert
  if (isEditMode && !dirty && values.name.length === 0) {
    isSaveAlertButtonDisabled = false
  }

  // Enable "Save Alert" button if the user has removed the filters or changed data
  if (hasChangedFilters || dirty) {
    isSaveAlertButtonDisabled = false
  }

  // Disable button if notification toggles were not enabled
  if (!values.push && !values.email) {
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

    return navigate("/unsubscribe", {
      passProps: {
        backProps: {
          previousScreen: "Unsubscribe",
        },
      },
    })
  }

  const isArtistPill = (pill: SavedSearchPill) => pill.paramName === SearchCriteria.artistID

  return (
    <Box>
      {!isEditMode && (
        <Text variant="lg" mb={4}>
          Create Alert
        </Text>
      )}

      <Box mb={2}>
        <Input
          title="Name"
          placeholder={entity.placeholder}
          value={values.name}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          error={errors.name}
          testID="alert-input-name"
          maxLength={75}
        />
      </Box>
      <Box mb={2}>
        <InputTitle>Filters</InputTitle>
        <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
          {pills.map((pill, index) => (
            <Pill
              testID="alert-pill"
              m={0.5}
              key={`filter-label-${index}`}
              iconPosition="right"
              onPress={() => {
                if (!isArtistPill(pill)) {
                  onRemovePill(pill)
                }
              }}
              Icon={isArtistPill(pill) ? undefined : RemoveIcon}
            >
              {pill.label}
            </Pill>
          ))}
        </Flex>
      </Box>
      <SavedSearchAlertSwitch
        label="Mobile Alerts"
        onChange={onTogglePushNotification}
        active={values.push}
      />
      <Spacer mt={2} />
      <SavedSearchAlertSwitch
        label="Email Alerts"
        onChange={handleToggleEmailNotification}
        active={values.email}
      />
      {!!shouldShowEmailWarning && (
        <Box backgroundColor="orange10" my={1} p={2}>
          <Text variant="xs" color="orange150">
            Change your email preferences
          </Text>
          <Text variant="xs" mt={0.5}>
            To receive Email Alerts, please update your email preferences.
          </Text>
        </Box>
      )}
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
            <Button
              testID="delete-alert-button"
              variant="outline"
              size="large"
              block
              onPress={onDeletePress}
            >
              Delete Alert
            </Button>
          </>
        )}
        {!isEditMode && (
          <Text variant="sm" color="black60" textAlign="center" my={2}>
            Access all your saved alerts in your profile.
          </Text>
        )}
      </Box>
    </Box>
  )
}
