import { MiddlewareNextFn, RelayNetworkLayerResponse } from "react-relay-network-modern/node8"
import { principalFieldErrorMiddleware } from "../principalFieldErrorMiddleware"
import { GraphQLRequest } from "../types"

describe(principalFieldErrorMiddleware, () => {
  const middleware = principalFieldErrorMiddleware()

  describe("without princialField", () => {
    // @ts-ignore
    const request: GraphQLRequest = {
      // @ts-ignore
      operation: {
        operationKind: "query",
      },
      getID: () => "xxx",
    }

    describe("success", () => {
      // @ts-ignore
      const relayResponse: RelayNetworkLayerResponse = { json: {} }

      const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

      it("passes through if there is no errors", async () => {
        const res = await middleware(next)(request)
        expect(res).toBe(relayResponse)
      })
    })

    describe("with errors", () => {
      // @ts-ignore
      const relayResponse: RelayNetworkLayerResponse = {
        json: {
          errors: [{}],
        },
      }

      const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

      it("throws error if there is no principalField in the query", async () => {
        expect.assertions(1)
        try {
          await middleware(next)(request)
        } catch (err) {
          expect(err.message).toContain("Relay request for `xxx` failed")
        }
      })
    })
  })

  describe("using principalField", () => {
    // @ts-ignore
    const request: GraphQLRequest = {
      // @ts-ignore
      operation: {
        operationKind: "query",
        text: "someField @principalField",
      },
      getID: () => "xxx",
    }

    describe("success", () => {
      // @ts-ignore
      const relayResponse: RelayNetworkLayerResponse = { json: {} }

      const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

      it("passes through if there is no errors", async () => {
        const res = await middleware(next)(request)
        expect(res).toBe(relayResponse)
      })
    })

    describe("with errors", () => {
      it("passes through when the principalField isn't involved in the errors", async () => {
        // @ts-ignore
        const relayResponse: RelayNetworkLayerResponse = {
          json: {
            errors: [{}],
          },
        }

        const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

        const res = await middleware(next)(request)
        expect(res).toBe(relayResponse)
      })

      it("throws error when the principalField is involved in the errors", async () => {
        // @ts-ignore
        const relayResponse: RelayNetworkLayerResponse = {
          json: {
            errors: [{}],
            extensions: { principalField: { httpStatusCode: 400 } },
          },
        }

        const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

        expect.assertions(1)
        try {
          await middleware(next)(request)
        } catch (err) {
          expect(err.message).toContain("Relay request for `xxx` failed")
        }
      })
    })
  })
})
