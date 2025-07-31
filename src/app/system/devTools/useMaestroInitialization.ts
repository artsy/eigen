import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import { LaunchArguments } from "react-native-launch-arguments"

interface MaestroLaunchArguments {
  email?: string
  password?: string
  shouldSignOut?: boolean
}

export const useMaestroInitialization = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const { setPushPermissionsRequestedThisSession, setPushNotificationSettingsPromptSeen } =
    GlobalStore.actions.artsyPrefs.pushPromptLogic
  const { dismissAll } = GlobalStore.actions.progressiveOnboarding

  useEffect(() => {
    if (!ArtsyNativeModule.isBetaOrDev || !isHydrated) {
      return
    }

    // Hides the push permission prompt for Maestro tests
    setPushPermissionsRequestedThisSession(true)
    setPushNotificationSettingsPromptSeen(true)

    // Dismiss all progressive onboarding popovers for Maestro tests
    dismissAll()

    const args = LaunchArguments.value<MaestroLaunchArguments>()
    const email = args.email
    const password = args.password
    const shouldSignOut = args.shouldSignOut

    if (email && password) {
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
