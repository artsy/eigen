import { useIsFocused } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_CHAIN,
} from "app/store/ProgressiveOnboardingModel"

const DAYS = 1000 * 60 * 60 * 24

export const useDismissAlertReminder = () => {
  const isFocused = useIsFocused()
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const displayFirstTime = !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status
  // TODO: Bring it back when onboarding is working again.
  // isDismissed(PROGRESSIVE_ONBOARDING_ALERT_FINISH).status &&
  // Date.now() - isDismissed(PROGRESSIVE_ONBOARDING_ALERT_FINISH).timestamp > 7 * DAYS // 7 days

  const displaySecondTime =
    !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2).status &&
    isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status &&
    // display second time 7 days after the first reminder was dismissed
    Date.now() - isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).timestamp >= 7 * DAYS // 10 seconds: 10 * 1000

  const isDisplayable = isReady && (displayFirstTime || displaySecondTime) && isFocused

  const dismissSingleReminder = () => {
    setIsReady(false)

    if (!isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status) {
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1)
    } else {
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2)
    }
  }

  const dismissChainOfReminders = () => {
    setIsReady(false)
    dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_CHAIN)
  }

  const dismissChainOfRemindersAfterDelay = () => {
    if (
      Date.now() - isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).timestamp <
      2 * 60 * 1000
    ) {
      setIsReady(false)
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_CHAIN)
    }
  }

  return {
    isDisplayable,
    dismissSingleReminder,
    dismissChainOfReminders,
    dismissChainOfRemindersAfterDelay,
  }
}
