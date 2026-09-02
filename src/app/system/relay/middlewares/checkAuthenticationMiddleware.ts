import { captureMessage } from "@sentry/react-native"
import { GlobalStore, unsafe__getEnvironment } from "app/store/GlobalStore"
import { Alert } from "react-native"
import { Middleware } from "react-relay-network-modern"

// A freshly issued token (e.g. right after sign up) can briefly 401 on /me before it
// propagates, so we confirm the session is really gone before forcing a sign out.
const ME_CHECK_MAX_ATTEMPTS = 3
const ME_CHECK_RETRY_DELAY = 500

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface SessionCheckResult {
  expired: boolean
  recoveredAfterTransient401: boolean
  attempts: number
}

const checkSession = async (gravityURL: string, token: string): Promise<SessionCheckResult> => {
  let sawTransient401 = false
  for (let attempt = 0; attempt < ME_CHECK_MAX_ATTEMPTS; attempt++) {
    const result = await fetch(`${gravityURL}/api/v1/me`, {
      method: "HEAD",
      headers: {
        "X-ACCESS-TOKEN": token,
      },
    })
    if (result.status !== 401) {
      return { expired: false, recoveredAfterTransient401: sawTransient401, attempts: attempt + 1 }
    }
    sawTransient401 = true
    if (attempt < ME_CHECK_MAX_ATTEMPTS - 1) {
      await delay(ME_CHECK_RETRY_DELAY)
    }
  }
  return { expired: true, recoveredAfterTransient401: false, attempts: ME_CHECK_MAX_ATTEMPTS }
}

// This middleware is responsible of signing the user out if their session expired
export const checkAuthenticationMiddleware = (): Middleware => {
  // We want to avoid running the forced logout more than once.
  const expiredTokens: Set<string> = new Set()
  // Dedup per token so the recovery signal is counted per-incident, not per-request.
  const recoveredTokens: Set<string> = new Set()
  return (next) => async (req) => {
    const res = await next(req)
    const authenticationToken = req.fetchOpts.headers["X-ACCESS-TOKEN"]
    // authenticationToken can be `undefined` if the user was logged out *just* before this request was executed
    if (res.errors?.length && authenticationToken && !expiredTokens.has(authenticationToken)) {
      const { gravityURL } = unsafe__getEnvironment()
      try {
        const { expired, recoveredAfterTransient401, attempts } = await checkSession(
          gravityURL,
          authenticationToken
        )
        // Requests are not necessarily executed sequentially so we need to check that another request
        // didn't make it here already while we were awaiting.
        if (expiredTokens.has(authenticationToken)) {
          return res
        }
        if (recoveredAfterTransient401 && !recoveredTokens.has(authenticationToken)) {
          recoveredTokens.add(authenticationToken)
          captureMessage("checkAuthentication: /me recovered after transient 401", {
            level: "info",
            tags: { authOutcome: "recovered_after_transient_401" },
            extra: { attempts },
          })
        }
        if (expired) {
          expiredTokens.add(authenticationToken)
          captureMessage("checkAuthentication: signed out on expired session", {
            level: "info",
            tags: { authOutcome: "signed_out_expired" },
          })
          await GlobalStore.actions.auth.signOut()
          // There is a race condition that prevents the onboarding slideshow from starting if we call an Alert
          // here synchronously, so we need to wait a few ticks.
          setTimeout(() => {
            Alert.alert("Session expired", "Please log in to continue.")
          }, 200)
        }
      } catch (e) {
        if (__DEV__) {
          console.error(e)
        }
      }
    }

    return res
  }
}
