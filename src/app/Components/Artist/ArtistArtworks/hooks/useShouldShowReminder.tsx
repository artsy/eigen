import { CreateAlertReminderModel } from "app/store/CreateAlertReminderModel"

export const CREATE_ALERT_REMINDER_ARTWORK_THRESHOLD = 12
export const useShouldShowReminder = (reminderState: CreateAlertReminderModel["reminderState"]) => {
  // forceReminder is used for testing purposes
  const forceReminder = true // TODO: add dev

  // unlimited for dev, 2 for production
  const maxTimesShown = forceReminder ? 123456 : 2
  // 30 seconds for dev, 7 days for production
  const timeInterval = forceReminder ? 30000 : 604800000

  const shouldShowReminder =
    reminderState.timesShown <= maxTimesShown &&
    Date.now() - reminderState.dismissDate >= timeInterval

  return { shouldShowReminder, forceReminder }
}
