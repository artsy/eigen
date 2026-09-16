import { addBreadcrumb } from "@sentry/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { MetaphysicsSubscriptionError } from "app/system/relay/helpers/metaphysicsSubscriptionError"
import { enforceSessionExpiry } from "app/system/relay/helpers/sessionExpiry"
import {
  SubscribeFn,
  withSessionExpiry,
  withSubscriptionBreadcrumbs,
} from "app/system/relay/subscriptionMiddlewares"
import { Observable } from "relay-runtime"
import type { GraphQLResponse } from "relay-runtime"
import type { Sink } from "relay-runtime/lib/network/RelayObservable"

jest.mock("app/system/relay/helpers/sessionExpiry", () => ({
  enforceSessionExpiry: jest.fn(),
}))

const request = { id: "request-id", name: "SomeSubscription", text: null }
const addBreadcrumbMock = addBreadcrumb as jest.Mock
const enforceSessionExpiryMock = enforceSessionExpiry as jest.Mock

describe("withSessionExpiry", () => {
  beforeEach(() => {
    enforceSessionExpiryMock.mockClear()
    __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "expired-token" } })
  })

  it.each([401, 403])("verifies the session when the stream is rejected with %s", (status) => {
    failWith(new MetaphysicsSubscriptionError("Not allowed", { status }))

    expect(enforceSessionExpiryMock).toHaveBeenCalledWith("expired-token")
  })

  it("leaves the session alone for any other failure", () => {
    failWith(new MetaphysicsSubscriptionError("Bad Gateway", { status: 502 }))
    failWith(new Error("The stream closed unexpectedly"))

    expect(enforceSessionExpiryMock).not.toHaveBeenCalled()
  })

  it("verifies the session when Metaphysics rejects the operation with GraphQL errors", () => {
    failWith(
      new MetaphysicsSubscriptionError("This feature is not currently enabled", {
        status: 200,
        graphQLErrors: ["This feature is not currently enabled"],
      })
    )

    expect(enforceSessionExpiryMock).toHaveBeenCalledWith("expired-token")
  })

  it("verifies the session when an established stream emits GraphQL errors", () => {
    const payload = { errors: [{ message: "Unauthorized" }] }

    const { next } = subscribeThrough(withSessionExpiry, (sink) => sink.next(payload))

    expect(enforceSessionExpiryMock).toHaveBeenCalledWith("expired-token")
    expect(next).toHaveBeenCalledWith(payload)
  })

  it("verifies the token the stream started with, not the one in use when it failed", () => {
    let sink: Sink<GraphQLResponse> | undefined
    const subscribe: SubscribeFn = () =>
      Observable.create((nextSink) => {
        sink = nextSink
      })

    withSessionExpiry(subscribe)(request, {}).subscribe({ error: jest.fn() })

    // The user signs in again while the stream is still open.
    __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "fresh-token" } })
    sink?.error(new MetaphysicsSubscriptionError("Not allowed", { status: 401 }))

    expect(enforceSessionExpiryMock).toHaveBeenCalledWith("expired-token")
  })

  it("forwards events and the original error untouched", () => {
    const failure = new MetaphysicsSubscriptionError("Not allowed", { status: 401 })

    const { next, error } = subscribeThrough(withSessionExpiry, (sink) => {
      sink.next({ data: { ok: true } })
      sink.error(failure)
    })

    expect(next).toHaveBeenCalledWith({ data: { ok: true } })
    expect(error).toHaveBeenCalledWith(failure)
  })
})

describe("withSubscriptionBreadcrumbs", () => {
  beforeEach(() => {
    addBreadcrumbMock.mockClear()
  })

  it("records the start and the outcome of a completed stream", () => {
    subscribeThrough(withSubscriptionBreadcrumbs, (sink) => {
      sink.next({ data: { ok: true } })
      sink.next({ data: { ok: true } })
      sink.complete()
    })

    expect(breadcrumbs()).toEqual([
      expect.objectContaining({
        category: "relay-subscription",
        message: "Subscribed to SomeSubscription",
        data: expect.objectContaining({ eventCount: 0 }),
      }),
      expect.objectContaining({
        message: "Completed SomeSubscription",
        data: expect.objectContaining({ eventCount: 2 }),
      }),
    ])
  })

  it("records the status of a failed stream without one breadcrumb per event", () => {
    subscribeThrough(withSubscriptionBreadcrumbs, (sink) => {
      sink.next({ data: { ok: true } })
      sink.error(new MetaphysicsSubscriptionError("Too Many Requests", { status: 429 }))
    })

    expect(breadcrumbs()).toHaveLength(2)
    expect(breadcrumbs()[1]).toEqual(
      expect.objectContaining({
        message: "Failed SomeSubscription",
        data: expect.objectContaining({
          eventCount: 1,
          message: "Too Many Requests",
          status: 429,
        }),
      })
    )
  })
})

const breadcrumbs = () => addBreadcrumbMock.mock.calls.map(([breadcrumb]) => breadcrumb)

const subscribeThrough = (
  middleware: (subscribe: SubscribeFn) => SubscribeFn,
  run: (sink: Sink<GraphQLResponse>) => void
) => {
  const next = jest.fn()
  const error = jest.fn()
  const complete = jest.fn()
  const subscribe: SubscribeFn = () => Observable.create((sink) => run(sink))

  middleware(subscribe)(request, {}).subscribe({ next, error, complete })

  return { next, error, complete }
}

const failWith = (failure: Error) =>
  subscribeThrough(withSessionExpiry, (sink) => sink.error(failure))
