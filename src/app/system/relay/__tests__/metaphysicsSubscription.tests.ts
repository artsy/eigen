import {
  isMetaphysicsSubscriptionRejection,
  MetaphysicsSubscriptionError,
} from "app/system/relay/helpers/metaphysicsSubscriptionError"
import {
  createMetaphysicsSubscribe,
  createSubscriptionFetch,
} from "app/system/relay/metaphysicsSubscription"
import { NetworkError } from "graphql-sse"
import type { Sink } from "graphql-sse"

jest.mock("../../../../../data/complete.queryMap.json", () => ({
  "test-subscription-id": "subscription TestSubscription { testEvent }",
}))

const request = { id: "test-subscription-id", name: "TestSubscription", text: null }

describe("metaphysicsSubscribe", () => {
  it("bridges a graphql-sse subscription to a Relay Observable", () => {
    const dispose = jest.fn()
    let sink: Sink<unknown> | undefined
    const client = {
      subscribe: jest.fn((_, nextSink: Sink<unknown>) => {
        sink = nextSink
        return dispose
      }),
    }
    const subscribe = createMetaphysicsSubscribe(() => client)
    const variables = { input: "value" }
    const next = jest.fn()
    const complete = jest.fn()
    const error = jest.fn()

    const subscription = subscribe(request, variables).subscribe({ next, complete, error })

    expect(client.subscribe).toHaveBeenCalledWith(
      {
        documentID: "test-subscription-id",
        operationName: "TestSubscription",
        query: "TestSubscription",
        variables,
      },
      expect.any(Object)
    )

    const payload = { data: { testEvent: "Hello" } }
    sink?.next(payload)
    sink?.complete()

    expect(next).toHaveBeenCalledWith(payload)
    expect(complete).toHaveBeenCalledTimes(1)
    expect(error).not.toHaveBeenCalled()

    subscription.unsubscribe()
    expect(dispose).toHaveBeenCalledTimes(1)
  })

  it("sends document text when the operation has no persisted query ID", () => {
    const client = { subscribe: jest.fn(() => jest.fn()) }
    const subscribe = createMetaphysicsSubscribe(() => client)
    const variables = { input: "value" }

    subscribe(
      {
        id: null,
        name: "TestSubscription",
        text: "subscription TestSubscription { testEvent }",
      },
      variables
    ).subscribe({})

    expect(client.subscribe).toHaveBeenCalledWith(
      {
        operationName: "TestSubscription",
        query: "subscription TestSubscription { testEvent }",
        variables,
      },
      expect.any(Object)
    )
  })

  it("forwards subscription errors to Relay", () => {
    const failure = new Error("Subscription failed")

    const error = failSubscriptionWith(failure)

    expect(error).toBeInstanceOf(MetaphysicsSubscriptionError)
    expect(error.message).toBe("Subscription failed")
    expect(error.status).toBeUndefined()
    expect(error.reason).toBe(failure)
  })

  it("keeps the HTTP status of a rejected subscription request", () => {
    const response = { ok: false, status: 429, statusText: "Too Many Requests" }

    const error = failSubscriptionWith(new NetworkError(response))

    expect(error.status).toBe(429)
    expect(error.message).toBe("Server responded with 429: Too Many Requests")
  })

  it("keeps the HTTP status when the request never reached the server", () => {
    const error = failSubscriptionWith(new NetworkError(new Error("Network request failed")))

    expect(error.status).toBeUndefined()
    expect(error.message).toBe("Network request failed")
  })

  it("reports a pre-stream rejection with its GraphQL errors", () => {
    // What graphql-sse throws once `createSubscriptionFetch` hands it a rejected response.
    const rejection = {
      ok: false as const,
      status: 200,
      statusText: "This feature is not currently enabled",
      graphQLErrors: ["This feature is not currently enabled"],
    }

    const error = failSubscriptionWith(new NetworkError(rejection))

    expect(error.message).toBe("This feature is not currently enabled")
    expect(error.status).toBe(200)
    expect(error.graphQLErrors).toEqual(["This feature is not currently enabled"])
    expect(isMetaphysicsSubscriptionRejection(error)).toBe(true)
  })
})

describe("createSubscriptionFetch", () => {
  it("passes an event stream straight through", async () => {
    const response = fakeResponse({ contentType: "text/event-stream" })

    const result = await createSubscriptionFetch(fakeFetch(response))("/v2", {})

    expect(result).toBe(response)
  })

  it("turns a non-streaming GraphQL answer into a rejection graphql-sse reports", async () => {
    const response = fakeResponse({
      contentType: "application/json; charset=utf-8",
      body: { errors: [{ message: "You need to be signed in to perform this action" }] },
    })

    const result = await createSubscriptionFetch(fakeFetch(response))("/v2", {})

    expect(result).toEqual({
      ok: false,
      status: 200,
      statusText: "You need to be signed in to perform this action",
      graphQLErrors: ["You need to be signed in to perform this action"],
    })
  })

  it("retries a missing persisted query with its local document text", async () => {
    const missingQueryResponse = fakeResponse({ contentType: "text/plain", status: 404 })
    const streamResponse = fakeResponse({ contentType: "text/event-stream" })
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(missingQueryResponse)
      .mockResolvedValueOnce(streamResponse)
    const body = {
      documentID: "test-subscription-id",
      operationName: "TestSubscription",
      query: "TestSubscription",
      variables: { input: "value" },
    }

    const fetch = fetchMock as unknown as Parameters<typeof createSubscriptionFetch>[0]
    const result = await createSubscriptionFetch(fetch)("/v2", {
      body: JSON.stringify(body),
      method: "POST",
    })

    expect(result).toBe(streamResponse)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1]).toEqual([
      "/v2",
      {
        body: JSON.stringify({
          operationName: "TestSubscription",
          query: "subscription TestSubscription { testEvent }",
          variables: { input: "value" },
        }),
        method: "POST",
      },
    ])
  })

  it("still rejects when the body is neither a stream nor GraphQL", async () => {
    const response = fakeResponse({ contentType: "text/html", status: 502, body: null })

    const result = await createSubscriptionFetch(fakeFetch(response))("/v2", {})

    expect(result).toEqual({
      ok: false,
      status: 502,
      statusText: "The server did not return an event stream.",
      graphQLErrors: [],
    })
  })
})

const fakeResponse = ({
  contentType,
  status = 200,
  body,
}: {
  contentType: string
  status?: number
  body?: object | null
}) =>
  ({
    status,
    headers: { get: () => contentType },
    json: async () => {
      if (!body) {
        throw new Error("Unexpected end of JSON input")
      }

      return body
    },
  }) as unknown as Awaited<ReturnType<ReturnType<typeof createSubscriptionFetch>>>

const fakeFetch = (response: Awaited<ReturnType<ReturnType<typeof createSubscriptionFetch>>>) =>
  (async () => response) as unknown as Parameters<typeof createSubscriptionFetch>[0]

const failSubscriptionWith = (failure: Error) => {
  const client = {
    subscribe: jest.fn((_, sink: Sink<unknown>) => {
      sink.error(failure)
      return jest.fn()
    }),
  }
  const subscribe = createMetaphysicsSubscribe(() => client)
  const error = jest.fn()

  subscribe(request, {}).subscribe({ error })

  return error.mock.calls[0][0] as MetaphysicsSubscriptionError
}
