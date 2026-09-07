import { screen } from "@testing-library/react-native"
import { CityGuideEvents } from "app/Scenes/CityGuide/Components/CityGuideEvents"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityGuideEvents", () => {
  it("interpolates the city name into the two Current sections, but not Opening Soon", () => {
    renderWithWrappers(<CityGuideEvents cityName="London" />)

    expect(screen.getByText("Current London Fairs")).toBeOnTheScreen()
    expect(screen.getByText("Current London Shows")).toBeOnTheScreen()
    expect(screen.getByText("Opening Soon")).toBeOnTheScreen()
  })

  it("renders a card in each rail", () => {
    renderWithWrappers(<CityGuideEvents cityName="London" />)

    // One per rail: a fair, a running show with its admission line, and one opening soon.
    expect(screen.getByText("Frieze London")).toBeOnTheScreen()
    expect(screen.getByText("One Fly Makes No Summer")).toBeOnTheScreen()
    expect(screen.getByText("Vestiges")).toBeOnTheScreen()
  })
})
