import { rateLimitMiddleware } from "app/system/relay/middlewares/rateLimitMiddleware"
import * as loggers from "app/utils/loggers"
import {
  MiddlewareNextFn,
  RelayNetworkLayerRequest,
  RelayNetworkLayerResponse,
} from "react-relay-network-modern"

// Workaround for read-only property warning
const mockLoggers = loggers as { logOperation: boolean }

describe("rateLimitMiddleware", () => {
  const relayResponse: RelayNetworkLayerResponse = {
    _res: null,
    ok: true,
    status: 200,
    json: "{}",
    processJsonData: () => ({}),
    clone: () => relayResponse,
  }

  beforeEach(() => {
    mockLoggers.logOperation = true
  })

  const request: RelayNetworkLayerRequest = {
    id: "xxx",
    // @ts-ignore
    operation: {
      name: "ExampleQuery",
    },
  }

  const next: MiddlewareNextFn = () => Promise.resolve(relayResponse)

  it("passes through, incrementing the counter", async () => {
    const logger = jest.fn()
    const middleware = rateLimitMiddleware({ logger, limit: 2, interval: 1000 })

    const resA = await middleware(next)(request)
    const resB = await middleware(next)(request)

    expect(resA).toBe(relayResponse)
    expect(resB).toBe(relayResponse)

    expect(logger).toBeCalledTimes(2)
    expect(logger).toBeCalledWith("ExampleQuery: request +1")
    expect(logger).toBeCalledWith("ExampleQuery: request +2")
  })

  it("ignore logger when logOperation is set to false", async () => {
    mockLoggers.logOperation = false
    const logger = jest.fn()
    const middleware = rateLimitMiddleware({ logger, limit: 2, interval: 1000 })

    await middleware(next)(request)

    expect(logger).toBeCalledTimes(0)
  })

  it("throws an error when too many requests are made within the given interval", async () => {
    expect.assertions(1)

    const logger = jest.fn()
    const middleware = rateLimitMiddleware({ logger, limit: 2, interval: 1000 })

    await middleware(next)(request)
    await middleware(next)(request)

    try {
      await middleware(next)(request)
    } catch (err: any) {
      expect(err.message).toEqual("Rate limit exceeded: ExampleQuery")
    }
  })

  it("resets the counter after the interval passes", async () => {
    const now = Date.now

    Date.now = jest.fn(() => 0)

    const logger = jest.fn()
    const middleware = rateLimitMiddleware({ logger, limit: 2, interval: 1000 })

    await middleware(next)(request)
    await middleware(next)(request)

    expect(logger).toBeCalledTimes(2)
    expect(logger).toBeCalledWith("ExampleQuery: request +1")
    expect(logger).toBeCalledWith("ExampleQuery: request +2")

    Date.now = jest.fn(() => 1000)

    await middleware(next)(request)
    await middleware(next)(request)

    expect(logger).toBeCalledTimes(4)
    expect(logger).toBeCalledWith("ExampleQuery: request +1")
    expect(logger).toBeCalledWith("ExampleQuery: request +2")

    Date.now = now
  })

  it("resets gradually under sustained traffic that never has a gap >= interval", async () => {
    // Regression test: this scenario used to break the middleware, because resetting was
    // previously based on the gap between consecutive requests rather than a sliding window.
    // Requests arriving every 300ms (always < the 1000ms interval) meant the counter would
    // climb indefinitely once traffic stayed continuous, causing recurring bursts of thrown
    // errors instead of the window correctly expiring on schedule.
    const now = Date.now
    const logger = jest.fn()
    const middleware = rateLimitMiddleware({ logger, limit: 3, interval: 1000 })

    const timestamps = [0, 300, 600, 900, 1200]
    const results: Array<"ok" | "throw"> = []

    for (const timestamp of timestamps) {
      Date.now = jest.fn(() => timestamp)

      try {
        await middleware(next)(request)
        results.push("ok")
      } catch {
        results.push("throw")
      }
    }

    // 0, 300, 600 fill the window (limit 3); 900 is still within 1000ms of t=0 so it throws;
    // by 1200 the window starting at t=0 has fully expired, so the request succeeds again.
    expect(results).toEqual(["ok", "ok", "ok", "throw", "ok"])

    Date.now = now
  })

  it("respects the default limit/interval when constructed with no options", async () => {
    const middleware = rateLimitMiddleware()

    const requests = Array.from({ length: 101 }, async () => middleware(next)(request))
    const results = await Promise.allSettled(requests)

    const fulfilled = results.filter((result) => result.status === "fulfilled")
    const rejected = results.filter((result) => result.status === "rejected")

    expect(fulfilled).toHaveLength(100)
    expect(rejected).toHaveLength(1)
  })
})
