import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { getCurrentEmissionState, GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Platform } from "react-native"

// We don't want to show the onboarding popover on the first launch
const MIN_LAUNCH_COUNT = 2

export const ProgressiveOnboardingLongPressContextMenu: React.FC = ({ children }) => {
  const enableLongPressContextMenuOnboarding = useFeatureFlag(
    "AREnableLongPressContextMenuOnboarding"
  )
  const enableLongPressContextMenu = useFeatureFlag(
    Platform.OS === "ios"
      ? "AREnableArtworkCardContextMenuIOS"
      : "AREnableArtworkCardContextMenuAndroid"
  )

  const launchCount = getCurrentEmissionState().launchCount
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()

  const isDisplayable =
    launchCount >= MIN_LAUNCH_COUNT &&
    isReady &&
    !isDismissed("long-press-artwork-context-menu").status &&
    isFocused
  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)

  const { trackEvent } = useProgressiveOnboardingTracking({
    name: "long-press-artwork-context-menu",
    contextScreenOwnerType: OwnerType.home,
    /**
     * Setting contextModule to newWorksForYouRail
     * we display the tooltip on the first rail of the home screen
     * at the moment it is newWorksForYouRail
     * see isFirstArtworkSection variable in HomeViewSectionArtworks.tsx
     */
    contextModule: ContextModule.newWorksForYouRail,
  })

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("long-press-artwork-context-menu")
  }

  const isVisible =
    !!enableLongPressContextMenu &&
    !!enableLongPressContextMenuOnboarding &&
    !!isDisplayable &&
    isActive

  return (
    <Popover
      visible={isVisible}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={clearActivePopover}
      onOpenComplete={trackEvent}
      placement="top"
      title={
        <Text variant="xs" color="white100" fontWeight={500}>
          Quick tip:
        </Text>
      }
      content={
        <Text variant="xs" color="white100">
          Reveal more options and actions on an artwork card by pressing and holding an artwork.
        </Text>
      }
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}
