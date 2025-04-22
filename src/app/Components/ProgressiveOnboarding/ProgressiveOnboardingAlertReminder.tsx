import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useDismissAlertReminder } from "app/Components/ProgressiveOnboarding/useDismissAlertReminder"
import { useProgressiveOnboardingTracking } from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"

interface ProgressiveOnboardingAlertReminderProps {
  visible: boolean
}
export const ProgressiveOnboardingAlertReminder: React.FC<
  ProgressiveOnboardingAlertReminderProps
> = ({ children, visible }) => {
  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const { trackEvent } = useProgressiveOnboardingTracking({
    name: !isDismissed("alert-create-reminder-1").status
      ? "alert-create-reminder-1"
      : "alert-create-reminder-2",
    contextScreenOwnerType: OwnerType.artist,
    contextModule: ContextModule.artistArtworksFilterHeader,
  })

  const { setActivePopover } = GlobalStore.actions.progressiveOnboarding

  const { isDisplayable, dismissNextCreateAlertReminder } = useDismissAlertReminder()

  const shouldDisplayReminder = isDisplayable && visible

  const { isActive } = useSetActivePopover(shouldDisplayReminder)

  const isVisible = shouldDisplayReminder && isActive

  const handleDismiss = () => {
    dismissNextCreateAlertReminder()
  }

  const { debouncedValue: debounceIsVisible } = useDebouncedValue({ value: isVisible, delay: 200 })

  return (
    <Popover
      visible={debounceIsVisible}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={() => setActivePopover(undefined)}
      onOpenComplete={trackEvent}
      placement="bottom"
      title={
        <Text variant="xs" color="mono0" fontWeight="bold">
          Searching for a particular artwork?
        </Text>
      }
      content={
        <Text variant="xs" color="mono0">
          Create an alert and we’ll let you know when there’s a match.
        </Text>
      }
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}
