import { useIsFocused } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"

export const CREATE_ALERT_REMINDER_ARTWORK_THRESHOLD = 40
const DAYS = 1000 * 60 * 60 * 24
const MINUTES = 1000 * 60

export const useDismissAlertReminder = () => {
  const isFocused = useIsFocused()
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)

  const displayFirstTime = isDismissed("alert-finish").status

  const displaySecondTime =
    !isDismissed("alert-create-reminder-2").status &&
    isDismissed("alert-create-reminder-1").status &&
    // display second time 7 days after the first reminder was dismissed
    Date.now() - isDismissed("alert-create-reminder-1").timestamp >= 7 * DAYS

  const isDisplayable = isReady && (displayFirstTime || displaySecondTime) && isFocused

  const dismissSingleReminder = () => {
    setIsReady(false)

    if (!isDismissed("alert-create-reminder-1").status) {
      dismiss("alert-create-reminder-1")
    } else {
      dismiss("alert-create-reminder-2")
    }
  }

  const dismissChainOfRemindersAfterInteraction = () => {
    if (isDismissed("alert-create-reminder-2").status) {
      return
    }
    /**
     * Dismiss the second reminder if the user clicks the Create Alert
     * button within two minutes of dismissing the first reminder.
     */
    if (Date.now() - isDismissed("alert-create-reminder-1").timestamp < 2 * MINUTES) {
      setIsReady(false)
      dismiss("alert-create-reminder-2")
    }
  }

  return {
    isDisplayable,
    dismissSingleReminder,
    dismissChainOfRemindersAfterInteraction,
  }
}
