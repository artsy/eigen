import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import {
  getCurrentEmissionState,
  globalStoreInstance,
  unsafe__getEnvironment,
} from "app/store/GlobalStore"
import {
  toMetaphysicsSubscriptionError,
  toSubscriptionRejection,
} from "app/system/relay/helpers/metaphysicsSubscriptionError"
import {
  SubscribeFn,
  withSessionExpiry,
  withSubscriptionBreadcrumbs,
} from "app/system/relay/subscriptionMiddlewares"
import { createClient } from "graphql-sse"
import { Observable } from "relay-runtime"
import type { Client } from "graphql-sse"
import type { GraphQLResponse } from "relay-runtime"

type ExpoFetch = typeof import("expo/fetch").fetch
type ExpoFetchResponse = Awaited<ReturnType<ExpoFetch>>
type SubscriptionClient = Pick<Client, "subscribe">

let client: Client | null = null

export const createMetaphysicsSubscribe =
  (getSubscriptionClient: () => SubscriptionClient): SubscribeFn =>
  (request, variables) =>
    Observable.create((sink) =>
      getSubscriptionClient().subscribe(
        {
          operationName: request.name,
          query: requestDocument(request.id, request.text),
          variables,
        },
        {
          next: (response) => sink.next(response as GraphQLResponse),
          error: (error) => sink.error(toMetaphysicsSubscriptionError(error)),
          complete: () => sink.complete(),
        }
      )
    )

function getClient(): SubscriptionClient {
  if (!client) {
    client = createClient({
      url: () => unsafe__getEnvironment().metaphysicsURL,
      headers: requestHeaders,
      fetchFn: createSubscriptionFetch(getExpoFetch()),
      // expo/fetch only accepts "include" or "omit"; graphql-sse defaults to "same-origin".
      credentials: "include",
      // Retrying a mutation-like subscription could repeat its side effects.
      retryAttempts: 0,
    })
  }

  return client
}

// Outermost runs first, mirroring the middleware order in `defaultEnvironment`.
export const metaphysicsSubscribe = withSubscriptionBreadcrumbs(
  withSessionExpiry(createMetaphysicsSubscribe(getClient))
)

// Deliberately duplicates `persistedQueryMiddleware`: graphql-sse requires the document text,
// so a subscription cannot be sent as a `documentID` the way our queries are.
const requestDocument = (requestID: string | null | undefined, requestText: string | null) => {
  if (requestText) {
    return requestText
  }

  const queryMap = require("../../../../data/complete.queryMap.json") as Record<string, string>
  const document = requestID ? queryMap[requestID] : undefined

  if (!document) {
    throw new Error("The subscription document is missing from the query map.")
  }

  return document
}

const requestHeaders = () => {
  const { authenticationToken, userAgent, userID } = getCurrentEmissionState()
  const xAppToken = globalStoreInstance().getState()?.auth.xAppToken

  return {
    "User-Agent": userAgent,
    "X-TIMEZONE": LegacyNativeModules.ARCocoaConstantsModule.LocalTimeZone,
    "X-USER-ID": userID,
    "X-ACCESS-TOKEN": authenticationToken,
    ...(xAppToken ? { "X-XAPP-TOKEN": xAppToken } : {}),
  }
}

// React Native's own fetch is XHR based and cannot stream a response, so graphql-sse reads the
// server-sent events through expo/fetch instead. That needs two WinterCG globals: `TextDecoder`,
// installed by `import "expo"` in index.js, and `ReadableStream`, installed next to it.
// Required lazily so the first subscription pays for it, not app startup.
const getExpoFetch = (): ExpoFetch => require("expo/fetch").fetch as ExpoFetch

/**
 * Metaphysics can reject an operation before streaming with a normal GraphQL response rather
 * than an event stream. graphql-sse never checks the content type, so it would hand that JSON to
 * its SSE parser, find no events and report an opaque "Connection closed while having active
 * streams", losing the reason. Translate it into a rejection graphql-sse does report.
 */
export const createSubscriptionFetch =
  (fetch: ExpoFetch): ExpoFetch =>
  async (...args) => {
    const response = await fetch(...args)

    if (response.headers.get("content-type")?.includes("text/event-stream")) {
      return response
    }

    const rejection = toSubscriptionRejection(response.status, await readGraphQLErrors(response))

    // graphql-sse only reads `ok`, `status` and `statusText` off a response it rejects.
    return rejection as unknown as ExpoFetchResponse
  }

const readGraphQLErrors = async (response: ExpoFetchResponse) => {
  try {
    const body = (await response.json()) as { errors?: { message?: string }[] } | null

    return (body?.errors ?? [])
      .map((error) => error?.message)
      .filter((message): message is string => !!message)
  } catch {
    // A proxy or CDN can answer with something that is neither an event stream nor GraphQL.
    return []
  }
}
