import { GlobalStore, unsafe__getEnvironment } from "lib/store/GlobalStore"
import { Alert } from "react-native"
import { Middleware } from "react-relay-network-modern/node8"

// This middleware is responsible of signing the user out if his session expired
export const checkAuthenticationMiddleware = (): Middleware => {
  // we want to avoid running the forced logout more than once.
  const expiredTokens: Set<string> = new Set()
  return (next) => async (req) => {
    const res = await next(req)
    const authenticationToken = req.fetchOpts.headers["X-ACCESS-TOKEN"]
    if (res.errors?.length && authenticationToken && !expiredTokens.has(authenticationToken)) {
      const { gravityURL } = unsafe__getEnvironment()
      try {
        const result = await fetch(`${gravityURL}/api/v1/me`, {
          method: "HEAD",
          headers: {
            "X-ACCESS-TOKEN": authenticationToken,
          },
        })
        if (expiredTokens.has(authenticationToken)) {
          return res
        }
        if (result.status === 401) {
          expiredTokens.add(authenticationToken)
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

    return res
  }
}
