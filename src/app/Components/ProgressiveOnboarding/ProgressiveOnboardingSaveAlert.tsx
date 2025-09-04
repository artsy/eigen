import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Button, Flex, Join, Popover, Spacer, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_ALERT_CHAIN } from "app/store/ProgressiveOnboardingModel"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ProgressiveOnboardingSaveAlert: React.FC<React.PropsWithChildren> = ({ children }) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()
  const progressiveOnboardingAlerts = useFeatureFlag("AREnableProgressiveOnboardingAlerts")
  const { trackEvent } = useProgressiveOnboardingTracking({
    name: "alert-create",
    contextScreenOwnerType: OwnerType.artist,
    contextModule: ContextModule.artistArtworksFilterHeader,
  })

  const isDisplayable =
    isReady &&
    !isDismissed("alert-create").status &&
    // we only enable the alerts flow if the save artwork is completed
    isDismissed("save-artwork").status &&
    !!progressiveOnboardingAlerts &&
    isFocused
  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("alert-create")
  }

  const handleDismissAlertsOnboarding = () => {
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_CHAIN)
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
      variant="light"
      placement="right"
      title={
        <Text variant="xs" fontWeight="bold">
          Hunting for a particular artwork?
        </Text>
      }
      content={
        <Flex>
          <Join separator={<Spacer y={1} />}>
            <Text variant="xs">
              Set the filters for the artwork you’re looking for, then create your alert. We’ll let
              you know when there’s a matching work.
            </Text>

            <Flex flexDirection="row" justifyContent="flex-end">
              <Button variant="outline" onPress={handleDismiss} size="small">
                Learn more
              </Button>
              <Button
                variant="fillDark"
                onPress={handleDismissAlertsOnboarding}
                size="small"
                ml={1}
              >
                Got it
              </Button>
            </Flex>
          </Join>
        </Flex>
      }
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}
