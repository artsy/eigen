import * as Sentry from "@sentry/react-native"
import { MiddlewareNextFn, RelayNetworkLayerResponse } from "react-relay-network-modern/node8"
import { errorMiddleware } from "./errorMiddleware"
import { GraphQLRequest } from "./types"

jest.mock("@sentry/react-native", () => ({
  init: jest.requireActual("@sentry/react-native").init,
  withScope: jest.requireActual("@sentry/react-native").withScope,
  captureException: jest.fn(),
}))

describe(errorMiddleware, () => {
  const middleware = errorMiddleware()

  describe("without princialField", () => {
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
  })

  describe("using optionalField", () => {
    const request: GraphQLRequest = {
      // @ts-ignore
      operation: {
        operationKind: "query",
        text: "someField @optionalField",
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
      it("passes through when the optionalField is involved in the errors", async () => {
        // @ts-ignore
        const relayResponse: RelayNetworkLayerResponse = {
          json: {
            errors: [{}],
            extensions: { optionalFields: [{ httpStatusCode: 400 }] },
          },
        }

        const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

        const res = await middleware(next)(request)
        expect(res).toBe(relayResponse)
      })
    })
  })

  describe("using principalField", () => {
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
        } catch (err: any) {
          expect(err.message).toContain("Relay request for `xxx` failed")
        }
      })
    })
  })

  // TODO: to be fixed in next commit
  describe.skip("error reporting", () => {
    const request: GraphQLRequest = {
      // @ts-ignore
      operation: {
        operationKind: "query",
        name: "ArtworkQuery",
      },
      getID: () => "xxx",
    }

    it("reports an error title with graphql name and error if it can be parsed", async () => {
      // @ts-ignore
      const relayResponse: RelayNetworkLayerResponse = {
        json: {
          errors: [
            {
              message:
                'https://stagingapi.artsy.net/api/v1/artwork/asdf? - {"error":"Artwork Not Found"}',
              locations: [
                {
                  line: 2,
                  column: 2,
                },
              ],
              path: ["artwork"],
              extensions: {
                httpStatusCodes: [404],
              },
            },
          ],
        },
        errors: [
          {
            message:
              'https://stagingapi.artsy.net/api/v1/artwork/asdf? - {"error":"Artwork Not Found"}',
            locations: [
              {
                line: 2,
                column: 2,
              },
            ],
            // @ts-ignore
            path: ["artwork"],
            extensions: {
              httpStatusCodes: [404],
            },
          },
        ],
      }

      const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

      expect.assertions(1)
      try {
        await middleware(next)(request)
      } catch (err: any) {
        // do nothing
      }
      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "ArtworkQuery - Artwork Not Found",
        })
      )
    })

    it("reports an error title with graphql name and generic error if it CANNOT be parsed", async () => {
      // @ts-ignore
      const relayResponse: RelayNetworkLayerResponse = {
        errors: [
          {
            message:
              'https://stagingapi.artsy.net/api/v1/artwork/asdf? - {"baderror":"Artwork Not Found"}',
            locations: [
              {
                line: 2,
                column: 2,
              },
            ],
            // @ts-ignore
            path: ["artwork"],
            extensions: {
              httpStatusCodes: [404],
            },
          },
          {
            message: "Response not successful: Received status code 401",
            // @ts-ignore
            locations: [],
            // @ts-ignore
            path: ["artwork"],
            extensions: {
              httpStatusCodes: [401],
            },
          },
        ],
      }

      const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

      expect.assertions(1)
      try {
        await middleware(next)(request)
      } catch (err: any) {
        // do nothing
      }
      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "ArtworkQuery - Generic Error - see metadata",
        })
      )
    })
  })
})
