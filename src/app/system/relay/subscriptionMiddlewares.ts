import { addBreadcrumb } from "@sentry/react-native"
import { getCurrentEmissionState } from "app/store/GlobalStore"
import {
  isMetaphysicsSubscriptionRejection,
  metaphysicsSubscriptionErrorStatus,
} from "app/system/relay/helpers/metaphysicsSubscriptionError"
import { enforceSessionExpiry } from "app/system/relay/helpers/sessionExpiry"
import { logRelay } from "app/utils/loggers"
import { Observable } from "relay-runtime"
import type { GraphQLResponse, RequestParameters, Variables } from "relay-runtime"

export type SubscriptionRequest = Pick<RequestParameters, "id" | "name" | "text">

export type SubscribeFn = (
  request: SubscriptionRequest,
  variables: Variables
) => Observable<GraphQLResponse>

/**
 * Relay's `subscribeFn` runs outside the `RelayNetworkLayer` middleware chain, so these
 * wrappers replace the middlewares that still matter for a stream. They compose the same way
 * (outermost runs first) but stay deliberately few — see `defaultEnvironment` for what we
 * chose not to carry over.
 */
type SubscriptionMiddleware = (subscribe: SubscribeFn) => SubscribeFn

/** Mirrors `checkAuthenticationMiddleware`: a dead token has to sign the user out. */
export const withSessionExpiry: SubscriptionMiddleware = (subscribe) => (request, variables) =>
  Observable.create((sink) => {
    // Captured up front, like the middleware reads it off the request it sent: a stream can
    // outlive a re-login, and verifying the token that just replaced ours proves nothing.
    const { authenticationToken } = getCurrentEmissionState()

    const subscription = subscribe(request, variables).subscribe({
      next: (value) => {
        // graphql-sse delivers errors from an established stream as regular GraphQL payloads.
        // Check them before Relay turns the payload into an operation error downstream.
        if ("errors" in value && value.errors?.length) {
          void enforceSessionExpiry(authenticationToken)
        }

        sink.next(value)
      },
      complete: () => sink.complete(),
      error: (error: Error) => {
        const status = metaphysicsSubscriptionErrorStatus(error)
        // Metaphysics reports an expired session as a GraphQL error rather than a status code,
        // so any pre-stream rejection is worth verifying — as in the middleware, which checks
        // every response carrying errors.
        const shouldVerifySession =
          status === 401 || status === 403 || isMetaphysicsSubscriptionRejection(error)

        if (shouldVerifySession) {
          // Not awaited: the subscription already failed, and the sign out is a side effect.
          void enforceSessionExpiry(authenticationToken)
        }

        sink.error(error)
      },
    })

    return () => subscription.unsubscribe()
  })

/**
 * Mirrors `simpleLoggerMiddleware`, but counts events instead of recording one breadcrumb per
 * event: a subscription can stream hundreds of deltas and would evict the rest of the trail.
 * Exceptions are captured by the feature that owns the subscription, which knows why it ran.
 */
export const withSubscriptionBreadcrumbs: SubscriptionMiddleware =
  (subscribe) => (request, variables) =>
    Observable.create((sink) => {
      const operationName = request.name
      const startTime = Date.now()
      let eventCount = 0

      const trail = (message: string, data?: Record<string, unknown>) => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(1) + "s"

        addBreadcrumb({
          category: "relay-subscription",
          data: { ...data, duration, eventCount },
          message: `${message} ${operationName}`,
        })

        if (__DEV__ && logRelay) {
          console.log("RELAY-SUBSCRIPTION", message, operationName, {
            ...data,
            duration,
            eventCount,
          })
        }
      }

      trail("Subscribed to")

      const subscription = subscribe(request, variables).subscribe({
        next: (value) => {
          eventCount++
          sink.next(value)
        },
        complete: () => {
          trail("Completed")
          sink.complete()
        },
        error: (error: Error) => {
          trail("Failed", {
            message: error.message,
            status: metaphysicsSubscriptionErrorStatus(error),
          })
          sink.error(error)
        },
      })

      return () => subscription.unsubscribe()
    })
