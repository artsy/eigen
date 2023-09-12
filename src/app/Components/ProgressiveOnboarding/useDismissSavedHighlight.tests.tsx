import { Tabs } from "@artsy/palette-mobile"
import { renderHook } from "@testing-library/react-hooks"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { useDismissSavedHighlight } from "./useDismissSavedHighlight"

describe("useDismissSavedHighlight", () => {
  it("dismisses if it isn't dismissed yet", () => {
    jest.spyOn(Tabs, "useFocusedTab").mockReturnValue("Saves")
    const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>
    renderHook(() => useDismissSavedHighlight(), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction().type).toContain(
      "progressiveOnboarding.dismiss"
    )
  })

  it("does not dismiss if it is already dismissed", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        dismissed: [{ key: "save-highlight", timestamp: Date.now() }],
      },
    })
    const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>
    renderHook(() => useDismissSavedHighlight(), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction().type).not.toContain(
      "progressiveOnboarding.dismiss"
    )
  })

  it("does not dismiss if it's not in the 'Saves' tab", () => {
    jest.spyOn(Tabs, "useFocusedTab").mockReturnValue("My Collection")
    const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>
    renderHook(() => useDismissSavedHighlight(), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction()).toBeUndefined()
  })
})
