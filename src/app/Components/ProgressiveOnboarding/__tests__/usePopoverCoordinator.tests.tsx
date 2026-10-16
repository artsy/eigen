import { renderHook, waitFor } from "@testing-library/react-native"
import {
  __resetPresentedOverlays__,
  registerPresentedOverlay,
  unregisterPresentedOverlay,
} from "app/Components/ProgressiveOnboarding/popoverPresentationContext"
import {
  POPOVER_OPEN_TIMEOUT_MS,
  usePopoverCoordinator,
} from "app/Components/ProgressiveOnboarding/usePopoverCoordinator"
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

  it("force-releases and remounts a popover that never finishes opening", () => {
    jest.useFakeTimers()

    const { result } = renderHook(
      () => usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable: true }),
      { wrapper }
    )

    // No `waitFor` here: it polls on timers we have faked. renderHook already flushes
    // effects inside act, so the lock is claimed by the time we get here.
    expect(result.current.isVisible).toBe(true)
    const remountKeyBefore = result.current.remountKey

    // `onOpenComplete` is deliberately never called: this is the stuck invisible Modal.
    act(() => {
      jest.advanceTimersByTime(POPOVER_OPEN_TIMEOUT_MS)
    })

    expect(result.current.remountKey).toBe(remountKeyBefore + 1)
    expect(lock()).toBeUndefined()

    jest.useRealTimers()
  })

  it("leaves a popover alone once it reports that it opened", () => {
    jest.useFakeTimers()

    const { result } = renderHook(
      () => usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable: true }),
      { wrapper }
    )

    expect(result.current.isVisible).toBe(true)
    const remountKeyBefore = result.current.remountKey

    act(() => result.current.onOpenComplete())
    act(() => {
      jest.advanceTimersByTime(POPOVER_OPEN_TIMEOUT_MS)
    })

    expect(result.current.remountKey).toBe(remountKeyBefore)
    expect(lock()).toBe(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)

    jest.useRealTimers()
  })

  it("does not loop when a popover keeps failing to open", () => {
    jest.useFakeTimers()

    const { result } = renderHook(
      () => usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable: true }),
      { wrapper }
    )

    // Never opens, repeatedly. The watchdog releases the lock but does not re-acquire:
    // the acquire effect is keyed on `canShow`, which has not changed, so a popover that
    // is genuinely broken stays down instead of remounting every few seconds forever.
    for (let i = 0; i < 5; i++) {
      act(() => {
        jest.advanceTimersByTime(POPOVER_OPEN_TIMEOUT_MS)
      })
    }

    expect(result.current.isVisible).toBe(false)
    expect(lock()).toBeUndefined()

    jest.useRealTimers()
  })
})
