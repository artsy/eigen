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

  it("renders the fair name over the image", async () => {
    await renderWithWrappers(<CityFairRailCard {...props} />)

    expect(screen.getByText("London Frieze")).toBeOnTheScreen()
  })

  it("navigates to the href when tapped", async () => {
    await renderWithWrappers(<CityFairRailCard {...props} />)

    await fireEvent.press(screen.getByText("London Frieze"))

    expect(navigate).toHaveBeenCalledWith("/fair/frieze-london-2026")
  })

  it("fires onPress before navigating", async () => {
    const onPress = jest.fn()
    await renderWithWrappers(<CityFairRailCard {...props} onPress={onPress} />)

    await fireEvent.press(screen.getByText("London Frieze"))

    expect(onPress).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith("/fair/frieze-london-2026")
  })
})
