import { action, Action } from "easy-peasy"

export const MAX_SHOWN_RECENT_PRICE_RANGES = 5

export interface CreateAlertPromptModel {
  promptState: {
    timesShown: number
    dismisDate: number
  }
  updateTimesShown: Action<this>
  dismissPrompt: Action<this>
}

export const getCreateAlertPromptModel = (): CreateAlertPromptModel => ({
  promptState: {
    timesShown: 0,
    dismisDate: 0,
  },
  updateTimesShown: action((state) => {
    state.promptState.timesShown = state.promptState.timesShown + 1
  }),
  dismissPrompt: action((state) => {
    state.promptState = {
      timesShown: state.promptState.timesShown + 1,
      dismisDate: Date.now(),
    }
  }),
})
