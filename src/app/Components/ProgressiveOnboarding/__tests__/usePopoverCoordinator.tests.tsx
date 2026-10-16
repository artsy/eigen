import { renderHook, waitFor } from "@testing-library/react-native"
import {
  __resetPresentedOverlays__,
  registerPresentedOverlay,
  unregisterPresentedOverlay,
} from "app/Components/ProgressiveOnboarding/popoverPresentationContext"
import { usePopoverCoordinator } from "app/Components/ProgressiveOnboarding/usePopoverCoordinator"
import { GlobalStoreProvider, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_OFFER_SETTINGS,
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
} from "app/store/ProgressiveOnboardingModel"
import { act } from "react"

jest.mock("app/utils/hooks/useCurrentRouteName", () => ({
  useCurrentRouteName: () => "Home",
}))

// The coordinator's own delay behaviour is covered in useShowDelay.tests; here we want
// the gating logic, so the globally mocked (pass-through) useShowDelay is what we want.

const lock = () =>
  __globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.sessionState.activePopover

describe("usePopoverCoordinator", () => {
  const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

  beforeEach(() => {
    __resetPresentedOverlays__()
  })

  it("shows and takes the lock when displayable", async () => {
    const { result } = renderHook(
      () => usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable: true }),
      { wrapper }
    )

    await waitFor(() => expect(result.current.isVisible).toBe(true))
    expect(lock()).toBe(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
  })

  it("refuses the lock to a second popover while one holds it", async () => {
    const { result: holder } = renderHook(
      () => usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable: true }),
      { wrapper }
    )
    await waitFor(() => expect(holder.current.isVisible).toBe(true))

    const { result: challenger } = renderHook(
      () =>
        usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_OFFER_SETTINGS, isDisplayable: true }),
      { wrapper }
    )

    expect(challenger.current.isVisible).toBe(false)
    expect(lock()).toBe(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
  })

  it("releases the lock when the holder unmounts", async () => {
    const { result, unmount } = renderHook(
      () => usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable: true }),
      { wrapper }
    )
    await waitFor(() => expect(result.current.isVisible).toBe(true))

    unmount()

    await waitFor(() => expect(lock()).toBeUndefined())
  })

  it("does not show while an overlay is presented above it", async () => {
    registerPresentedOverlay("some-bottom-sheet")

    const { result } = renderHook(
      () => usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable: true }),
      { wrapper }
    )

    expect(result.current.isVisible).toBe(false)
    expect(lock()).toBeUndefined()

    act(() => unregisterPresentedOverlay("some-bottom-sheet"))

    await waitFor(() => expect(result.current.isVisible).toBe(true))
  })
})
