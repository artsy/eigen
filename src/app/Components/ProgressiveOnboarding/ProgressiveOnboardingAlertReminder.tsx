import { Button, Flex, Message, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2,
} from "app/store/ProgressiveOnboardingModel"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { useEffect } from "react"

const DAYS = 1000 * 60 * 60 * 24

interface ProgressiveOnboardingAlertReminderProps {
  visible: boolean
}
export const ProgressiveOnboardingAlertReminder: React.FC<
  ProgressiveOnboardingAlertReminderProps
> = ({ children, visible }) => {
  const { variant, trackExperiment: trackCreateAlertPromptExperiment } = useExperimentVariant(
    "onyx_create-alert-prompt-experiment"
  )

  useEffect(() => {
    trackCreateAlertPromptExperiment()
  }, [])

  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()

  const displayFirstTime = !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status
  // TODO: Bring it back when onboarding is working again.
  // isDismissed(PROGRESSIVE_ONBOARDING_ALERT_FINISH).status &&
  // Date.now() - isDismissed(PROGRESSIVE_ONBOARDING_ALERT_FINISH).timestamp > 7 * DAYS // 7 days

  const displaySecondTime =
    !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2).status &&
    isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status &&
    Date.now() - isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).timestamp > 10 * 1000 // 30 seconds

  const isDisplayable = isReady && (displayFirstTime || displaySecondTime) && isFocused && visible

  const { clearActivePopover, isActive } = useSetActivePopover(isDisplayable)

  console.log({
    isDisplayable,
    displayFirstTime,
    displaySecondTime,
    one: isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1),
    two: isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2),
    isReady,
    isActive,
  })

  const handleDismiss = () => {
    setIsReady(false)

    if (!isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status) {
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1)
    } else {
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2)
    }
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

  if (isDisplayable) {
    return (
      <Message
        // TODO: Check if we need to call clearActivePopover here
        title="Searching for a particular artwork?"
        titleStyle={{ variant: "sm-display", fontWeight: "bold" }}
        text="Create an Alert and we’ll let you know when there’s a match."
        variant="dark"
        IconComponent={() => {
          return (
            <>
              <Button variant="outline" size="small" onPress={handleDismiss}>
                Create Alert
              </Button>
            </>
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
