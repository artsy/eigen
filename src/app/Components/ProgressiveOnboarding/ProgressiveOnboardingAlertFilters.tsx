import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingAlertFilters: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()
  const progressiveOnboardingAlerts = useFeatureFlag("AREnableProgressiveOnboardingAlerts")
  const { trackEvent } = useProgressiveOnboardingTracking({
    name: "alert-select-filters",
    contextScreenOwnerType: OwnerType.artist,
    contextModule: ContextModule.artistArtworksFilterHeader,
  })

  const isDisplayable =
    isReady &&
    !isDismissed("alert-select-filters").status &&
    !!isDismissed("alert-create").status &&
    !!progressiveOnboardingAlerts &&
    isFocused
  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("alert-select-filters")
  }

  const isVisible = !!isDisplayable && isActive

  const { debouncedValue: debounceIsVisible } = useDebouncedValue({ value: isVisible, delay: 200 })

  return (
    <Popover
      visible={debounceIsVisible}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={clearActivePopover}
      onOpenComplete={trackEvent}
      placement="bottom"
      title={
        <Text variant="xs" color="mono0">
          First, select the relevant filters.
        </Text>
      }
    >
      <Flex pointerEvents="box-none">{children}</Flex>
    </Popover>
  )
}
