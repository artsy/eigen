import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  Box,
  Button,
  Flex,
  Input,
  Join,
  Pill,
  Spacer,
  Text,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { SavedSearchSuggestedFiltersQueryRenderer } from "app/Scenes/SavedSearchAlert/Components/SavedSearchSuggestedFilters"
import {
  SavedSearchAlertFormValues,
  SavedSearchPill,
} from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { KeyboardAwareForm } from "app/utils/keyboard/KeyboardAwareForm"
import { useFormikContext } from "formik"
import { MotiView } from "moti"
import { useCallback, useState } from "react"
import { LayoutChangeEvent, Platform, StyleProp, ViewStyle } from "react-native"
import { KeyboardStickyView } from "react-native-keyboard-controller"
import { useTracking } from "react-tracking"
import { SavedSearchAlertSwitch } from "./SavedSearchAlertSwitch"

interface FormProps {
  contentContainerStyle?: StyleProp<ViewStyle>
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

export const Form: React.FC<FormProps> = ({
  contentContainerStyle,
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
}) => {
  const tracking = useTracking()
  const { space } = useTheme()
  const { bottom } = useScreenDimensions().safeAreaInsets
  const [bottomOffset, setBottomOffset] = useState(0)

  const stickyOffset = Platform.select({ android: bottom, ios: bottom - space(2) })

  const { isSubmitting, values, errors, dirty, handleBlur, handleChange } =
    useFormikContext<SavedSearchAlertFormValues>()

  const isEditMode = !!savedSearchAlertId
  let isSaveAlertButtonDisabled = false

  // Data has not changed
  if (isEditMode && !dirty) {
    isSaveAlertButtonDisabled = true
  }

  // Enable "Save Alert" button if the user has removed the filters or changed data
  if (hasChangedFilters || dirty) {
    isSaveAlertButtonDisabled = false
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

  const handleOnLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setBottomOffset(event.nativeEvent.layout.height + bottom)
    },
    [setBottomOffset, bottom]
  )

  const isArtistPill = (pill: SavedSearchPill) =>
    pill.paramName === SearchCriteria.artistID || pill.paramName === SearchCriteria.artistIDs

  return (
    <>
      <KeyboardAwareForm
        contentContainerStyle={[{ padding: space(2) }, contentContainerStyle]}
        bottomOffset={bottomOffset}
      >
        {!isEditMode && (
          <>
            <InfoButton
              titleElement={
                <Text variant="lg-display" mb={1} mr={0.5}>
                  Create Alert
                </Text>
              }
              trackEvent={() => {
                tracking.trackEvent(tracks.tappedCreateAlertHeaderButton())
              }}
              modalTitle="Create Alert"
              modalContent={
                <Text>
                  On the hunt for a particular work? Create an alert and we’ll let you know when
                  matching works are added to Artsy.
                </Text>
              }
              isPresentedModally
            />
            <Spacer y={4} />
          </>
        )}

        <Join separator={<Spacer y={4} />}>
          <Box>
            <Text variant="sm-display">We'll send you alerts for</Text>
            <Flex flexDirection="row" flexWrap="wrap" mt={1} mx={-0.5}>
              {pills.map((pill, index) => (
                <Pill
                  testID="alert-pill"
                  m={0.5}
                  variant="filter"
                  disabled={isArtistPill(pill)}
                  key={`filter-label-${index}`}
                  onPress={() => onRemovePill(pill)}
                >
                  {pill.label}
                </Pill>
              ))}
            </Flex>

            <Spacer y={2} />

            <SavedSearchSuggestedFiltersQueryRenderer />
          </Box>

          <Flex>
            <Text>Tell us more about what you’re looking for</Text>

            <Spacer y={1} />

            <Input
              placeholder="For example, a specific request such as ‘figurative painting’ or ‘David Hockney iPad drawings.’"
              value={values.details}
              onChangeText={handleChange("details")}
              onBlur={handleBlur("details")}
              error={errors.details}
              multiline
              maxLength={700}
              showLimit
              testID="alert-input-details"
            />
          </Flex>

          <Box>
            <SavedSearchAlertSwitch
              label="Push Notifications"
              onChange={onTogglePushNotification}
              active={values.push}
            />

            <Spacer y={2} />

            <SavedSearchAlertSwitch
              label="Email"
              onChange={onToggleEmailNotification}
              active={values.email}
            />

            {!!shouldShowEmailWarning && (
              <Box backgroundColor="orange10" my={1} p={2}>
                <Text variant="xs" color="orange150">
                  Change your email preferences
                </Text>
                <Text variant="xs" mt={0.5}>
                  To receive alerts via email, please update your email preferences.
                </Text>
              </Box>
            )}

            {!!values.email && (
              <Text
                onPress={handleUpdateEmailPreferencesPress}
                variant="xs"
                color="mono60"
                style={{ textDecorationLine: "underline" }}
                mt={1}
              >
                Update email preferences
              </Text>
            )}
          </Box>
        </Join>

        <Spacer y={2} />
      </KeyboardAwareForm>

      <KeyboardStickyView onLayout={handleOnLayout} offset={{ opened: stickyOffset }}>
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} delay={200}>
          <Flex
            p={2}
            pb={`${bottom}px`}
            borderTopWidth={1}
            borderTopColor="mono10"
            backgroundColor="mono0"
          >
            <Button
              testID="save-alert-button"
              disabled={isSaveAlertButtonDisabled}
              loading={isSubmitting || isLoading}
              size="large"
              block
              onPress={onSubmitPress}
            >
              {isEditMode ? "Save Alert" : "Create Alert"}
            </Button>

            {!!isEditMode && (
              <>
                <Spacer y={2} />
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
              <Text variant="xs" color="mono60" textAlign="center" mt={2}>
                Access all your alerts in your profile.
              </Text>
            )}
          </Flex>
        </MotiView>
      </KeyboardStickyView>
    </>
  )
}

const tracks = {
  tappedCreateAlertHeaderButton: () => ({
    action: ActionType.tappedCreateAlertHeader,
    context_module: ContextModule.createAlertHeader,
    context_screen_owner_type: OwnerType.createAlert,
  }),
}
