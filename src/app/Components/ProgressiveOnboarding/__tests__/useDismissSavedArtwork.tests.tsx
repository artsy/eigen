import { renderHook } from "@testing-library/react-native"
import { useDismissSavedArtwork } from "app/Components/ProgressiveOnboarding/useDismissSavedArtwork"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"

const mockUseIsFocusedMock = jest.fn()
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useIsFocused: () => mockUseIsFocusedMock(),
}))

describe("useDismissSavedArtwork", () => {
  const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

  beforeEach(() => {
    mockUseIsFocusedMock.mockReturnValue(true)
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
      },
    })
  })

  it("dismisses and update profileTab if the there is an Artwork saved", async () => {
    await renderHook(() => useDismissSavedArtwork(true), { wrapper })

    const state = __globalStoreTestUtils__?.getCurrentState()
    expect(state?.progressiveOnboarding.dismissed[0].key).toBe("save-artwork")
    expect(state?.bottomTabs.sessionState.tabProps.profile?.savedArtwork).toBe(true)
  })

  it("it does not dismiss the artwork is not saved", async () => {
    await renderHook(() => useDismissSavedArtwork(false), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction()).not.toContain("progressiveOnboarding.dismiss")
  })

  it("it does not dismiss if it is already dismissed", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
        dismissed: [{ key: "save-artwork", timestamp: Date.now() }],
      },
    })
    await renderHook(() => useDismissSavedArtwork(true), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction()).not.toContain("progressiveOnboarding.dismiss")
  })

  it("it does not dismiss if isReady is false", async () => {
    __globalStoreTestUtils__?.injectState({
      progressiveOnboarding: {
        sessionState: { isReady: true },
      },
    })
    await renderHook(() => useDismissSavedArtwork(true), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction()).not.toContain("progressiveOnboarding.dismiss")
  })

  it("it does not dismiss the tab is not focused", async () => {
    mockUseIsFocusedMock.mockReturnValue(false)
    await renderHook(() => useDismissSavedArtwork(true), { wrapper })

    expect(__globalStoreTestUtils__?.getLastAction()).not.toContain("progressiveOnboarding.dismiss")
  })
})
