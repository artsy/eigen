import { Button, Flex, Message, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_CHAIN,
} from "app/store/ProgressiveOnboardingModel"
import { useExperimentVariant } from "app/utils/experiments/hooks"

const DAYS = 1000 * 60 * 60 * 24

interface ProgressiveOnboardingAlertReminderProps {
  visible: boolean
  onPress?: () => void
}
export const ProgressiveOnboardingAlertReminder: React.FC<
  ProgressiveOnboardingAlertReminderProps
> = ({ children, visible, onPress }) => {
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()

  const { variant } = useExperimentVariant("onyx_create-alert-prompt-experiment")

  const displayFirstTime = !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status
  // TODO: Bring it back when onboarding is working again.
  // isDismissed(PROGRESSIVE_ONBOARDING_ALERT_FINISH).status &&
  // Date.now() - isDismissed(PROGRESSIVE_ONBOARDING_ALERT_FINISH).timestamp > 7 * DAYS // 7 days

  const displaySecondTime =
    !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2).status &&
    isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status &&
    // TODO: make it 7 * DAYS
    Date.now() - isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).timestamp > 10 * 1000 // 30 seconds

  const isDisplayable = isReady && (displayFirstTime || displaySecondTime) && isFocused && visible

  const { clearActivePopover /* isActive */ } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)

    if (!isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status) {
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1)
    } else {
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2)
    }
  }

  const handleDismissChain = () => {
    setIsReady(false)
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_CHAIN)
  }

  if (variant === "variant-a") {
    return (
      <Popover
        // TODO: Check why isActive is not working and always false
        // visible={!!isDisplayable && isActive}
        visible={!!isDisplayable}
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
  if (variant === "variant-b" && isDisplayable /* && isActive */) {
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
