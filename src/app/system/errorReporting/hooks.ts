import { GlobalStore } from "app/store/GlobalStore"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useEffect } from "react"
import { setupSentry } from "./sentrySetup"

export function useErrorReporting() {
  const environment = GlobalStore.useAppState((store) => store.devicePrefs.environment.env)
  const captureExceptionsInSentryOnDev = useDevToggle("DTCaptureExceptionsInSentryOnDev")
  const captureExceptions = !__DEV__ ? true : captureExceptionsInSentryOnDev

  useEffect(() => {
    if (captureExceptions) {
      setupSentry({ environment })
    }
  }, [environment, captureExceptions])
}
