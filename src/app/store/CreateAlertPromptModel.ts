import { action, Action } from "easy-peasy"

export interface CreateAlertPromptModel {
  promptState: {
    timesShown: number
    dismissDate: number
  }
  updateTimesShown: Action<this>
  dismissPrompt: Action<this>
  dontShowCreateAlertPromptAgain: Action<this>
}

export const getCreateAlertPromptModel = (): CreateAlertPromptModel => ({
  promptState: {
    timesShown: 0,
    dismissDate: 0,
  },
  updateTimesShown: action((state) => {
    state.promptState.timesShown = state.promptState.timesShown + 1
  }),
  dismissPrompt: action((state) => {
    state.promptState = {
      ...state.promptState,
      dismissDate: Date.now(),
    }
  }),
  dontShowCreateAlertPromptAgain: action((state) => {
    state.promptState = {
      ...state.promptState,
      timesShown: state.promptState.timesShown + 1,
    }
  }),
})
