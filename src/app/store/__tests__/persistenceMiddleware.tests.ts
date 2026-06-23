import { captureException } from "@sentry/react-native"
import { persistenceMiddleware } from "app/store/persistence"
import { action, createStore as createEasyPeasyStore } from "easy-peasy"
import { Immer } from "immer"
import { applyMiddleware, createStore, Reducer } from "redux"

jest.mock("@sentry/react-native")
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
}))

const makeStore = (reducer: Reducer) => createStore(reducer, applyMiddleware(persistenceMiddleware))

describe("persistenceMiddleware", () => {
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

// Simulates the real EIGEN-AZR1 / EIGEN-AZA6 crash path:
//   Hermes 0.14.1 on iOS 26 throws "TypeError: Proxy handler is null" inside
//   immer's finishDraft() when revoking a Proxy — easy-peasy calls this after
//   every action handler that mutates draft state (e.g. setIsReady).
//   Without the try/catch in persistenceMiddleware the error propagates to
//   RCTFatal → expo-updates recovery pipeline → intentional crash.
describe("persistenceMiddleware — immer Proxy crash (EIGEN-AZR1 regression)", () => {
  // Minimal model that mirrors the mutation pattern of the failing action:
  //   ProgressiveOnboardingModel.setIsReady: action((state, v) => { state.sessionState.isReady = v })
  const model = {
    sessionState: { isReady: false },
    setIsReady: action((state: any, value: boolean) => {
      state.sessionState.isReady = value
    }),
  }

  it("does not throw and reports to Sentry when immer finishDraft throws during dispatch", () => {
    const store = createEasyPeasyStore(model, { middleware: [persistenceMiddleware] })

    // Warm up: dispatch once so easy-peasy creates its internal Immer instance
    store.getActions().setIsReady(false)

    // Patch Immer.prototype.finishDraft to simulate "Proxy handler is null" (Hermes 0.14.1 bug)
    const originalFinishDraft = Immer.prototype.finishDraft
    const proxyError = new TypeError("Proxy handler is null")
    Immer.prototype.finishDraft = () => {
      throw proxyError
    }

    try {
      // This must NOT propagate — persistenceMiddleware should swallow it
      expect(() => store.getActions().setIsReady(true)).not.toThrow()

      expect(captureException).toHaveBeenCalledWith(proxyError, {
        level: "error",
        tags: { handled: "true" },
      })
    } finally {
      Immer.prototype.finishDraft = originalFinishDraft
    }
  })
})
