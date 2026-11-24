import { act, renderHook } from "@testing-library/react-native"
import useAppState from "app/utils/useAppState"
import { AppState, AppStateStatus } from "react-native"

const originalCurrentState = Object.getOwnPropertyDescriptor(AppState, "currentState")

describe("useAppState", () => {
  let handleStateChange: (state: AppStateStatus) => void
  const remove = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, handler) => {
      handleStateChange = handler
      return { remove }
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    if (originalCurrentState) {
      Object.defineProperty(AppState, "currentState", originalCurrentState)
    }
  })

  it("returns the current app state on mount", async () => {
    Object.defineProperty(AppState, "currentState", {
      configurable: true,
      value: "background",
    })

    const { result } = await renderHook(() => useAppState({}))

    expect(result.current.appState).toBe("background")
  })

  it("preserves the foreground, background, and change callbacks", async () => {
    Object.defineProperty(AppState, "currentState", {
      configurable: true,
      value: "active",
    })
    const onForeground = jest.fn()
    const onBackground = jest.fn()
    const onChange = jest.fn()

    await renderHook(() => useAppState({ onForeground, onBackground, onChange }))

    await act(() => handleStateChange("inactive"))
    expect(onBackground).not.toHaveBeenCalled()

    await act(() => handleStateChange("active"))
    expect(onForeground).toHaveBeenCalledTimes(1)

    await act(() => handleStateChange("background"))
    expect(onBackground).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenNthCalledWith(1, "inactive")
    expect(onChange).toHaveBeenNthCalledWith(2, "active")
    expect(onChange).toHaveBeenNthCalledWith(3, "background")
  })

  it("removes the app state listener on unmount", async () => {
    const { unmount } = await renderHook(() => useAppState({}))

    await unmount()

    expect(remove).toHaveBeenCalledTimes(1)
  })
})
