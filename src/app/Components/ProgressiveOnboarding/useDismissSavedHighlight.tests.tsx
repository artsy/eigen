import { Tabs } from "@artsy/palette-mobile"
import { renderHook } from "@testing-library/react-hooks"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { useDismissSavedHighlight } from "./useDismissSavedHighlight"

describe("useDismissSavedHighlight", () => {
  const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

  it("dismisses if it isn't dismissed yet", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true } },
    })
    jest.spyOn(Tabs, "useFocusedTab").mockReturnValue("Saves")
    renderHook(() => useDismissSavedHighlight(), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction().type).toContain(
      "progressiveOnboarding.dismiss"
    )
  })

  it("does not dismiss if it is already dismissed", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [{ key: "save-highlight", timestamp: Date.now() }],
      },
    })
    renderHook(() => useDismissSavedHighlight(), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction().type).not.toContain(
      "progressiveOnboarding.dismiss"
    )
  })

  it("does not dismiss if it's not in the 'Saves' tab", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true } },
    })
    jest.spyOn(Tabs, "useFocusedTab").mockReturnValue("My Collection")
    renderHook(() => useDismissSavedHighlight(), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction()).not.toContain("progressiveOnboarding.dismiss")
  })

  it("does not dismiss if isReady is false", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: { sessionState: { isReady: true } },
    })
    jest.spyOn(Tabs, "useFocusedTab").mockReturnValue("Saves")

    renderHook(() => useDismissSavedHighlight(), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction()).not.toContain("progressiveOnboarding.dismiss")
  })
})
