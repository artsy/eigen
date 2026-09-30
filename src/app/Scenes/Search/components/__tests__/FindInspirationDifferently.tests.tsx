import { fireEvent, screen } from "@testing-library/react-native"
import { FindInspirationDifferently } from "app/Scenes/Search/components/FindInspirationDifferently"
import { navigate } from "app/system/navigation/navigate"
import { useEnableArtAssistant } from "app/utils/hooks/useEnableArtAssistant"
import { useEnableArtsyLens } from "app/utils/hooks/useEnableArtsyLens"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { isTablet } from "react-native-device-info"

jest.mock("app/utils/hooks/useEnableArtAssistant", () => ({
  useEnableArtAssistant: jest.fn(),
}))
jest.mock("app/utils/hooks/useEnableArtsyLens", () => ({
  useEnableArtsyLens: jest.fn(),
}))
jest.mock("app/utils/hooks/useFeatureFlag", () => ({
  useFeatureFlag: jest.fn(),
}))
jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

describe("FindInspirationDifferently", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(isTablet).mockReturnValue(false)
    jest.mocked(useEnableArtsyLens).mockReturnValue(false)
    jest.mocked(useEnableArtAssistant).mockReturnValue(false)
    jest.mocked(useFeatureFlag).mockReturnValue(false)
  })

  it("shows City Guide and Discover Daily when the other features are unavailable", () => {
    renderWithWrappers(<FindInspirationDifferently />)

    expect(screen.getByText("Find Inspiration Differently")).toBeOnTheScreen()
    expect(screen.getByText("Discover Daily")).toBeOnTheScreen()
    expect(screen.getByText("City Guide")).toBeOnTheScreen()
    expect(screen.queryByText("Artsy Lens")).not.toBeOnTheScreen()
    expect(screen.queryByText("Art Assistant")).not.toBeOnTheScreen()
  })

  it("shows Artsy Lens only when it is enabled", () => {
    jest.mocked(useEnableArtsyLens).mockReturnValue(true)

    renderWithWrappers(<FindInspirationDifferently />)

    expect(screen.getByText("Artsy Lens")).toBeOnTheScreen()
    expect(screen.getByText("Discover Daily")).toBeOnTheScreen()
    expect(screen.queryByText("Art Assistant")).not.toBeOnTheScreen()
  })

  it("shows Art Assistant only when its entry point is enabled", () => {
    jest.mocked(useEnableArtAssistant).mockReturnValue(true)

    renderWithWrappers(<FindInspirationDifferently />)

    expect(screen.getByText("Art Assistant")).toBeOnTheScreen()
    expect(screen.queryByText("Artsy Lens")).not.toBeOnTheScreen()
  })

  it("exposes the card description and beta status to screen readers", () => {
    jest.mocked(useEnableArtsyLens).mockReturnValue(true)

    renderWithWrappers(<FindInspirationDifferently />)

    expect(screen.getByRole("button", { name: "Artsy Lens, beta" })).toHaveProp(
      "accessibilityHint",
      "Find matching art with just a photo"
    )
    expect(screen.getByRole("button", { name: "Discover Daily" })).toHaveProp(
      "accessibilityHint",
      "Find art you love, one swipe at a time"
    )
  })

  it("opens the new City Guide when the itineraries flag is on", () => {
    jest.mocked(useFeatureFlag).mockReturnValue(true)

    renderWithWrappers(<FindInspirationDifferently />)

    fireEvent.press(screen.getByRole("button", { name: "City Guide, beta" }))

    expect(navigate).toHaveBeenCalledWith("/city-guide")
  })

  it("opens the legacy City Guide when the itineraries flag is off", () => {
    renderWithWrappers(<FindInspirationDifferently />)

    fireEvent.press(screen.getByRole("button", { name: "City Guide, beta" }))

    expect(navigate).toHaveBeenCalledWith("/local-discovery")
  })

  it("hides City Guide on tablets", () => {
    jest.mocked(isTablet).mockReturnValue(true)
    jest.mocked(useFeatureFlag).mockReturnValue(true)

    renderWithWrappers(<FindInspirationDifferently />)

    expect(screen.queryByText("City Guide")).not.toBeOnTheScreen()
    expect(screen.getByText("Discover Daily")).toBeOnTheScreen()
  })
})
