import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useDismissAlertReminder } from "app/Components/ProgressiveOnboarding/useDismissAlertReminder"
import {
  ProgressiveOnboardingTrackedName,
  useProgressiveOnboardingTracking,
} from "app/Components/ProgressiveOnboarding/useProgressiveOnboardingTracking"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"

interface ProgressiveOnboardingAlertReminderProps {
  visible: boolean
}
export const ProgressiveOnboardingAlertReminder: React.FC<
  ProgressiveOnboardingAlertReminderProps
> = ({ children, visible }) => {
  const { isDismissed } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  let nameToTrack: ProgressiveOnboardingTrackedName = "unknown"
  if (
    !isDismissed("alert-create-reminder-1").status &&
    !isDismissed("alert-create-reminder-2").status
  ) {
    nameToTrack = "alert-create-reminder-1"
  } else if (
    isDismissed("alert-create-reminder-1").status &&
    !isDismissed("alert-create-reminder-2").status
  ) {
    nameToTrack = "alert-create-reminder-2"
  }

  const { trackEvent } = useProgressiveOnboardingTracking({
    name: nameToTrack,
    contextScreenOwnerType: OwnerType.artist,
    contextModule: "artistArtworksFilterHeader" as ContextModule,
  })

  const { setActivePopover } = GlobalStore.actions.progressiveOnboarding

  const { isDisplayable, dismissNextCreateAlertReminder } = useDismissAlertReminder()

  const shouldDisplayReminder = isDisplayable && visible

  const { isActive } = useSetActivePopover(shouldDisplayReminder)

  const isVisible = shouldDisplayReminder && isActive

  const handleDismiss = () => {
    dismissNextCreateAlertReminder()
  }

  return (
    <Popover
      visible={isVisible}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={() => setActivePopover(undefined)}
      onOpenComplete={trackEvent}
      placement="bottom"
      title={
        <Text variant="xs" color="white100" fontWeight="bold">
          Searching for a particular artwork?
        </Text>
      }
      content={
        <Text variant="xs" color="white100">
          Create an alert and we’ll let you know when there’s a match.
        </Text>
      }
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}
