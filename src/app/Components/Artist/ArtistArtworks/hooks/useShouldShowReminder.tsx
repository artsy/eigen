import { CreateAlertReminderModel } from "app/store/CreateAlertReminderModel"

export const CREATE_ALERT_REMINDER_ARTWORK_THRESHOLD = 40

const DAYS = 1000 * 60 * 60 * 24

const MAX_TIMES_SHOWN = 2

export const useShouldShowReminder = (reminderState: CreateAlertReminderModel["reminderState"]) => {
  const maxTimesShown = MAX_TIMES_SHOWN
  const timeInterval = 7 * DAYS

  const shouldShowReminder =
    reminderState.timesShown <= maxTimesShown &&
    Date.now() - reminderState.dismissDate >= timeInterval

  return { shouldShowReminder }
}
