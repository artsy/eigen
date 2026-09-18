import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { getCurrentEmissionState, unsafe__getEnvironment } from "app/store/GlobalStore"
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
import type { Client, RequestParams } from "graphql-sse"
import type { GraphQLResponse } from "relay-runtime"

type ExpoFetch = typeof import("expo/fetch").fetch
type ExpoFetchResponse = Awaited<ReturnType<ExpoFetch>>
type SubscriptionClient = Pick<Client, "subscribe">
type MetaphysicsRequestParams = RequestParams & { documentID?: string }

let client: Client | null = null

export const createMetaphysicsSubscribe =
  (getSubscriptionClient: () => SubscriptionClient): SubscribeFn =>
  (request, variables) =>
    Observable.create((sink) =>
      getSubscriptionClient().subscribe(
        getSubscriptionRequest(request.id, request.name, request.text, variables),
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

// graphql-sse's public type only includes standard GraphQL parameters, but it serializes the
// request object as-is. Metaphysics accepts `documentID` and resolves it before Yoga handles SSE.
const getSubscriptionRequest = (
  requestID: string | null | undefined,
  requestName: string,
  requestText: string | null,
  variables: RequestParams["variables"]
): MetaphysicsRequestParams => {
  if (requestID) {
    return {
      operationName: requestName,
      query: requestName,
      documentID: requestID,
      variables,
    }
  }

  if (!requestText) {
    throw new Error("The subscription has neither a persisted query ID nor document text.")
  }

  return { operationName: requestName, query: requestText, variables }
}

const requestHeaders = () => {
  const { authenticationToken, userAgent, userID } = getCurrentEmissionState()

  // Do not forward Eigen's XApp token. Metaphysics owns authentication for its downstream
  // services, and an app token persisted for another environment would override its valid token.
  return {
    "User-Agent": userAgent,
    "X-TIMEZONE": LegacyNativeModules.ARCocoaConstantsModule.LocalTimeZone,
    "X-USER-ID": userID,
    "X-ACCESS-TOKEN": authenticationToken,
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
    let response = await fetch(...args)

    if (response.status === 404) {
      response = (await retryWithRequestDocument(fetch, args)) ?? response
    }

    if (response.headers.get("content-type")?.includes("text/event-stream")) {
      return response
    }

    const rejection = toSubscriptionRejection(response.status, await readGraphQLErrors(response))

    // graphql-sse only reads `ok`, `status` and `statusText` off a response it rejects.
    return rejection as unknown as ExpoFetchResponse
  }

// A newly shipped Eigen query can briefly be missing from Metaphysics' deployed query map.
// A 404 is returned before GraphQL execution, so retrying that request with the local document
// cannot repeat subscription side effects. The large query map stays lazy on the normal path.
const retryWithRequestDocument = async (
  fetch: ExpoFetch,
  args: Parameters<ExpoFetch>
): Promise<ExpoFetchResponse | null> => {
  const [input, init] = args

  if (typeof init?.body !== "string") {
    return null
  }

  let request: Record<string, unknown>

  try {
    request = JSON.parse(init.body) as Record<string, unknown>
  } catch {
    return null
  }

  const { documentID, ...requestWithoutDocumentID } = request

  if (typeof documentID !== "string") {
    return null
  }

  const queryMap = require("../../../../data/complete.queryMap.json") as Record<string, string>
  const query = queryMap[documentID]

  if (!query) {
    return null
  }

  return await fetch(input, {
    ...init,
    body: JSON.stringify({ ...requestWithoutDocumentID, query }),
  })
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
