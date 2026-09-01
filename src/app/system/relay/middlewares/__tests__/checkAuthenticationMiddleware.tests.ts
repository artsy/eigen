import { captureMessage } from "@sentry/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { checkAuthenticationMiddleware } from "app/system/relay/middlewares/checkAuthenticationMiddleware"
import { GraphQLRequest } from "app/system/relay/middlewares/types"
import {
  GraphQLResponseErrors,
  MiddlewareNextFn,
  RelayNetworkLayerResponse,
} from "react-relay-network-modern"

const captureMessageMock = captureMessage as jest.Mock

describe(checkAuthenticationMiddleware, () => {
  let middleware: ReturnType<typeof checkAuthenticationMiddleware>

  beforeEach(() => {
    fetchMock.resetMocks()
    captureMessageMock.mockClear()
    middleware = checkAuthenticationMiddleware()
  })

  const request: GraphQLRequest = {
    // @ts-ignore
    operation: {
      operationKind: "query",
    },
    getID: () => "xxx",
    fetchOpts: {
      headers: {
        "X-ACCESS-TOKEN": "token-value",
      },
    } as any,
  }

  it("calls signOut if there are errors and /me keeps returning 401", async () => {
    const errors: GraphQLResponseErrors = [
      { message: "The access token is invalid or has expired." },
    ]
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = { errors }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)
    fetchMock.mockResponse("", { status: 401 })
    expect(fetchMock).toHaveBeenCalledTimes(0)
    await middleware(next)(request)
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(__globalStoreTestUtils__?.dispatchedActions.map((x) => x.type)).toContain(
      "@thunk.auth.signOut(success)"
    )
    expect(__globalStoreTestUtils__?.dispatchedActions.map((x) => x.type)).toContain(
      "@thunkOn.resetAfterSignOut(success)"
    )
    expect(captureMessageMock).toHaveBeenCalledWith(
      expect.stringContaining("signed out on expired session"),
      expect.objectContaining({ tags: { authOutcome: "signed_out_expired" } })
    )
  })

  it("does not sign out if /me recovers on a retry (e.g. a freshly issued token)", async () => {
    const errors: GraphQLResponseErrors = [
      { message: "The access token is invalid or has expired." },
    ]
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = { errors }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)
    fetchMock.mockResponseOnce("", { status: 401 })
    fetchMock.mockResponseOnce("", { status: 200 })
    await middleware(next)(request)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(__globalStoreTestUtils__?.dispatchedActions.map((x) => x.type)).not.toContain(
      "@thunk.auth.signOut(success)"
    )
    expect(captureMessageMock).toHaveBeenCalledWith(
      expect.stringContaining("recovered after transient 401"),
      expect.objectContaining({
        tags: { authOutcome: "recovered_after_transient_401" },
        extra: { attempts: 2 },
      })
    )
  })

  it("only emits one recovered event per token across concurrent recoveries", async () => {
    const errors: GraphQLResponseErrors = [
      { message: "The access token is invalid or has expired." },
    ]
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = { errors }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)
    // Two failing requests for the same token, each recovering (401 then 200).
    fetchMock.mockResponses(
      ["", { status: 401 }],
      ["", { status: 200 }],
      ["", { status: 401 }],
      ["", { status: 200 }]
    )

    await middleware(next)(request)
    await middleware(next)(request)

    const recoveredCalls = captureMessageMock.mock.calls.filter(
      ([, ctx]) => ctx?.tags?.authOutcome === "recovered_after_transient_401"
    )
    expect(recoveredCalls).toHaveLength(1)
  })

  it("passes through if there is no errors", async () => {
    const errors: GraphQLResponseErrors = []
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = { errors }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

    const res = await middleware(next)(request)
    expect(res).toBe(relayResponse)
  })
})
