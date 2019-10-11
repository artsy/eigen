import { volleyClient } from "../volleyClient"

jest.mock("react-native", () => ({
  NativeModules: {
    Emission: {
      volleyURL: "fake-volley-url",
    },
  },
}))

jest.mock("lodash", () => ({
  throttle(fn: any, ms: any) {
    let timeout = 0 as any
    return () => {
      clearTimeout(timeout)
      timeout = setTimeout(fn, ms)
    }
  },
}))

jest.mock("react-native-sentry", () => ({
  Sentry: {
    captureMessage: jest.fn(),
  },
}))

jest.useFakeTimers()

describe("volleyClient", () => {
  const fetch = jest.fn((_url, _init) => Promise.resolve({ status: 200 }))
  // @ts-ignore
  global.fetch = fetch
  beforeEach(() => {
    fetch.mockClear()
  })

  it("calls fetch with the correct kind of data", async () => {
    volleyClient.send({ type: "increment", name: "counter" })
    jest.advanceTimersByTime(3000)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe("fake-volley-url")
    expect(fetch.mock.calls[0][1]).toMatchInlineSnapshot(`
                  Object {
                    "body": "{\\"serviceName\\":\\"eigen\\",\\"metrics\\":[{\\"type\\":\\"increment\\",\\"name\\":\\"counter\\"}]}",
                    "headers": Object {
                      "Content-Type": "application/json",
                    },
                    "method": "POST",
                  }
            `)
  })

  it("batches metrics", async () => {
    volleyClient.send({ type: "increment", name: "counter one" })
    volleyClient.send({ type: "increment", name: "counter two" })
    volleyClient.send({ type: "decrement", name: "counter one" })
    jest.advanceTimersByTime(3000)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][1]).toMatchInlineSnapshot(`
      Object {
        "body": "{\\"serviceName\\":\\"eigen\\",\\"metrics\\":[{\\"type\\":\\"increment\\",\\"name\\":\\"counter one\\"},{\\"type\\":\\"increment\\",\\"name\\":\\"counter two\\"},{\\"type\\":\\"decrement\\",\\"name\\":\\"counter one\\"}]}",
        "headers": Object {
          "Content-Type": "application/json",
        },
        "method": "POST",
      }
    `)
  })
})
