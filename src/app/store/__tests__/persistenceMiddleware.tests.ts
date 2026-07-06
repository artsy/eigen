import AsyncStorage from "@react-native-async-storage/async-storage"
import { captureException } from "@sentry/react-native"
import { persistenceMiddleware } from "app/store/persistence"
import { applyMiddleware, createStore, Reducer } from "redux"

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
}))

const makeStore = (reducer: Reducer) => createStore(reducer, applyMiddleware(persistenceMiddleware))

// Flushes the throttle timer and the resulting promise chain
const flushAll = () => jest.runAllTimersAsync()

beforeEach(() => {
  jest.useFakeTimers()
  jest.clearAllMocks()
})

afterEach(() => {
  jest.useRealTimers()
})

describe("persistenceMiddleware", () => {
  it("passes actions through and updates state normally", () => {
    const store = makeStore((state: { count: number } = { count: 0 }, action) => {
      if (action.type === "INCREMENT") return { count: state.count + 1 }
      return state
    })

    store.dispatch({ type: "INCREMENT" })
    store.dispatch({ type: "INCREMENT" })

    expect(store.getState()).toEqual({ count: 2 })
  })

  it("returns the action result for successful dispatches", () => {
    const store = makeStore((state = {}) => state)
    const result = store.dispatch({ type: "NOOP" })
    expect(result).toEqual({ type: "NOOP" })
  })

  it("calls AsyncStorage.setItem after the throttle window, not synchronously", async () => {
    const store = makeStore((state: { value: string } = { value: "a" }, action) => {
      if (action.type === "SET") return { value: action.payload }
      return state
    })

    store.dispatch({ type: "SET", payload: "b" })

    expect(AsyncStorage.setItem).not.toHaveBeenCalled()

    await flushAll()

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)
  })

  it("collapses multiple actions within the throttle window into a single write", async () => {
    const store = makeStore((state: { count: number } = { count: 0 }, action) => {
      if (action.type === "INCREMENT") return { count: state.count + 1 }
      return state
    })

    store.dispatch({ type: "INCREMENT" })
    store.dispatch({ type: "INCREMENT" })
    store.dispatch({ type: "INCREMENT" })

    await flushAll()

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)
  })

  it("persists the latest state when multiple actions fire within the window", async () => {
    const store = makeStore((state: { value: string } = { value: "a" }, action) => {
      if (action.type === "SET") return { value: action.payload }
      return state
    })

    store.dispatch({ type: "SET", payload: "b" })
    store.dispatch({ type: "SET", payload: "c" })

    await flushAll()

    const serialized = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
    expect(JSON.parse(serialized)).toMatchObject({ value: "c" })
  })

  it("writes again for actions dispatched after the throttle window", async () => {
    const store = makeStore((state: { value: string } = { value: "a" }, action) => {
      if (action.type === "SET") return { value: action.payload }
      return state
    })

    store.dispatch({ type: "SET", payload: "b" })
    await flushAll()
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)

    store.dispatch({ type: "SET", payload: "c" })
    await flushAll()
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2)

    const serialized = (AsyncStorage.setItem as jest.Mock).mock.calls[1][1]
    expect(JSON.parse(serialized)).toEqual({ value: "c" })
  })

  it("serializes state synchronously at dispatch time, before the deferred write", async () => {
    const store = makeStore((state: { value: string } = { value: "a" }, action) => {
      if (action.type === "SET") return { value: action.payload }
      return state
    })

    store.dispatch({ type: "SET", payload: "b" })

    // mutate the live state object after dispatch — a snapshot taken at dispatch
    // time must not observe this (mirrors Immer revoking/reusing proxies later)
    ;(store.getState() as { value: string }).value = "MUTATED"

    await flushAll()

    const serialized = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1]
    expect(JSON.parse(serialized)).toEqual({ value: "b" })
  })

  it("swallows reducer errors (e.g. Hermes 'Proxy handler is null') and reports them to Sentry", async () => {
    const store = makeStore((state = { ok: true }, action) => {
      if (action.type === "EXPLODE") {
        throw new TypeError("Proxy handler is null")
      }
      return state
    })

    expect(() => store.dispatch({ type: "EXPLODE" })).not.toThrow()
    expect(store.dispatch({ type: "EXPLODE" })).toBeUndefined()

    expect(captureException).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Proxy handler is null" }),
      { level: "error", tags: { handled: "true" } }
    )

    await flushAll()
    // failed dispatches must not trigger a persistence write
    expect(AsyncStorage.setItem).not.toHaveBeenCalled()
  })

  it("does not crash dispatch if serialization itself throws", async () => {
    const store = makeStore((state = { ok: true }, action) => {
      if (action.type === "SET_UNSERIALIZABLE") {
        // a revoked proxy in the tree makes sanitize throw, like Immer's revoked drafts do
        const { proxy, revoke } = Proxy.revocable({ broken: true }, {})
        revoke()
        return { broken: proxy }
      }
      return state
    })

    expect(() => store.dispatch({ type: "SET_UNSERIALIZABLE" })).not.toThrow()
    expect(captureException).toHaveBeenCalledWith(expect.any(TypeError), {
      level: "error",
      tags: { handled: "true" },
    })

    await flushAll()
    expect(AsyncStorage.setItem).not.toHaveBeenCalled()
  })
})
