import { act, renderHook } from "@testing-library/react-native"
import { __resetPresentedOverlays__ } from "app/Components/ProgressiveOnboarding/popoverPresentationContext"
import { ANCHOR_SETTLE_INTERVAL_MS } from "app/Components/ProgressiveOnboarding/useAnchorSettled"
import {
  POPOVER_RELEASE_GRACE_MS,
  usePopoverCoordinator,
} from "app/Components/ProgressiveOnboarding/usePopoverCoordinator"
import { GlobalStoreProvider, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import {
  PROGRESSIVE_ONBOARDING_OFFER_SETTINGS,
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
} from "app/store/ProgressiveOnboardingModel"
import { View } from "react-native"

// The rest of the coordinator tests run with `useAnchorSettled` mocked as a pass-through.
// These drive anchor measurements through the real hook, to cover how its two checks
// (before taking the lock, and after the show delay) interact with the lock.
jest.unmock("app/Components/ProgressiveOnboarding/useAnchorSettled")

jest.mock("app/utils/hooks/useCurrentRoute", () => ({
  useCurrentRoute: () => ({ name: "Home", key: "Home-1" }),
  readCurrentRoute: () => ({ name: "Home", key: "Home-1" }),
}))

const lock = () =>
  __globalStoreTestUtils__
    ?.getCurrentState()
    .progressiveOnboarding.sessionState.activePopover?.split("#")[0]

/** An anchor whose on-screen position is whatever `position` says at measure time. */
const makeAnchor = (position: { x: number; y: number }) => ({
  current: {
    measureInWindow: (callback: (...args: number[]) => void) =>
      callback(position.x, position.y, 100, 40),
  } as unknown as View,
})

const advance = (ms: number) =>
  act(() => {
    jest.advanceTimersByTime(ms)
  })

describe("usePopoverCoordinator with anchor measurements", () => {
  const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

  beforeEach(() => {
    jest.useFakeTimers()
    __resetPresentedOverlays__()
  })
  afterEach(() => jest.useRealTimers())

  it("does not take the lock while its anchor is off screen", () => {
    const anchorRef = makeAnchor({ x: 0, y: -600 })
    const { result } = renderHook(
      () =>
        usePopoverCoordinator({
          id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
          isDisplayable: true,
          anchorRef,
        }),
      { wrapper }
    )

    advance(ANCHOR_SETTLE_INTERVAL_MS * 10)

    expect(result.current.isVisible).toBe(false)
    expect(lock()).toBeUndefined()
  })

  it("gives the lock back when its anchor leaves the screen after taking it", () => {
    const position = { x: 0, y: 200 }
    const anchorRef = makeAnchor(position)
    const { result: holder } = renderHook(
      () =>
        usePopoverCoordinator({
          id: PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
          isDisplayable: true,
          anchorRef,
        }),
      { wrapper }
    )

    // Still and on screen: takes the lock, then checks the anchor again before showing.
    advance(ANCHOR_SETTLE_INTERVAL_MS)
    expect(lock()).toBe(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
    expect(holder.current.isVisible).toBe(false)

    // A sibling whose anchor is in plain view queues behind it.
    const { result: sibling, rerender: rerenderSibling } = renderHook<
      ReturnType<typeof usePopoverCoordinator>,
      { isDisplayable: boolean }
    >(
      ({ isDisplayable }) =>
        usePopoverCoordinator({ id: PROGRESSIVE_ONBOARDING_OFFER_SETTINGS, isDisplayable }),
      { wrapper, initialProps: { isDisplayable: true } }
    )

    // Scrolled away before the second check settles.
    position.y = -600
    advance(ANCHOR_SETTLE_INTERVAL_MS)
    expect(holder.current.isVisible).toBe(false)

    advance(POPOVER_RELEASE_GRACE_MS)

    expect(lock()).toBe(PROGRESSIVE_ONBOARDING_OFFER_SETTINGS)
    expect(sibling.current.isVisible).toBe(true)

    // Once the sibling is dismissed and the anchor is back, the popover shows after all.
    rerenderSibling({ isDisplayable: false })
    act(() => sibling.current.onCloseComplete())
    position.y = 200
    // Both checks settle again. One interval at a time: the second check only starts once
    // React has re-rendered with the lock, which happens between `act` calls.
    for (let i = 0; i < 4; i++) {
      advance(ANCHOR_SETTLE_INTERVAL_MS)
    }

    expect(lock()).toBe(PROGRESSIVE_ONBOARDING_SAVE_ARTWORK)
    expect(holder.current.isVisible).toBe(true)
  })
})
