import { fireEvent, screen } from "@testing-library/react-native"
import { ExploreByCategory } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategory"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useTracking } from "react-tracking"

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
}))

jest.mock("react-native-device-info", () => ({
  isTablet: jest.fn(() => false),
}))

describe("ExploreByCategory", () => {
  const trackEvent = useTracking().trackEvent

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders all category cards", () => {
    renderWithWrappers(<ExploreByCategory />)

    expect(screen.getByText("Explore by Category")).toBeOnTheScreen()
    expect(screen.getByText("Medium")).toBeOnTheScreen()
    expect(screen.getByText("Movement")).toBeOnTheScreen()
    expect(screen.getByText("Size")).toBeOnTheScreen()
    expect(screen.getByText("Color")).toBeOnTheScreen()
    expect(screen.getByText("Price")).toBeOnTheScreen()
    expect(screen.getByText("Gallery")).toBeOnTheScreen()
  })

  it("navigates to collections by category when card is pressed", () => {
    renderWithWrappers(<ExploreByCategory />)

    fireEvent.press(screen.getByText("Medium"))
    expect(navigate).toHaveBeenCalledWith("/collections-by-category/Medium", {
      passProps: { category: "Medium", entityID: "Medium" },
    })
  })

  it("tracks analytics when card is pressed", () => {
    renderWithWrappers(<ExploreByCategory />)

    fireEvent.press(screen.getByText("Price"))

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedCardGroup",
      context_module: "exploreBy",
      context_screen_owner_type: "search",
      destination_screen_owner_type: "collectionsCategory",
      destination_path: "/collections-by-category/Price",
      destination_screen_owner_id: "Collect by Price",
      horizontal_slide_position: 4,
      type: "thumbnail",
    })
  })
})
