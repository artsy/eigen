import { ActionType, ContextModule, OwnerType, TappedPopover } from "@artsy/cohesion"
import { Flex, Popover, Text, Touchable } from "@artsy/palette-mobile"
import { fetchPriceRange } from "app/Components/PriceRange/fetchPriceRange"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME } from "app/store/ProgressiveOnboardingModel"
// eslint-disable-next-line no-restricted-imports
import { navigate, switchTab } from "app/system/navigation/navigate"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
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
    isDismissed: isDismissedFn,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const [hasPriceRange, setHasPriceRange] = useState<boolean | null>(null)

  const tracking = useTracking()

  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding

  const { trackEvent } = useProgressiveOnboardingTracking({
    name: PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME,
    contextScreenOwnerType: OwnerType.home,
    contextModule: ContextModule.bottomTabs,
  })

  useEffect(() => {
    fetchPriceRange().then((result) => {
      setHasPriceRange(result.hasPriceRange)
    })
  }, [])

  const currentRoute = internal_navigationRef.current?.getCurrentRoute()?.name

  const isDismissed = isDismissedFn(PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME).status

  const isPriceRangePopoverDisplayable =
    // We don't want to show the price range popover if the user has already set a price range
    hasPriceRange === false &&
    // Only show the popover if you are on the home screen
    currentRoute === "Home" &&
    !isDismissed &&
    isReady

  const { isActive, clearActivePopover } = useSetActivePopover(isPriceRangePopoverDisplayable)

  const debounceIsActive = useDebouncedValue({
    value: isActive,
    delay: PRICE_RANGE_ONBOARDING_POPOVER_DELAY,
  })

  const handleDismiss = () => {
    setIsReady(false)
    dismiss(PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME)
  }

  const isVisible =
    debounceIsActive.debouncedValue &&
    // We are intentionally checking for isDismissed again here to ensure that the popover is dismissed without delay
    !isDismissed

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
      type: PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME,
    }
  },
}
