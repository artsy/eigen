import { fireEvent, screen } from "@testing-library/react-native"
import { CityFairRailCard } from "app/Scenes/CityGuide/Components/CityFairRailCard"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityFairRailCard", () => {
  const props = {
    title: "London Frieze",
    image: "https://example.com/fair.jpg",
    href: "/fair/frieze-london-2026",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the fair name over the image", () => {
    renderWithWrappers(<CityFairRailCard {...props} />)

    expect(screen.getByText("London Frieze")).toBeOnTheScreen()
  })

  it("navigates to the href when tapped", () => {
    renderWithWrappers(<CityFairRailCard {...props} />)

    fireEvent.press(screen.getByText("London Frieze"))

    expect(navigate).toHaveBeenCalledWith("/fair/frieze-london-2026")
  })
})
