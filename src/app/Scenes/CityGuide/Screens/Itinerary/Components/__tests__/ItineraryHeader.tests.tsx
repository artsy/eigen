import { screen } from "@testing-library/react-native"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { MOCK_ITINERARIES } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ItineraryHeader", () => {
  it("renders the title, subtitle, author and description", () => {
    renderWithWrappers(<ItineraryHeader itinerary={MOCK_ITINERARIES[0]} />)

    expect(screen.getByText("Chill Vibes Only")).toBeTruthy()
    expect(screen.getByText("Top picks")).toBeTruthy()
    expect(screen.getByText("By Casey Lesser")).toBeTruthy()
    expect(screen.getByText(MOCK_ITINERARIES[0].description)).toBeTruthy()
  })

  it("renders a scrim behind the hero text", () => {
    renderWithWrappers(<ItineraryHeader itinerary={MOCK_ITINERARIES[0]} />)

    expect(screen.getByTestId("itinerary-hero-scrim")).toBeTruthy()
  })
})
