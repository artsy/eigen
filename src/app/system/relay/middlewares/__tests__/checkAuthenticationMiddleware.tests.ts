import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { checkAuthenticationMiddleware } from "app/system/relay/middlewares/checkAuthenticationMiddleware"
import { GraphQLRequest } from "app/system/relay/middlewares/types"
import {
  GraphQLResponseErrors,
  MiddlewareNextFn,
  RelayNetworkLayerResponse,
} from "react-relay-network-modern"

describe(checkAuthenticationMiddleware, () => {
  const middleware = checkAuthenticationMiddleware()

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

  it("calls signOut if there are errors", async () => {
    const errors: GraphQLResponseErrors = [
      { message: "The access token is invalid or has expired." },
    ]
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = { errors }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)
    fetchMock.mockResponseOnce("", { status: 401 })
    expect(fetchMock).toHaveBeenCalledTimes(0)
    await middleware(next)(request)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(__globalStoreTestUtils__?.dispatchedActions.map((x) => x.type)).toContain(
      "@thunk.auth.signOut(success)"
    )
    expect(__globalStoreTestUtils__?.dispatchedActions.map((x) => x.type)).toContain(
      "@thunkOn.resetAfterSignOut(success)"
    )
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
