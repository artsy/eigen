import { Button, Flex, Message, Popover, Text } from "@artsy/palette-mobile"
import { useDismissAlertReminder } from "app/Components/ProgressiveOnboarding/useDismissAlertReminder"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { useExperimentVariant } from "app/utils/experiments/hooks"

interface ProgressiveOnboardingAlertReminderProps {
  visible: boolean
  onPress?: () => void
}
export const ProgressiveOnboardingAlertReminder: React.FC<
  ProgressiveOnboardingAlertReminderProps
> = ({ children, visible, onPress }) => {
  const { variant } = useExperimentVariant("onyx_create-alert-prompt-experiment")
  const { setActivePopover } = GlobalStore.actions.progressiveOnboarding

  const { isDisplayable, dismissSingleReminder, dismissChainOfReminders } =
    useDismissAlertReminder()

  const shouldDisplayReminder = isDisplayable && visible

  const { isActive } = useSetActivePopover(shouldDisplayReminder)

  const handleDismiss = () => {
    dismissSingleReminder()
  }

  const handleDismissChain = () => {
    dismissChainOfReminders()
  }

  if (variant === "variant-a") {
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

  if (variant === "variant-b" && shouldDisplayReminder && isActive) {
    return (
      <Message
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
                setActivePopover(undefined)
              }}
            >
              Create Alert
            </Button>
          )
        }}
        iconPosition="bottom"
        showCloseButton
        onClose={() => {
          handleDismiss()
          setActivePopover(undefined)
        }}
      />
    )
  }

  return null
}
