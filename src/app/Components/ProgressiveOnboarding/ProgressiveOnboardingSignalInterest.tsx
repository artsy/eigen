import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useEffect } from "react"

export const ProgressiveOnboardingSignalInterest: React.FC = ({ children }) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()
  const isPartnerOfferEnabled = useFeatureFlag("AREnablePartnerOffer")
  const { trackEvent } = useProgressiveOnboardingTracking({
    name: "signal-interest",
    contextScreenOwnerType: OwnerType.saves,
    contextModule: ContextModule.saves,
  })

  const isDisplayable =
    isPartnerOfferEnabled && isReady && !isDismissed("signal-interest").status && isFocused

  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("signal-interest")
  }

  const isVisible = !!isDisplayable && isActive

  useEffect(() => {
    if (isVisible) {
      trackEvent()
    }
  }, [isVisible])

  return (
    <Popover
      visible={isVisible}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={clearActivePopover}
      placement="top"
      title={
        <Text variant="xs" color="white100">
          Learn more about saves and how to{"\n"}manage your preferences.
        </Text>
      }
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}
