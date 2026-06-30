import AsyncStorage from "@react-native-async-storage/async-storage"
import { persistenceMiddleware } from "app/store/persistence"
import { applyMiddleware, createStore, Reducer } from "redux"

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
}))

const makeStore = (reducer: Reducer) => createStore(reducer, applyMiddleware(persistenceMiddleware))

// Flushes RAF callbacks and the resulting promise chain
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

  it("calls AsyncStorage.setItem after the next animation frame", async () => {
    const store = makeStore((state: { value: string } = { value: "a" }, action) => {
      if (action.type === "SET") return { value: action.payload }
      return state
    })

    store.dispatch({ type: "SET", payload: "b" })

    expect(AsyncStorage.setItem).not.toHaveBeenCalled()

    await flushAll()

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)
  })

  it("collapses multiple actions in the same frame into a single write", async () => {
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

  it("persists the latest state when multiple actions fire before the frame", async () => {
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

  it("writes are serialised — a second write waits for the first to finish", async () => {
    let resolveFirst!: () => void
    const firstWrite = new Promise<void>((resolve) => {
      resolveFirst = resolve
    })
    ;(AsyncStorage.setItem as jest.Mock)
      .mockReturnValueOnce(firstWrite)
      .mockResolvedValue(undefined)

    const store = makeStore((state: { value: string } = { value: "a" }, action) => {
      if (action.type === "SET") return { value: action.payload }
      return state
    })

    store.dispatch({ type: "SET", payload: "b" })
    await flushAll()
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)

    store.dispatch({ type: "SET", payload: "c" })
    await flushAll()
    // first write still in progress — second should not have started yet
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)

    resolveFirst()
    await flushAll()
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2)
  })
})
