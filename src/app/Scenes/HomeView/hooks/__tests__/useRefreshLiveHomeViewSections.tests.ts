import { act, renderHook } from "@testing-library/react-native"
import { useRefreshLiveHomeViewSections } from "app/Scenes/HomeView/hooks/useRefreshLiveHomeViewSections"

type FocusEffect = () => void | (() => void)

let mockFocusEffect: FocusEffect

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (effect: FocusEffect) => {
    mockFocusEffect = effect
  },
}))

describe("useRefreshLiveHomeViewSections", () => {
  let cleanupFocusEffect: void | (() => void)

  const focusHome = async () => {
    await act(() => {
      cleanupFocusEffect = mockFocusEffect()
    })
  }

  const blurHome = async () => {
    await act(() => {
      cleanupFocusEffect?.()
      cleanupFocusEffect = undefined
    })
  }

  beforeEach(() => {
    cleanupFocusEffect = undefined
  })

  it("refreshes when Home regains focus without an overlay", async () => {
    const refresh = jest.fn()

    await renderHook(() => useRefreshLiveHomeViewSections({ hasLiveSections: true, refresh }))

    await focusHome()
    await blurHome()
    await focusHome()

    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it("defers a focus refresh until the Home overlay closes", async () => {
    const refresh = jest.fn()
    const { result } = await renderHook(() =>
      useRefreshLiveHomeViewSections({ hasLiveSections: true, refresh })
    )

    await focusHome()
    await act(() => result.current.onSearchOverlayVisibilityChange(true))
    await blurHome()
    await focusHome()

    expect(refresh).not.toHaveBeenCalled()

    await act(() => result.current.onSearchOverlayVisibilityChange(false))

    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it("does not refresh when the overlay opens and closes without a focus change", async () => {
    const refresh = jest.fn()
    const { result } = await renderHook(() =>
      useRefreshLiveHomeViewSections({ hasLiveSections: true, refresh })
    )

    await focusHome()
    await act(() => result.current.onSearchOverlayVisibilityChange(true))
    await act(() => result.current.onSearchOverlayVisibilityChange(false))

    expect(refresh).not.toHaveBeenCalled()
  })

  it("waits for the next focus if the overlay closes while Home is blurred", async () => {
    const refresh = jest.fn()
    const { result } = await renderHook(() =>
      useRefreshLiveHomeViewSections({ hasLiveSections: true, refresh })
    )

    await focusHome()
    await act(() => result.current.onSearchOverlayVisibilityChange(true))
    await blurHome()
    await focusHome()
    await blurHome()

    await act(() => result.current.onSearchOverlayVisibilityChange(false))

    expect(refresh).not.toHaveBeenCalled()

    await focusHome()

    expect(refresh).toHaveBeenCalledTimes(1)
  })
})
