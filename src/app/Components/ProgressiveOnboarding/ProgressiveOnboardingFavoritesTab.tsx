import { ActionType, ContextModule, OwnerType, TappedPopover } from "@artsy/cohesion"
import { Flex, Popover, Text, Touchable } from "@artsy/palette-mobile"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_FAVORITES_TAB } from "app/store/ProgressiveOnboardingModel"
// eslint-disable-next-line no-restricted-imports
import { switchTab } from "app/system/navigation/navigate"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useTracking } from "react-tracking"

const FAVORITES_TAB_ONBOARDING_POPOVER_DELAY = 1000

export const ProgressiveOnboardingFavoritesTab: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const tracking = useTracking()

  const newUserOnboardingSavedArtworksCount = GlobalStore.useAppState(
    (state) => state.infiniteDiscovery.sessionState.newUserOnboardingSavedArtworks.length
  )
  const {
    isDismissed: isDismissedFn,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding

  const { trackEvent } = useProgressiveOnboardingTracking({
    name: PROGRESSIVE_ONBOARDING_FAVORITES_TAB,
    contextScreenOwnerType: OwnerType.home,
    contextModule: ContextModule.bottomTabs,
  })

  const currentRoute = internal_navigationRef.current?.getCurrentRoute()?.name

  const isDismissed = isDismissedFn(PROGRESSIVE_ONBOARDING_FAVORITES_TAB).status

  const isFavoritesTooltipDisplayable =
    newUserOnboardingSavedArtworksCount >= 1 && !isDismissed && currentRoute === "Home" && isReady

  const { isActive, clearActivePopover } = useSetActivePopover(isFavoritesTooltipDisplayable)

  const debounceIsActive = useDebouncedValue({
    value: isActive,
    delay: FAVORITES_TAB_ONBOARDING_POPOVER_DELAY,
  })

  const handleDismiss = () => {
    setIsReady(false)
    dismiss(PROGRESSIVE_ONBOARDING_FAVORITES_TAB)
  }

  const isVisible = debounceIsActive.debouncedValue && !isDismissed

  const onPress = () => {
    handleDismiss()
    tracking.trackEvent(tracks.onPopoverPress())
    switchTab("favorites")
  }

  return (
    <Popover
      visible={isVisible}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={clearActivePopover}
      onOpenComplete={trackEvent}
      placement="top"
      title={
        <Touchable accessibilityRole="button" noFeedback onPress={onPress}>
          <Text variant="xs" color="mono0" fontWeight="bold">
            Your saves get stored here.
          </Text>
        </Touchable>
      }
      content={
        <Touchable noFeedback accessibilityRole="button" onPress={onPress}>
          <Flex maxWidth={250}>
            <Text variant="xs" color="mono0">
              Visit your favorites at any time to see your saves and follows.
            </Text>
          </Flex>
        </Touchable>
      }
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}

const tracks = {
  onPopoverPress: (): TappedPopover => {
    return {
      action: ActionType.tappedPopover,
      context_screen_owner_type: OwnerType.home,
      context_module: ContextModule.bottomTabs,
      type: PROGRESSIVE_ONBOARDING_FAVORITES_TAB,
    }
  },
}
