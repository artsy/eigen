import { CreateAlertReminderModel } from "app/store/CreateAlertReminderModel"

export const CREATE_ALERT_REMINDER_ARTWORK_THRESHOLD = 40

const DAYS = 1000 * 60 * 60 * 24
const SECONDS = 1000

const MAX_TIMES_SHOWN = 2

export const useShouldShowReminder = (reminderState: CreateAlertReminderModel["reminderState"]) => {
  // forceReminder is used for testing purposes
  const forceReminder = true // TODO: add dev

  // unlimited for dev, 2 for production
  const maxTimesShown = forceReminder ? 123456 : MAX_TIMES_SHOWN
  // 10 seconds for dev, 7 days for production
  const timeInterval = forceReminder ? 10 * SECONDS : 7 * DAYS

  const shouldShowReminder =
    reminderState.timesShown <= maxTimesShown &&
    Date.now() - reminderState.dismissDate >= timeInterval

  return { shouldShowReminder, forceReminder }
}
