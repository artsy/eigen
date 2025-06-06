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
})
