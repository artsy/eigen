import { GlobalStore, useDevToggle } from "app/store/GlobalStore"
import { useEffect } from "react"
import { setupSentry } from "./sentrySetup"

export function useErrorReporting() {
  const environment = GlobalStore.useAppState((store) => store.artsyPrefs.environment.env)
  const captureExceptionsInSentryOnDev = useDevToggle("DTCaptureExceptionsInSentryOnDev")
  const captureExceptions = !__DEV__ ? true : captureExceptionsInSentryOnDev

  useEffect(() => {
    if (captureExceptions) {
      setupSentry({ environment })
    }
  }, [environment, captureExceptions])
}
