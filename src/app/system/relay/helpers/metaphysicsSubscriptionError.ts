import { NetworkError } from "graphql-sse"

const DEFAULT_ERROR_MESSAGE = "The subscription failed."

/**
 * A transport-level subscription failure, carrying the HTTP status when the server answered and
 * the GraphQL errors when it rejected the operation before streaming, so callers can branch on them
 * instead of pattern matching error messages.
 */
export class MetaphysicsSubscriptionError extends Error {
  readonly status: number | undefined
  readonly graphQLErrors: string[] | undefined
  readonly reason: unknown

  constructor(
    message: string,
    {
      status,
      graphQLErrors,
      reason,
    }: { status?: number; graphQLErrors?: string[]; reason?: unknown } = {}
  ) {
    super(message)
    this.name = "MetaphysicsSubscriptionError"
    this.status = status
    this.graphQLErrors = graphQLErrors
    this.reason = reason
  }
}

export const metaphysicsSubscriptionErrorStatus = (error: unknown) =>
  error instanceof MetaphysicsSubscriptionError ? error.status : undefined

/** True when Metaphysics rejected the operation with GraphQL errors instead of opening a stream. */
export const isMetaphysicsSubscriptionRejection = (error: unknown) =>
  error instanceof MetaphysicsSubscriptionError && !!error.graphQLErrors?.length

/**
 * A response graphql-sse will reject, standing in for a Metaphysics answer that never became a
 * stream. graphql-sse only reads `ok`, `status` and `statusText` before throwing, and keeps the
 * whole object on the error, which is how `graphQLErrors` survives the trip.
 */
export interface SubscriptionRejection {
  ok: false
  status: number
  statusText: string
  graphQLErrors: string[]
}

export const toSubscriptionRejection = (
  status: number,
  graphQLErrors: string[]
): SubscriptionRejection => ({
  ok: false,
  status,
  statusText: graphQLErrors.join("; ") || "The server did not return an event stream.",
  graphQLErrors,
})

const isSubscriptionRejection = (response: unknown): response is SubscriptionRejection =>
  typeof response === "object" && response !== null && "graphQLErrors" in response

export const toMetaphysicsSubscriptionError = (error: unknown): MetaphysicsSubscriptionError => {
  if (error instanceof NetworkError) {
    const rejection = isSubscriptionRejection(error.response) ? error.response : undefined

    return new MetaphysicsSubscriptionError(
      rejection?.graphQLErrors.length ? rejection.statusText : error.message,
      {
        status: error.response?.status,
        graphQLErrors: rejection?.graphQLErrors,
        reason: error,
      }
    )
  }

  if (error instanceof Error) {
    return new MetaphysicsSubscriptionError(error.message, { reason: error })
  }

  return new MetaphysicsSubscriptionError(DEFAULT_ERROR_MESSAGE, { reason: error })
}
