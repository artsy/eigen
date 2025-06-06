import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { volleyClient } from "app/utils/volleyClient"

jest.mock("lodash/throttle", () => (fn: any, ms: any) => {
  let timeout = 0 as any
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(fn, ms)
  }
})

jest.useFakeTimers({
  legacyFakeTimers: true,
})

describe("volleyClient", () => {
  const fetch = jest.fn((_url, _init) => Promise.resolve({ status: 200 }))
  // @ts-ignore
  global.fetch = fetch
  beforeEach(() => {
    fetch.mockClear()
  })

  it("calls fetch with the correct kind of data", async () => {
    await volleyClient.send({ type: "increment", name: "counter" })
    jest.advanceTimersByTime(3000)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe("https://volley-staging.artsy.net/report")
    expect(fetch.mock.calls[0][1]).toMatchInlineSnapshot(`
      {
        "body": "{"serviceName":"eigen","metrics":[{"type":"increment","name":"counter","tags":["device:ios testDevice","network:cellular","effective_network:3g"]}]}",
        "headers": {
          "Content-Type": "application/json",
        },
        "method": "POST",
      }
    `)
  })

  it("batches metrics", async () => {
    await volleyClient.send({ type: "increment", name: "counter one" })
    await volleyClient.send({ type: "increment", name: "counter two" })
    await volleyClient.send({ type: "decrement", name: "counter one" })
    jest.advanceTimersByTime(3000)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][1]).toMatchInlineSnapshot(`
      {
        "body": "{"serviceName":"eigen","metrics":[{"type":"increment","name":"counter one","tags":["device:ios testDevice","network:cellular","effective_network:3g"]},{"type":"increment","name":"counter two","tags":["device:ios testDevice","network:cellular","effective_network:3g"]},{"type":"decrement","name":"counter one","tags":["device:ios testDevice","network:cellular","effective_network:3g"]}]}",
        "headers": {
          "Content-Type": "application/json",
        },
        "method": "POST",
      }
    `)
  })

  describe("in production", () => {
    it("has a different URL", async () => {
      __globalStoreTestUtils__?.setProductionMode()
      await volleyClient.send({ type: "increment", name: "counter" })
      jest.advanceTimersByTime(3000)
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls[0][0]).toBe("https://volley.artsy.net/report")
    })
  })
})
