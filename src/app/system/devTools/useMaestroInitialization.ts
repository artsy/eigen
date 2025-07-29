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

  useEffect(() => {
    // If the app is running in Maestro, we want to set the push notification settings prompt as seen
    // to avoid showing the prompt during tests.
    setPushNotificationSettingsPromptSeen(true)
    setPushPermissionsRequestedThisSession(true)

    if (!ArtsyNativeModule.isBetaOrDev || !isHydrated) {
      return
    }

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
