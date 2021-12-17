import { useFormikContext } from "formik"
import { SearchCriteria } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { navigate } from "lib/navigation/navigate"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { Box, Button, CloseIcon as RemoveIcon, Flex, Input, InputTitle, Pill, Spacer, Text, Touchable } from "palette"
import React from "react"
import { LayoutAnimation } from "react-native"
import { getNamePlaceholder } from "../helpers"
import { SavedSearchAlertFormValues, SavedSearchPill } from "../SavedSearchAlertModel"
import { SavedSearchAlertSwitch } from "./SavedSearchAlertSwitch"

interface FormProps {
  pills: SavedSearchPill[]
  savedSearchAlertId?: string
  artistId: string
  artistName: string
  isLoading?: boolean
  isPreviouslySaved?: boolean
  hasChangedFilters?: boolean
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
    artistId,
    artistName,
    savedSearchAlertId,
    isLoading,
    isPreviouslySaved,
    hasChangedFilters,
    onDeletePress,
    onSubmitPress,
    onUpdateEmailPreferencesPress,
    onTogglePushNotification,
    onToggleEmailNotification,
    onRemovePill,
  } = props
  const { isSubmitting, values, errors, dirty, handleBlur, handleChange } =
    useFormikContext<SavedSearchAlertFormValues>()
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")
  const namePlaceholder = getNamePlaceholder(artistName, pills)
  const isEditMode = !!savedSearchAlertId
  let isSaveAlertButtonDisabled = false

  // Data has not changed or has already been saved
  if ((isEditMode && !dirty) || isPreviouslySaved) {
    isSaveAlertButtonDisabled = true
  }

  // If the saved search alert doesn't have a name, a user can click the save button without any changes.
  // This situation is possible if a user created an alert in Saved Search V1,
  // since we didn't have the opportunity to specify custom name for the alert
  if (isEditMode && !dirty && values.name.length === 0) {
    isSaveAlertButtonDisabled = false
  }

  // Enable "Save Alert" button if the user has removed the filters or changed data
  if (isEnabledImprovedAlertsFlow && !isEditMode && (hasChangedFilters || dirty)) {
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

    return navigate("/unsubscribe")
  }

  const isArtistPill = (pill: SavedSearchPill) => pill.paramName === SearchCriteria.artistID

  return (
    <Box>
      {!isEditMode && (
        <Text variant="lg" mb={4}>
          Create an Alert
        </Text>
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
          {pills.map((pill, index) =>
            isEnabledImprovedAlertsFlow ? (
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
            ) : (
              <Pill testID="alert-pill" m={0.5} key={`filter-label-${index}`} iconPosition="right">
                {pill.label}
              </Pill>
            )
          )}
        </Flex>
      </Box>
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
