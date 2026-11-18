import { GlobalStore } from "app/store/GlobalStore"
import { FeatureName, features } from "app/store/config/features"
import { useEffect } from "react"
import { LogBox } from "react-native"
import { LaunchArguments } from "react-native-launch-arguments"

interface E2ELaunchArguments {
  email?: string
  password?: string
  shouldSignOut?: boolean
  useE2EInit?: boolean
  /** Comma-separated feature flag names to turn on, so flows can cover unreleased features. */
  enableFeatureFlags?: string
}

export const useE2EInitialization = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const userEmail = GlobalStore.useAppState((state) => state.auth.userEmail)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const { setPushPermissionsRequestedThisSession, setPushNotificationSettingsPromptSeen } =
    GlobalStore.actions.artsyPrefs.pushPromptLogic

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    const args = LaunchArguments.value<E2ELaunchArguments>()
    const email = args.email
    const password = args.password
    const shouldSignOut = args.shouldSignOut
    const useE2EInit = args.useE2EInit

    if (!useE2EInit) {
      return
    }

    // On a local dev build, LogBox's banner sits over the tab bar and takes taps meant for it.
    // QA and release builds have no LogBox, so this only changes local runs.
    if (__DEV__) {
      LogBox.ignoreAllLogs(true)
    }

    // Hides the push permission prompt for e2e tests
    setPushPermissionsRequestedThisSession(true)
    setPushNotificationSettingsPromptSeen(true)

    // Dismiss all progressive onboarding popovers for e2e tests
    GlobalStore.actions.artsyPrefs.features.setLocalOverride({
      key: "DTHideAllOnboardingPopovers",
      value: true,
    })

    args.enableFeatureFlags
      ?.split(",")
      .map((name) => name.trim())
      .filter((name): name is FeatureName => name in features)
      .forEach((key) => {
        GlobalStore.actions.artsyPrefs.features.setLocalOverride({ key, value: true })
      })

    // Signing in again while already signed in as the same account swaps the token after the
    // home screen has rendered, which resets the navigation mid-flow, so keep the session instead
    const isSignedInAsEmail = isLoggedIn && userEmail?.toLowerCase() === email?.toLowerCase()

    if (email && password && !isSignedInAsEmail) {
      GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email,
        password,
      })
    } else if (shouldSignOut && isLoggedIn) {
      GlobalStore.actions.auth.signOut()
    }
  }, [isHydrated])
}
