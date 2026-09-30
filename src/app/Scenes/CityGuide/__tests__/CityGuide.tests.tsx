import { act } from "@testing-library/react-native"
import { CityGuide } from "app/Scenes/CityGuide/CityGuide"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { StatusBar } from "react-native"

let mockFocusEffect: () => void | (() => void)

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useFocusEffect: (effect: typeof mockFocusEffect) => {
    mockFocusEffect = effect
  },
}))
jest.mock("app/Scenes/CityGuide/hooks/useCityGuideCities", () => ({
  useCityGuideCities: () => [],
}))
jest.mock("app/Scenes/CityGuide/hooks/useInitialLocation", () => ({
  useInitialLocation: () => "london-united-kingdom",
}))
jest.mock("app/Scenes/CityGuide/Components/CityGuideMapQueryRenderer", () => ({
  CityGuideMapQueryRenderer: () => null,
}))

describe("CityGuide status bar", () => {
  beforeEach(() => {
    jest.spyOn(global, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0)
      return 1
    })
    jest.spyOn(global, "cancelAnimationFrame").mockImplementation(() => {})
    jest.spyOn(StatusBar, "setBarStyle").mockImplementation(() => {})
    __globalStoreTestUtils__?.injectFeatureFlags({ ARDarkModeSupport: true })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it.each(["on", "off"] as const)(
    "uses black status bar icons on the map with dark mode %s and restores the theme on blur",
    (darkModeOption) => {
      __globalStoreTestUtils__?.injectState({ devicePrefs: { darkModeOption } })
      renderWithWrappers(<CityGuide />)

      let cleanup: void | (() => void)
      act(() => {
        cleanup = mockFocusEffect()
      })
      expect(StatusBar.setBarStyle).toHaveBeenLastCalledWith("dark-content", true)

      act(() => cleanup?.())
      expect(StatusBar.setBarStyle).toHaveBeenLastCalledWith(
        darkModeOption === "on" ? "light-content" : "dark-content",
        true
      )
      expect(cancelAnimationFrame).toHaveBeenCalledWith(1)
    }
  )
})
