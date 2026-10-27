// The global mock in setupJest doesn't include the flush policy base classes, so use the real ones
jest.mock("@segment/analytics-react-native", () =>
  jest.requireActual("@segment/analytics-react-native/lib/commonjs/flushPolicies")
)

import { AppStateFlushPolicy } from "app/utils/track/AppStateFlushPolicy"
import { AppState, AppStateStatus } from "react-native"

describe("AppStateFlushPolicy", () => {
  let changeListener: (state: AppStateStatus) => void
  const remove = jest.fn()

  beforeEach(() => {
    remove.mockClear()
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, listener) => {
      changeListener = listener as (state: AppStateStatus) => void
      return { remove }
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it.each(["inactive", "background"] as const)("requests a flush when the app goes %s", (state) => {
    const policy = new AppStateFlushPolicy()
    policy.start()

    changeListener(state)

    expect(policy.shouldFlush.value).toBe(true)
  })

  it("does not request a flush when the app becomes active", () => {
    const policy = new AppStateFlushPolicy()
    policy.start()

    changeListener("active")

    expect(policy.shouldFlush.value).toBe(false)
  })

  it("does not request a flush on new events", () => {
    const policy = new AppStateFlushPolicy()
    policy.start()

    policy.onEvent()

    expect(policy.shouldFlush.value).toBe(false)
  })

  it("stops listening when the policy ends", () => {
    const policy = new AppStateFlushPolicy()
    policy.start()

    policy.end()

    expect(remove).toHaveBeenCalled()
  })
})
