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

  const focusHome = () => {
    act(() => {
      cleanupFocusEffect = mockFocusEffect()
    })
  }

  const blurHome = () => {
    act(() => {
      cleanupFocusEffect?.()
      cleanupFocusEffect = undefined
    })
  }

  beforeEach(() => {
    cleanupFocusEffect = undefined
  })

  it("refreshes when Home regains focus without an overlay", () => {
    const refresh = jest.fn()

    renderHook(() => useRefreshLiveHomeViewSections({ hasLiveSections: true, refresh }))

    focusHome()
    blurHome()
    focusHome()

    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it("defers a focus refresh until the Home overlay closes", () => {
    const refresh = jest.fn()
    const { result } = renderHook(() =>
      useRefreshLiveHomeViewSections({ hasLiveSections: true, refresh })
    )

    focusHome()
    act(() => result.current.onSearchOverlayVisibilityChange(true))
    blurHome()
    focusHome()

    expect(refresh).not.toHaveBeenCalled()

    act(() => result.current.onSearchOverlayVisibilityChange(false))

    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it("does not refresh when the overlay opens and closes without a focus change", () => {
    const refresh = jest.fn()
    const { result } = renderHook(() =>
      useRefreshLiveHomeViewSections({ hasLiveSections: true, refresh })
    )

    focusHome()
    act(() => result.current.onSearchOverlayVisibilityChange(true))
    act(() => result.current.onSearchOverlayVisibilityChange(false))

    expect(refresh).not.toHaveBeenCalled()
  })

  it("waits for the next focus if the overlay closes while Home is blurred", () => {
    const refresh = jest.fn()
    const { result } = renderHook(() =>
      useRefreshLiveHomeViewSections({ hasLiveSections: true, refresh })
    )

    focusHome()
    act(() => result.current.onSearchOverlayVisibilityChange(true))
    blurHome()
    focusHome()
    blurHome()

    act(() => result.current.onSearchOverlayVisibilityChange(false))

    expect(refresh).not.toHaveBeenCalled()

    focusHome()

    expect(refresh).toHaveBeenCalledTimes(1)
  })
})
