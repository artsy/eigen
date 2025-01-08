import { CreateAlertPromptModel } from "app/store/CreateAlertPromptModel"
import { useExperimentVariant } from "app/utils/experiments/hooks"

export const useShouldShowPrompt = (promptState: CreateAlertPromptModel["promptState"]) => {
  const { payload } = useExperimentVariant("onyx_create-alert-prompt-experiment")

  // forcePrompt is used for testing purposes
  const forcePrompt = Boolean(payload && JSON.parse(payload)?.forcePrompt === "true")

  // unlimited for dev, 2 for production
  const maxTimesShown = forcePrompt ? 123456 : 2
  // 30 seconds for dev, 3 days for production
  const timeInterval = forcePrompt ? 30000 : 259200000

  const shouldShowPrompt =
    promptState.timesShown <= maxTimesShown && Date.now() - promptState.dismissDate >= timeInterval

  return { shouldShowPrompt, forcePrompt }
}
