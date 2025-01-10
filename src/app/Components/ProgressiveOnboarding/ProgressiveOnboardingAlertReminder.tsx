import { Button, Flex, Message, Popover, Text } from "@artsy/palette-mobile"
import { useDismissAlertReminder } from "app/Components/ProgressiveOnboarding/useDismissAlertReminder"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { useExperimentVariant } from "app/utils/experiments/hooks"

interface ProgressiveOnboardingAlertReminderProps {
  visible: boolean
  onPress?: () => void
}
export const ProgressiveOnboardingAlertReminder: React.FC<
  ProgressiveOnboardingAlertReminderProps
> = ({ children, visible, onPress }) => {
  const { variant } = useExperimentVariant("onyx_create-alert-prompt-experiment")

  const { isDisplayable, dismissSingleReminder, dismissChainOfReminders } =
    useDismissAlertReminder()

  const shouldDisplayReminder = isDisplayable && visible

  const { clearActivePopover /* isActive */ } = useSetActivePopover(shouldDisplayReminder)

  const handleDismiss = () => {
    dismissSingleReminder()
  }

  const handleDismissChain = () => {
    dismissChainOfReminders()
  }

  if (variant === "variant-a") {
    return (
      <Popover
        // TODO: Check why isActive is not working and always false
        // visible={!!shouldDisplayReminder && isActive}
        visible={!!shouldDisplayReminder}
        onDismiss={handleDismiss}
        onPressOutside={handleDismiss}
        onCloseComplete={clearActivePopover}
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

  // TODO: Check why isActive is not working and always false
  if (variant === "variant-b" && shouldDisplayReminder /* && isActive */) {
    return (
      <Message
        // TODO: Check if we need to call clearActivePopover here
        title="Searching for a particular artwork?"
        titleStyle={{ variant: "sm-display", fontWeight: "bold" }}
        text="Create an Alert and we’ll let you know when there’s a match."
        variant="dark"
        IconComponent={() => {
          return (
            <Button
              variant="outline"
              size="small"
              onPress={() => {
                onPress?.()
                handleDismissChain()
              }}
            >
              Create Alert
            </Button>
          )
        }}
        iconPosition="bottom"
        showCloseButton
        onClose={handleDismiss}
      />
    )
  }

  return null
}
