import { CreateAlertPromptModel } from "app/store/CreateAlertPromptModel"

export const useShouldShowPrompt = (promptState: CreateAlertPromptModel["promptState"]) => {
  // unlimited for dev, 2 for production
  const maxTimesShown = __DEV__ ? 123456 : 2
  // 30 seconds for dev, 3 days for production
  const timeInterval = __DEV__ ? 30000 : 259200000

  const shouldShowPrompt =
    promptState.timesShown <= maxTimesShown && Date.now() - promptState.dismisDate >= timeInterval

  return shouldShowPrompt
}
