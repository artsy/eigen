import { ArtsyNativeModules } from "lib/NativeModules/ArtsyNativeModules"
import { GraphQLResponseErrors, MiddlewareNextFn, RelayNetworkLayerResponse } from "react-relay-network-modern/node8"
import { checkAuthenticationMiddleware } from "../checkAuthenticationMiddleware"
import { GraphQLRequest } from "../types"

describe(checkAuthenticationMiddleware, () => {
  const middleware = checkAuthenticationMiddleware()

  const request: GraphQLRequest = {
    // @ts-ignore
    operation: {
      operationKind: "query",
    },
    getID: () => "xxx",
  }

  it("calls validateAuthCredentialsAreCorrect if there are errors", async () => {
    const errors: GraphQLResponseErrors = [{ message: "The access token is invalid or has expired." }]
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = { errors }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)
    await middleware(next)(request)
    expect(ArtsyNativeModules.ARTemporaryAPIModule.validateAuthCredentialsAreCorrect).toBeCalled()
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
