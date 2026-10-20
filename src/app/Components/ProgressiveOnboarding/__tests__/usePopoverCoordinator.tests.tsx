import { renderHook, waitFor } from "@testing-library/react-native"
import {
  __resetPresentedOverlays__,
  registerPresentedOverlay,
  unregisterPresentedOverlay,
} from "app/Components/ProgressiveOnboarding/popoverPresentationContext"
import {
  POPOVER_OPEN_TIMEOUT_MS,
  POPOVER_RELEASE_GRACE_MS,
  usePopoverCoordinator,
} from "app/Components/ProgressiveOnboarding/usePopoverCoordinator"
import { GlobalStoreProvider, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2,
  PROGRESSIVE_ONBOARDING_OFFER_SETTINGS,
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
  ProgressiveOnboardingKey,
} from "app/store/ProgressiveOnboardingModel"
import { CurrentRoute } from "app/utils/hooks/useCurrentRoute"
import { act } from "react"

let mockCurrentRoute: CurrentRoute = { name: "Home", key: "Home-1" }

jest.mock("app/utils/hooks/useCurrentRoute", () => ({
  useCurrentRoute: () => mockCurrentRoute,
}))

// The coordinator's own delay behaviour is covered in useShowDelay.tests; here we want
// the gating logic, so the globally mocked (pass-through) useShowDelay is what we want.

const lock = () =>
  __globalStoreTestUtils__?.getCurrentState().progressiveOnboarding.sessionState.activePopover

