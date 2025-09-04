import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingOfferSettings: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")
  const { trackEvent } = useProgressiveOnboardingTracking({
    name: "offer-settings",
    contextScreenOwnerType: OwnerType.saves,
    contextModule: ContextModule.saves,
  })

  const isDisplayable =
    isArtworkListOfferabilityEnabled &&
    isReady &&
    !isDismissed("offer-settings").status &&
    !!isDismissed("signal-interest").status &&
    isFocused

  const debouncedIsDisplayable = useDebouncedValue({
    value: isDisplayable,
    delay: 500,
  })

  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("offer-settings")
  }

  const isVisible = !!debouncedIsDisplayable.debouncedValue && isActive

  return (
    <Popover
      visible={isVisible}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={clearActivePopover}
      onOpenComplete={trackEvent}
      placement="top"
      title={
        <Text variant="xs" color="mono0">
          Edit list settings to indicate to{"\n"}galleries which artworks you want{"\n"}to receive
          offers on.
        </Text>
      }
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}
