import { GlobalStore } from "app/store/GlobalStore"
import { setupSentry } from "app/system/errorReporting/setupSentry"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useEffect } from "react"

export const SentrySetup = () => {
  const environment = GlobalStore.useAppState((store) => store.devicePrefs.environment.env)
  const captureExceptionsInSentryOnDev = useDevToggle("DTCaptureExceptionsInSentryOnDev")
  const captureExceptions = !__DEV__ ? true : captureExceptionsInSentryOnDev
  useEffect(() => {
    setupSentry({
      environment: "production",
      captureExceptionsInSentryOnDev: captureExceptions,
    })
  }, [environment, captureExceptionsInSentryOnDev])
  return null
}
