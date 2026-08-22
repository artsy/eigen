import { renderHook } from "@testing-library/react-native"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { useLocation } from "app/utils/hooks/useLocation"

jest.mock("app/utils/hooks/useLocation", () => ({
  useLocation: jest.fn(() => ({ location: null })),
}))

const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

describe("useInitialLocation", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: null },
    })
  })

  it("returns the default city when nothing else is available", () => {
    const { result } = renderHook(() => useInitialLocation(), { wrapper })

    expect(result.current).toBe("new-york-ny-usa")
  })

  it("returns the previously selected city when there is no preselected slug", () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    const { result } = renderHook(() => useInitialLocation(), { wrapper })

    expect(result.current).toBe("berlin-germany")
  })

  it("prefers a valid preselected city slug over the previously selected city", () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    const { result } = renderHook(() => useInitialLocation("london-united-kingdom"), { wrapper })

    expect(result.current).toBe("london-united-kingdom")
  })

  it("falls back to the default behavior when the preselected city slug is invalid", () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    const { result } = renderHook(() => useInitialLocation("not-a-real-city"), { wrapper })

    expect(result.current).toBe("berlin-germany")
  })

  it("prefers a valid preselected city slug over the nearest city by location", () => {
    ;(useLocation as jest.Mock).mockReturnValueOnce({ location: { lat: 52.52, lng: 13.405 } })

    const { result } = renderHook(() => useInitialLocation("london-united-kingdom"), { wrapper })

    expect(result.current).toBe("london-united-kingdom")
  })
})
