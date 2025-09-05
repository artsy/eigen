import { renderHook } from "@testing-library/react-native"
import {
  useSetWebViewCallback,
  useWebViewCallback,
  useWebViewEvent,
} from "app/utils/useWebViewEvent"
import { act } from "react-test-renderer"

describe("useWebViewEvent", () => {
  it("useSetWebViewCallback", () => {
    const callback = () => "test value"
    const { result } = renderHook(() => {
      useSetWebViewCallback("key", callback)
      return useWebViewEvent()
    })

    expect(result.current.webViewEvent[0]![0]).toBe("key")
    expect(result.current.webViewEvent[0]![1]).toBe(callback)
  })

  it("useWebViewCallback", async () => {
    const callback = jest.fn()
    const { result } = renderHook(() => {
      useSetWebViewCallback("key", callback)
      return useWebViewCallback()
    })

    expect(result.current.webViewEvent[0]![0]).toBe("key")
    expect(result.current.webViewEvent[0]![1]).toBe(callback)
    act(() => result.current.callWebViewEventCallback({ key: "key", data: "message" }))

    expect(result.current.webViewEvent).toHaveLength(0)
    expect(callback).toHaveBeenCalledWith({ data: "message" })
  })
})
