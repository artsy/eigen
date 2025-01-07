import { action, Action } from "easy-peasy"

export interface CreateAlertPromptModel {
  promptState: {
    timesShown: number
    dismisDate: number
  }
  updateTimesShown: Action<this>
  dismissPrompt: Action<this, boolean>
}

export const getCreateAlertPromptModel = (): CreateAlertPromptModel => ({
  promptState: {
    timesShown: 0,
    dismisDate: 0,
  },
  updateTimesShown: action((state) => {
    state.promptState.timesShown = state.promptState.timesShown + 1
  }),
  dismissPrompt: action((state, dontShowAgain) => {
    state.promptState = {
      timesShown: state.promptState.timesShown + (dontShowAgain ? 1 : 0),
      dismisDate: Date.now(),
    }
  }),
})
