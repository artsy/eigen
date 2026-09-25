import { renderHook } from "@testing-library/react-native"
import { CityData } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { useLocation } from "app/utils/hooks/useLocation"

jest.mock("app/utils/hooks/useLocation", () => ({
  useLocation: jest.fn(() => ({ location: null })),
}))

const cities: CityData[] = [
  { slug: "new-york-ny-usa", name: "New York", coordinates: { lat: 40.7128, lng: -74.006 } },
  { slug: "berlin-germany", name: "Berlin", coordinates: { lat: 52.52, lng: 13.405 } },
  { slug: "london-united-kingdom", name: "London", coordinates: { lat: 51.5074, lng: -0.1278 } },
]

const wrapper = ({ children }: any) => <GlobalStoreProvider>{children}</GlobalStoreProvider>

describe("useInitialLocation", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: null },
    })
  })

  it("returns the default city when nothing else is available", () => {
    const { result } = renderHook(() => useInitialLocation(cities), { wrapper })

    expect(result.current).toBe("new-york-ny-usa")
  })

  it("ignores a previously selected city that is no longer in the list", () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "atlantis" },
    })

    const { result } = renderHook(() => useInitialLocation(cities), { wrapper })

    expect(result.current).toBe("new-york-ny-usa")
  })

  it("returns the previously selected city when there is no preselected slug", () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    const { result } = renderHook(() => useInitialLocation(cities), { wrapper })

    expect(result.current).toBe("berlin-germany")
  })

  it("prefers a valid preselected city slug over the previously selected city", () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    const { result } = renderHook(() => useInitialLocation(cities, "london-united-kingdom"), {
      wrapper,
    })

    expect(result.current).toBe("london-united-kingdom")
  })

  it("falls back to the default behavior when the preselected city slug is invalid", () => {
    __globalStoreTestUtils__?.injectState({
      userPrefs: { previouslySelectedCitySlug: "berlin-germany" },
    })

    const { result } = renderHook(() => useInitialLocation(cities, "not-a-real-city"), { wrapper })

    expect(result.current).toBe("berlin-germany")
  })

  it("prefers a valid preselected city slug over the nearest city by location", () => {
    ;(useLocation as jest.Mock).mockReturnValueOnce({ location: { lat: 52.52, lng: 13.405 } })

    const { result } = renderHook(() => useInitialLocation(cities, "london-united-kingdom"), {
      wrapper,
    })

    expect(result.current).toBe("london-united-kingdom")
  })
})
