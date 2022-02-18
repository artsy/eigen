// import Sentry from "@sentry/react-native"
// import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
// import { useEffect } from "react"
// import { setupSentry } from "./sentrySetup"

export function useSentryConfig() {
  //   // const environment = GlobalStore.useAppState((store) => store.config.environment.env)
  //   // const captureExceptionsInSentryOnDev = useFeatureFlag("ARCaptureExceptionsInSentryOnDev")
  //   // const captureExceptions = !__DEV__ ? true : captureExceptionsInSentryOnDev
  //   // useEffect(() => {
  //   //   setupSentry({ environment }, captureExceptions)
  //   // }, [environment, captureExceptionsInSentryOnDev])
  // const userID = GlobalStore.useAppState((store) => store.auth.userID) ?? "none"
  //   // useEffect(() => {
  //   //   Sentry.setUser({ id: userID })
  //   // }, [userID])
}
