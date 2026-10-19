import { ActionType, ContextModule, OwnerType, TappedPopover } from "@artsy/cohesion"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { fetchPriceRange } from "app/Components/PriceRange/fetchPriceRange"
import { OnboardingPopover } from "app/Components/ProgressiveOnboarding/OnboardingPopover"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME } from "app/store/ProgressiveOnboardingModel"
// eslint-disable-next-line no-restricted-imports
import { navigate, switchTab } from "app/system/navigation/navigate"
import { useCurrentRouteName } from "app/utils/hooks/useCurrentRouteName"
import { useEffect, useState } from "react"
import { useTracking } from "react-tracking"

export const PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE = "Have a budget in mind?"
export const PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT =
  "Set an artwork budget in your profile at any time."

// This delay needs to be longer than the time it takes to load the first few sections of the home tab
const PRICE_RANGE_ONBOARDING_POPOVER_DELAY = 4000

export const ProgressiveOnboardingPriceRangeHome: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    sessionState: { isReady, deferHomeTooltipsThisSession },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const [hasPriceRange, setHasPriceRange] = useState<boolean | null>(null)

  const tracking = useTracking()

  const { dismiss } = GlobalStore.actions.progressiveOnboarding

  useEffect(() => {
    fetchPriceRange().then((result) => {
      setHasPriceRange(result.hasPriceRange)
    })
  }, [])

  // Must be reactive: the tab bar never unmounts, so a route read during render would
  // not re-run and would keep this eligible after we navigate away — and with a 4s delay
  // there is plenty of time to navigate away.
  const currentRoute = useCurrentRouteName()

  const handleDismiss = () => {
    dismiss(PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME)
  }

  const onPress = () => {
    handleDismiss()
    tracking.trackEvent(tracks.onPopoverPress())

    // We want to show the users the process of setting up a price range
    // So they can do it again next time when they want to
    switchTab("profile")
    setTimeout(() => {
      navigate("my-account/edit-price-range")
    }, 1000)
  }

  return (
    <OnboardingPopover
      id={PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME}
      when={
        hasPriceRange === false &&
        currentRoute === "Home" &&
        !!isReady &&
        !deferHomeTooltipsThisSession
      }
      delay={PRICE_RANGE_ONBOARDING_POPOVER_DELAY}
      placement="top"
      onDismiss={handleDismiss}
      title={
        <Touchable accessibilityRole="button" noFeedback onPress={onPress}>
          <Text variant="xs" color="mono0" fontWeight="bold">
            {PROGRESSIVE_ONBOARDING_PRICE_RANGE_TITLE}
          </Text>
        </Touchable>
      }
      content={
        <Touchable noFeedback accessibilityRole="button" onPress={onPress}>
          <Flex maxWidth={250}>
            <Text variant="xs" color="mono0">
              {PROGRESSIVE_ONBOARDING_PRICE_RANGE_CONTENT}
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
      type: PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME,
    }
  },
}
