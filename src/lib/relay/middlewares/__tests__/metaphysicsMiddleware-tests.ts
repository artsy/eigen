import { MiddlewareNextFn, RelayNetworkLayerRequest, RelayNetworkLayerResponse } from "react-relay-network-modern/node8"
import { metaphysicsExtensionsLoggerMiddleware } from "../metaphysicsMiddleware"

describe("metaphysicsExtensionsLoggerMiddleware", () => {
  // @ts-ignore
  const request: RelayNetworkLayerRequest = {}

  const middleware = metaphysicsExtensionsLoggerMiddleware()

  describe("with extensions", () => {
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = {
      json: {
        extensions: {
          requests: {
            gravity: {
              requests: {
                "artist/andy-warhol": {
                  time: "0s 804.758ms",
                  cache: true,
                  length: "N/A",
                },
              },
            },
          },
          requestID: "31e05b80-ab4d-11ea-9522-b3bc706b474b",
        },
      },
    }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

    it("correctly logs the response", async () => {
      const groupCollapsedSpy = jest.spyOn(global.console, "groupCollapsed")
      const groupSpy = jest.spyOn(global.console, "group")
      const logSpy = jest.spyOn(global.console, "log")

      const res = await middleware(next)(request)

      expect(res).toBe(relayResponse)
      expect(groupCollapsedSpy).toBeCalledWith(
        "%cMetaphysics API -%c 1 %ccalls",
        "font-weight: normal;",
        "color: #6E1EFF;",
        "color: black; font-weight: normal;"
      )
      expect(groupSpy).toBeCalledWith("gravity")
      expect(logSpy).toBeCalledWith("artist/andy-warhol", { cache: true, length: "N/A", time: "0s 804.758ms" })

      groupCollapsedSpy.mockRestore()
      groupSpy.mockRestore()
      logSpy.mockRestore()
    })
  })

  describe("missing extensions", () => {
    // @ts-ignore
    const relayResponse: RelayNetworkLayerResponse = {
      ok: true,
      json: {},
    }

    const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

    it("falls through if there are no extensions in the json", async () => {
      const res = await middleware(next)(request)
      expect(res).toBe(relayResponse)
    })
  })
})
