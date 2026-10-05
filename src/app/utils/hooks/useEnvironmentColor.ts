import { isRunningPreviewBundle } from "app/system/devTools/DevMenu/utils/previewPR"
import { useIsStaging } from "app/utils/hooks/useIsStaging"

export const useEnvironmentColor = () => {
  const isStaging = useIsStaging()

  if (isRunningPreviewBundle()) {
    return "orange100"
  }

  return isStaging ? "devpurple" : null
}
