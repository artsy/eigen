import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import { LaunchArguments } from "react-native-launch-arguments"

interface MaestroLaunchArguments {
  email?: string
  password?: string
  shouldSignOut?: boolean
}

// TODO: We should not have this installed as a dependency in the app
// figure out how to get this conditionally working for maestro builds
export const useMaestroInitialization = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)

  useEffect(() => {
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
  }, [isLoggedIn])
}
