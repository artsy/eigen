import { MiddlewareNextFn, RelayNetworkLayerResponse } from "react-relay-network-modern/node8"
import { principalFieldErrorMiddleware } from "../principalFieldErrorMiddleware"
import { GraphQLRequest } from "../types"

describe("principalFieldErrorMiddleware", () => {
  const middleware = principalFieldErrorMiddleware()

  describe("success", () => {
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = { json: {} }

    // @ts-ignore
    const request: GraphQLRequest = {
      // @ts-ignore
      operation: {
        operationKind: "query",
      },
    }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

    it("passes through if there is no principalField", async () => {
      const res = await middleware(next)(request)
      expect(res).toBe(relayResponse)
    })
  })

  describe("with errors", () => {
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = {
      json: { extensions: { principalField: { httpStatusCode: 400 } } },
    }

    // @ts-ignore
    const request: GraphQLRequest = {
      // @ts-ignore
      operation: {
        operationKind: "query",
      },
      getID: () => "xxx",
    }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

    it("throws an error", async () => {
      expect.assertions(1)
      try {
        await middleware(next)(request)
      } catch (err) {
        expect(err.message).toContain("Relay request for `xxx` failed")
      }
    })
  })

  describe("with mutation errors", () => {
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = {
      json: {
        errors: [{}],
      },
    }

    // @ts-ignore
    const request: GraphQLRequest = {
      // @ts-ignore
      operation: {
        operationKind: "mutation",
      },
      getID: () => "xxx",
    }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

    it("throws an error", async () => {
      expect.assertions(1)
      try {
        await middleware(next)(request)
      } catch (err) {
        expect(err.message).toContain("Relay request for `xxx` failed")
      }
    })
  })
})
