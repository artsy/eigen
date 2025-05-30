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

  useEffect(() => {
    if (!ArtsyNativeModule.isBetaOrDev) return

    const args = LaunchArguments.value<MaestroLaunchArguments>()
    console.log("LaunchArgs: ", args)
    const email = args.email
    const password = args.password
    const shouldSignOut = args.shouldSignOut

    if (email && password) {
      console.log("LaunchArgs: Signing in with email and password")
      GlobalStore.actions.auth.signIn({
        oauthProvider: "email",
        oauthMode: "email",
        email,
        password,
      })
    } else if (shouldSignOut && isLoggedIn) {
      console.log("LaunchArgs: Signing out")
      GlobalStore.actions.auth.signOut()
    }
  }, [])
}
