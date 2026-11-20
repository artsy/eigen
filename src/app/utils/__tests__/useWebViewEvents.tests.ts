import { act, renderHook } from "@testing-library/react-native"
import {
  useSetWebViewCallback,
  useWebViewCallback,
  useWebViewEvent,
} from "app/utils/useWebViewEvent"

describe("useWebViewEvent", () => {
  it("useSetWebViewCallback", async () => {
    const callback = () => "test value"
    const { result } = await renderHook(() => {
      useSetWebViewCallback("key", callback)
      return useWebViewEvent()
    })

    expect(result.current.webViewEvent[0]![0]).toBe("key")
    expect(result.current.webViewEvent[0]![1]).toBe(callback)
  })

  it("useWebViewCallback", async () => {
    const callback = jest.fn()
    const { result } = await renderHook(() => {
      useSetWebViewCallback("key", callback)
      return useWebViewCallback()
    })

    expect(result.current.webViewEvent[0]![0]).toBe("key")
    expect(result.current.webViewEvent[0]![1]).toBe(callback)
    await act(() => result.current.callWebViewEventCallback({ key: "key", data: "message" }))

    expect(result.current.webViewEvent).toHaveLength(0)
    expect(callback).toHaveBeenCalledWith({ data: "message" })
  })
})