describe("usePopoverCoordinator", () => {
  const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

  beforeEach(() => {
    __resetPresentedOverlays__()
    mockCurrentRoute = { name: "Home", key: "Home-1" }
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

  it("hands the lock to a waiting popover once the holder finishes closing", async () => {
    const { result: holder, rerender: rerenderHolder } = renderHook<
      ReturnType<typeof usePopoverCoordinator>,
      { isDisplayable: boolean }
    >(
      ({ isDisplayable }) =>
        usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable }),
      { wrapper, initialProps: { isDisplayable: true } }
    )
    await waitFor(() => expect(holder.current.isVisible).toBe(true))

    // The next step of a chain: it becomes displayable in the same commit the holder is
    // dismissed, while the holder still owns the lock and is animating out.
    rerenderHolder({ isDisplayable: false })
    const { result: next } = renderHook(
      () =>
        usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_OFFER_SETTINGS, isDisplayable: true }),
      { wrapper }
    )
    expect(next.current.isVisible).toBe(false)
    expect(lock()).toBe(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)

    act(() => holder.current.onCloseComplete())

    await waitFor(() => expect(next.current.isVisible).toBe(true))
    expect(lock()).toBe(PROGRESSIVE_ONBOARDING_OFFER_SETTINGS)
  })

  describe("when the id changes while holding the lock", () => {
    const renderWithId = () =>
      renderHook<
        ReturnType<typeof usePopoverCoordinator>,
        { id: ProgressiveOnboardingKey; isDisplayable: boolean }
      >(({ id, isDisplayable }) => usePopoverCoordinator({ id, isDisplayable }), {
        wrapper,
        initialProps: { id: PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1, isDisplayable: true },
      })

    it("releases the id it acquired once it finishes closing", () => {
      const { result, rerender } = renderWithId()
      expect(result.current.isVisible).toBe(true)

      // The alert reminder: dismissing reminder 1 switches the key to reminder 2.
      rerender({ id: PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2, isDisplayable: false })
      expect(result.current.isVisible).toBe(false)
      expect(lock()).toBe(PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1)

      act(() => result.current.onCloseComplete())

      expect(lock()).toBeUndefined()
    })

    it("releases the id it acquired after the grace period", () => {
      jest.useFakeTimers()

      const { result, rerender } = renderWithId()
      // Opened, so no open is pending and the grace period is what releases.
      act(() => result.current.onOpenComplete())
      rerender({ id: PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2, isDisplayable: false })

      act(() => {
        jest.advanceTimersByTime(POPOVER_RELEASE_GRACE_MS)
      })

      expect(lock()).toBeUndefined()

      jest.useRealTimers()
    })

    it("releases the id it acquired on unmount", () => {
      const { rerender, unmount } = renderWithId()
      rerender({ id: PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2, isDisplayable: false })

      unmount()

      expect(lock()).toBeUndefined()
    })
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

  it("still recovers a popover hidden before it finished opening", () => {
    jest.useFakeTimers()

    const { result, rerender } = renderHook<
      ReturnType<typeof usePopoverCoordinator>,
      { isDisplayable: boolean }
    >(
      ({ isDisplayable }) =>
        usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable }),
      { wrapper, initialProps: { isDisplayable: true } }
    )
    expect(result.current.isVisible).toBe(true)
    const remountKeyBefore = result.current.remountKey

    // City Guide fast-scroll: the anchor leaves the view mid-open. The bubble never
    // measures, so neither `onOpenComplete` nor `onCloseComplete` ever fires.
    rerender({ isDisplayable: false })
    expect(result.current.isVisible).toBe(false)

    // The grace period must not hand the lock on while that Modal may still be up.
    act(() => {
      jest.advanceTimersByTime(POPOVER_RELEASE_GRACE_MS)
    })
    expect(lock()).toBe(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)

    act(() => {
      jest.advanceTimersByTime(POPOVER_OPEN_TIMEOUT_MS - POPOVER_RELEASE_GRACE_MS)
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

    // Never opens, repeatedly. The watchdog releases the lock and the popover gives up
    // until it stops being showable, so one that is genuinely broken stays down instead
    // of remounting every few seconds forever.
    for (let i = 0; i < 5; i++) {
      act(() => {
        jest.advanceTimersByTime(POPOVER_OPEN_TIMEOUT_MS)
      })
    }

    expect(result.current.isVisible).toBe(false)
    expect(lock()).toBeUndefined()

    jest.useRealTimers()
  })
  it("does not show after navigating to another instance of the same route", () => {
    const { result, rerender } = renderHook<
      ReturnType<typeof usePopoverCoordinator>,
      { isDisplayable: boolean }
    >(
      ({ isDisplayable }) =>
        usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable }),
      { wrapper, initialProps: { isDisplayable: false } }
    )

    rerender({ isDisplayable: true })
    expect(result.current.isVisible).toBe(true)

    // Same route name, different instance — pushing an artist screen over an artist
    // screen. A name comparison would see no change here.
    mockCurrentRoute = { name: "Home", key: "Home-2" }
    rerender({ isDisplayable: true })

    expect(result.current.isVisible).toBe(false)
  })

  it("does not revive the request when navigating back to the anchor route", () => {
    const { result, rerender } = renderHook<
      ReturnType<typeof usePopoverCoordinator>,
      { isDisplayable: boolean }
    >(
      ({ isDisplayable }) =>
        usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable }),
      { wrapper, initialProps: { isDisplayable: false } }
    )

    rerender({ isDisplayable: true })
    expect(result.current.isVisible).toBe(true)

    mockCurrentRoute = { name: "Artwork", key: "Artwork-1" }
    rerender({ isDisplayable: true })
    expect(result.current.isVisible).toBe(false)

    mockCurrentRoute = { name: "Home", key: "Home-1" }
    rerender({ isDisplayable: true })

    // The moment has passed: the user is minutes and several screens past the thing
    // that made this displayable.
    expect(result.current.isVisible).toBe(false)
  })

  it("re-arms on a fresh visit once it stops being displayable", () => {
    const { result, rerender } = renderHook<
      ReturnType<typeof usePopoverCoordinator>,
      { isDisplayable: boolean }
    >(
      ({ isDisplayable }) =>
        usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable }),
      { wrapper, initialProps: { isDisplayable: false } }
    )

    rerender({ isDisplayable: true })
    mockCurrentRoute = { name: "Artwork", key: "Artwork-1" }
    rerender({ isDisplayable: true })
    expect(result.current.isVisible).toBe(false)

    // A fresh visit to the screen: the anchor is re-captured while we are standing on
    // it, which is why the reset has to happen on the new route rather than the old one.
    mockCurrentRoute = { name: "Home", key: "Home-2" }
    rerender({ isDisplayable: false })
    rerender({ isDisplayable: true })

    expect(result.current.isVisible).toBe(true)
  })
  it("still shows when the navigator resolves the route after the first render", () => {
    // The ref can be empty on our first render; the real hook fills it in from a mount
    // effect. Treating that as a navigation would sink any popover displayable at launch.
    mockCurrentRoute = { name: undefined, key: undefined }

    const { result, rerender } = renderHook<
      ReturnType<typeof usePopoverCoordinator>,
      { isDisplayable: boolean }
    >(
      ({ isDisplayable }) =>
        usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK, isDisplayable }),
      {
        wrapper,
        initialProps: { isDisplayable: true },
      }
    )

    mockCurrentRoute = { name: "Home", key: "Home-1" }
    rerender({ isDisplayable: true })

    expect(result.current.isVisible).toBe(true)
  })
})
