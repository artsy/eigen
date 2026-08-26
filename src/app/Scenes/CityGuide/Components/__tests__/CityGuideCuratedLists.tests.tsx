import { fireEvent, screen } from "@testing-library/react-native"
import { CityGuideCuratedLists } from "app/Scenes/CityGuide/Components/CityGuideCuratedLists"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CityGuideCuratedLists", () => {
  it("renders one pressable row per curated list", () => {
    renderWithWrappers(<CityGuideCuratedLists citySlug="london-united-kingdom" />)

    expect(screen.getAllByTestId("curated-list-row")).toHaveLength(3)
  })

  it("navigates to the itinerary when a row is tapped", () => {
    renderWithWrappers(<CityGuideCuratedLists citySlug="london-united-kingdom" />)

    fireEvent.press(screen.getAllByTestId("curated-list-row")[0])

    expect(navigate).toHaveBeenCalledWith(
      "/city-guide/london-united-kingdom/itinerary/chill-vibes-only"
    )
  })

  it("renders nothing for a city with no itineraries", () => {
    renderWithWrappers(<CityGuideCuratedLists citySlug="paris-france" />)

    expect(screen.queryAllByTestId("curated-list-row")).toHaveLength(0)
  })
})
