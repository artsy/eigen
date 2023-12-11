import { renderHook, waitFor } from "@testing-library/react-native"
import { GlobalStoreProvider, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useSetActivePopover } from "./useSetActivePopover"

describe("useSetActivePopver", () => {
  const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

  it("isActive is true given isDisplayable true and no activePopover", () => {
    const { result } = renderHook(() => useSetActivePopover(true), { wrapper })

    expect(result.current.isActive).toBe(true)
  })

  it("isActive is false given isDisplayable true and a different activePopover", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { activePopover: "test-id" } },
    })
    const { result } = renderHook(() => useSetActivePopover(true), { wrapper })

    expect(result.current.isActive).toBe(false)
  })

  it("isActive is false given isDisplayable false and no activePopover", () => {
    const { result } = renderHook(() => useSetActivePopover(false), { wrapper })

    expect(result.current.isActive).toBe(false)
  })

  it("isActive is false given isDisplayable false and a different activePopover", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { activePopover: "test-id" } },
    })
    const { result } = renderHook(() => useSetActivePopover(false), { wrapper })

    expect(result.current.isActive).toBe(false)
  })

  it("should correctly set the active state of the 1st popover, 2nd should remain false", async () => {
    const { result: result1 } = renderHook(() => useSetActivePopover(true), { wrapper })

    await waitFor(() => expect(result1.current.isActive).toBe(true))

    const { result: result2 } = renderHook(() => useSetActivePopover(true), { wrapper })
    expect(result2.current.isActive).toBe(false)
  })
})
