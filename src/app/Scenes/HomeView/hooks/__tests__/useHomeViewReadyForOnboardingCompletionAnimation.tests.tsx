import { act, renderHook } from "@testing-library/react-native"
import { useHomeViewReadyForOnboardingCompletionAnimation } from "app/Scenes/HomeView/hooks/useHomeViewReadyForOnboardingCompletionAnimation"
import { GlobalStore, GlobalStoreProvider, __globalStoreTestUtils__ } from "app/store/GlobalStore"

const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

const isHomeViewReadyForOnboardingCompletionAnimation = () =>
  __globalStoreTestUtils__?.getCurrentState().bottomTabs.sessionState
    .isHomeViewReadyForOnboardingCompletionAnimation

describe("useHomeViewReadyForOnboardingCompletionAnimation", () => {
  beforeEach(() => {
    GlobalStore.actions.bottomTabs.setIsHomeViewReadyForOnboardingCompletionAnimation(false)
    GlobalStore.actions.infiniteDiscovery.resetNewUserOnboardingSessionState()
    jest.spyOn(global, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("does not set isHomeViewReadyForOnboardingCompletionAnimation if the onboarding goal was never reached", () => {
    const { result } = renderHook(() => useHomeViewReadyForOnboardingCompletionAnimation(), {
      wrapper,
    })

    act(() => result.current.onLayout())

    expect(isHomeViewReadyForOnboardingCompletionAnimation()).toBe(false)
  })

  describe("once the onboarding goal has been reached", () => {
    beforeEach(() => {
      for (let i = 1; i <= 5; i++) {
        GlobalStore.actions.infiniteDiscovery.addNewUserOnboardingSavedArtwork({
          internalID: `artwork-${i}`,
          url: `https://example.com/${i}.jpg`,
        })
      }
    })

    it("sets isHomeViewReadyForOnboardingCompletionAnimation when onLayout fires", () => {
      const { result } = renderHook(() => useHomeViewReadyForOnboardingCompletionAnimation(), {
        wrapper,
      })

      expect(isHomeViewReadyForOnboardingCompletionAnimation()).toBe(false)

      act(() => result.current.onLayout())

      expect(isHomeViewReadyForOnboardingCompletionAnimation()).toBe(true)
    })

    it("only sets isHomeViewReadyForOnboardingCompletionAnimation once, even if onLayout fires again", () => {
      const { result } = renderHook(() => useHomeViewReadyForOnboardingCompletionAnimation(), {
        wrapper,
      })

      act(() => result.current.onLayout())
      GlobalStore.actions.bottomTabs.setIsHomeViewReadyForOnboardingCompletionAnimation(false)
      act(() => result.current.onLayout())

      expect(isHomeViewReadyForOnboardingCompletionAnimation()).toBe(false)
    })

    it("resets isHomeViewReadyForOnboardingCompletionAnimation on unmount", () => {
      const { result, unmount } = renderHook(
        () => useHomeViewReadyForOnboardingCompletionAnimation(),
        { wrapper }
      )

      act(() => result.current.onLayout())

      expect(isHomeViewReadyForOnboardingCompletionAnimation()).toBe(true)

      unmount()

      expect(isHomeViewReadyForOnboardingCompletionAnimation()).toBe(false)
    })
  })
})
