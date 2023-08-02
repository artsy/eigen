import { renderHook } from "@testing-library/react-hooks"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { useDismissSavedArtwork } from "./useDismissSavedArtwork"

describe("useDismissSavedArtwork", () => {
  it("dismisses and update profileTab if the there is an Artwork saved", () => {
    const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>
    renderHook(() => useDismissSavedArtwork(true), { wrapper })

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(state?.progressiveOnboarding.dismissed[0].key).toBe("save-artwork")
    expect(state?.bottomTabs.sessionState.tabProps.profile?.savedArtwork).toBe(true)
  })

  it("it does not dismiss the artwork is not saved", () => {
    const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>
    renderHook(() => useDismissSavedArtwork(false), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction()).toBeUndefined()
  })

  it("it does not dismiss if it is already dismissed", () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        dismissed: [{ key: "save-artwork", timestamp: Date.now() }],
      },
    })
    const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>
    renderHook(() => useDismissSavedArtwork(true), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction().type).toContain("__inject")
  })
})
