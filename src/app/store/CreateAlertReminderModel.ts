import { action, Action } from "easy-peasy"

export interface CreateAlertReminderModel {
  reminderState: {
    timesShown: number
    dismissDate: number
  }
  updateTimesShown: Action<this>
  dismissReminder: Action<this>
  dontShowCreateAlertReminderAgain: Action<this>
}

export const getCreateAlertReminderModel = (): CreateAlertReminderModel => ({
  reminderState: {
    timesShown: 0,
    dismissDate: 0,
  },
  updateTimesShown: action((state) => {
    state.reminderState.timesShown = state.reminderState.timesShown + 1
  }),
  dismissReminder: action((state) => {
    state.reminderState = {
      ...state.reminderState,
      dismissDate: Date.now(),
    }
  }),
  dontShowCreateAlertReminderAgain: action((state) => {
    state.reminderState = {
      ...state.reminderState,
      timesShown: state.reminderState.timesShown + 1,
    }
  }),
})
