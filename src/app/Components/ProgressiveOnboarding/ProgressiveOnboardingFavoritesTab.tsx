import { ActionType, ContextModule, OwnerType, TappedPopover } from "@artsy/cohesion"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_FAVORITES_TAB } from "app/store/ProgressiveOnboardingModel"
// eslint-disable-next-line no-restricted-imports
import { switchTab } from "app/system/navigation/navigate"
import { useCurrentRouteName } from "app/utils/hooks/useCurrentRouteName"
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
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const { dismiss } = GlobalStore.actions.progressiveOnboarding

  // Must be reactive: the tab bar never unmounts, so a route read during render would
  // not re-run and would keep this eligible on whatever screen we navigate to.
  const currentRoute = useCurrentRouteName()

  const handleDismiss = () => {
    dismiss(PROGRESSIVE_ONBOARDING_FAVORITES_TAB)
  }

  const onPress = () => {
    handleDismiss()
    tracking.trackEvent(tracks.onPopoverPress())
    switchTab("favorites")
  }

  return (
    <OnboardingPopover
      id={PROGRESSIVE_ONBOARDING_FAVORITES_TAB}
      when={newUserOnboardingSavedArtworksCount >= 1 && currentRoute === "Home" && isReady}
      delay={FAVORITES_TAB_ONBOARDING_POPOVER_DELAY}
      placement="top"
      backgroundStyle={{ backgroundColor: "transparent" }}
      onDismiss={handleDismiss}
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
      contextScreenOwnerType={OwnerType.home}
      contextModule={ContextModule.bottomTabs}
    >
      {children}
    </OnboardingPopover>
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
