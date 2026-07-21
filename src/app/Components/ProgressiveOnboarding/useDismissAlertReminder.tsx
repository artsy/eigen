import { useIsFocused } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"
import { useCallback } from "react"

export const CREATE_ALERT_REMINDER_ARTWORK_THRESHOLD = 40
const DAYS = 1000 * 60 * 60 * 24

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

  const dismissNextCreateAlertReminder = useCallback(() => {
    setIsReady(false)

    if (!isDismissed("alert-create-reminder-1").status) {
      dismiss("alert-create-reminder-1")
    } else {
      dismiss("alert-create-reminder-2")
    }
  }, [setIsReady, isDismissed, dismiss])

  const dismissAllCreateAlertReminder = useCallback(() => {
    dismiss("alert-create-reminder-1")
    dismiss("alert-create-reminder-2")
  }, [dismiss])

  return {
    isDisplayable,
    dismissNextCreateAlertReminder,
    dismissAllCreateAlertReminder,
  }
}
