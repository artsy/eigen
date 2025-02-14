import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useDismissAlertReminder } from "app/Components/ProgressiveOnboarding/useDismissAlertReminder"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"

interface ProgressiveOnboardingAlertReminderProps {
  visible: boolean
}
export const ProgressiveOnboardingAlertReminder: React.FC<
  ProgressiveOnboardingAlertReminderProps
> = ({ children, visible }) => {
  const { setActivePopover } = GlobalStore.actions.progressiveOnboarding

  const { isDisplayable, dismissNextCreateAlertReminder } = useDismissAlertReminder()

  const shouldDisplayReminder = isDisplayable && visible

  const { isActive } = useSetActivePopover(shouldDisplayReminder)

  const handleDismiss = () => {
    dismissNextCreateAlertReminder()
  }

  return (
    <Popover
      visible={!!shouldDisplayReminder && isActive}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      onCloseComplete={() => setActivePopover(undefined)}
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
