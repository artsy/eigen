import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import { Platform } from "react-native"

export default function useSyncNativeAuthState() {
  const userId = GlobalStore.useAppState((store) => store.auth.userID)
  const userAccessToken = GlobalStore.useAppState((store) => store.auth.userAccessToken)
  const expiresIn = GlobalStore.useAppState((store) => store.auth.userAccessTokenExpiresIn)

  useEffect(() => {
    // Keep native iOS in sync with react-native auth state
    if (Platform.OS === "ios" && userAccessToken && expiresIn) {
      requestAnimationFrame(async () => {
        const user = await GlobalStore.actions.auth.getUser({ accessToken: userAccessToken })
        LegacyNativeModules.ArtsyNativeModule.updateAuthState(userAccessToken, expiresIn, user)
      })
    }
  }, [userAccessToken, expiresIn, userId])
}
