import { getCurrentEmissionState, GlobalStore, unsafe__getEnvironment } from "lib/store/GlobalStore"
import { Alert } from "react-native"
import { Middleware } from "react-relay-network-modern/node8"

// This middleware is responsible of signing the user out if his session expired
export const checkAuthenticationMiddleware = (): Middleware => {
  let sessionDidExpire = false
  return (next) => async (req) => {
    const res = await next(req)
    if (res.errors?.length && !sessionDidExpire) {
      const { authenticationToken } = getCurrentEmissionState()
      const { gravityURL } = unsafe__getEnvironment()
      try {
        const result = await fetch(`${gravityURL}/api/v1/me`, {
          method: "HEAD",
          headers: {
            "X-ACCESS-TOKEN": authenticationToken,
          },
        })
        if (result.status === 401) {
          sessionDidExpire = true
          GlobalStore.actions.signOut()
          setTimeout(() => {
            Alert.alert("Session expired", "Please log in to continue.")
          }, 200)
        }
      } catch (e) {
        if (__DEV__) {
          console.error(e)
        }
        // network problem
        Alert.alert("Network unavailable", "Please check your connection.")
      }
    }

    if (!res.errors?.length) {
      sessionDidExpire = false
    }
    return res
  }
}
