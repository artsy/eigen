import { useIsFocused } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_FINISH,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2,
} from "app/store/ProgressiveOnboardingModel"

export const CREATE_ALERT_REMINDER_ARTWORK_THRESHOLD = 40
const DAYS = 1000 * 60 * 60 * 24
const MINUTES = 1000 * 60
const SECONDS = 1000

export const useDismissAlertReminder = () => {
  const isFocused = useIsFocused()
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const interval = __DEV__ ? 10 * SECONDS : 7 * DAYS

  const displayFirstTime =
    isDismissed(PROGRESSIVE_ONBOARDING_ALERT_FINISH).status &&
    Date.now() - isDismissed(PROGRESSIVE_ONBOARDING_ALERT_FINISH).timestamp >= interval

  const displaySecondTime =
    !isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2).status &&
    isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status &&
    // display second time 7 days after the first reminder was dismissed
    Date.now() - isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).timestamp >= interval

  const isDisplayable = isReady && (displayFirstTime || displaySecondTime) && isFocused

  const dismissSingleReminder = () => {
    setIsReady(false)

    if (!isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).status) {
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1)
    } else {
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2)
    }
  }

  const dismissChainOfRemindersAfterInteraction = () => {
    /**
     * Dismiss the second reminder if the user clicks the Create Alert
     * button within two minutes of dismissing the first reminder.
     */
    if (Date.now() - isDismissed(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1).timestamp < 2 * MINUTES) {
      setIsReady(false)
      dismiss(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2)
    }
  }

  return {
    isDisplayable,
    dismissSingleReminder,
    dismissChainOfRemindersAfterInteraction,
  }
}
