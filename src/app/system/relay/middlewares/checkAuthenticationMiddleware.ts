import { enforceSessionExpiry } from "app/system/relay/helpers/sessionExpiry"
import { Middleware } from "react-relay-network-modern"

// This middleware is responsible of signing the user out if their session expired.
// Any response carrying errors is suspicious enough to verify, since Metaphysics reports an
// expired token as a GraphQL error rather than a status code.
export const checkAuthenticationMiddleware = (): Middleware => {
  return (next) => async (req) => {
    const res = await next(req)

    if (res.errors?.length) {
      await enforceSessionExpiry(req.fetchOpts.headers["X-ACCESS-TOKEN"])
    }

    return res
  }
}
