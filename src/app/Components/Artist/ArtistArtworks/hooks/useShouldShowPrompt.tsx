import { CreateAlertPromptModel } from "app/store/CreateAlertPromptModel"
import { useExperimentVariant } from "app/utils/experiments/hooks"

export const useShouldShowPrompt = (promptState: CreateAlertPromptModel["promptState"]) => {
  const { payload } = useExperimentVariant("onyx_create-alert-prompt-experiment")

  // unlimited for dev, 2 for production
  const maxTimesShown = /* __DEV__ ? 123456 : */ 2
  // 30 seconds for dev, 3 days for production
  const timeInterval = /* __DEV__ ? 30000 : */ 259200000

  const forcePrompt = Boolean(payload && JSON.parse(payload)?.forcePrompt === "true")

  const shouldShowPrompt =
    (promptState.timesShown <= maxTimesShown &&
      Date.now() - promptState.dismisDate >= timeInterval) ||
    forcePrompt

  return shouldShowPrompt
}
