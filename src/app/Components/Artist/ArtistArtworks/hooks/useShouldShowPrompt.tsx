import { CreateAlertPromptModel } from "app/store/CreateAlertPromptModel"

export const useShouldShowPrompt = (promptState: CreateAlertPromptModel["promptState"]) => {
  // forceReminder is used for testing purposes
  const forceReminder = true // TODO: add dev

  // unlimited for dev, 2 for production
  const maxTimesShown = forceReminder ? 123456 : 2
  // 30 seconds for dev, 7 days for production
  const timeInterval = forceReminder ? 30000 : 604800000

  const shouldShowPrompt =
    promptState.timesShown <= maxTimesShown && Date.now() - promptState.dismissDate >= timeInterval

  return { shouldShowPrompt, forceReminder }
}
