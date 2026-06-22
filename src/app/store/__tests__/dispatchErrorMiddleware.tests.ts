import { captureException } from "@sentry/react-native"
import { dispatchErrorMiddleware } from "app/store/GlobalStore"
import { applyMiddleware, createStore, Reducer } from "redux"

jest.mock("@sentry/react-native")

const makeStore = (reducer: Reducer) =>
  createStore(reducer, applyMiddleware(dispatchErrorMiddleware))

describe("dispatchErrorMiddleware", () => {
  it("does not throw when a reducer throws", () => {
    const store = makeStore((state = {}, action) => {
      if (action.type === "THROW") throw new Error("Proxy handler is null")
      return state
    })

    expect(() => store.dispatch({ type: "THROW" })).not.toThrow()
  })

  it("reports the caught error to Sentry as handled", () => {
    const error = new Error("Proxy handler is null")
    const store = makeStore((state = {}, action) => {
      if (action.type === "THROW") throw error
      return state
    })

    store.dispatch({ type: "THROW" })

    expect(captureException).toHaveBeenCalledWith(error, {
      level: "error",
      tags: { handled: "true" },
    })
  })

  it("passes successful actions through and updates state normally", () => {
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

  it("returns undefined when a reducer throws", () => {
    const store = makeStore((state = {}, action) => {
      if (action.type === "THROW") throw new Error("boom")
      return state
    })

    const result = store.dispatch({ type: "THROW" })
    expect(result).toBeUndefined()
  })
})
