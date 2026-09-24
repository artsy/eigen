import { OwnerType } from "@artsy/cohesion"
import { screen } from "@testing-library/react-native"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CityEventRowContext, renderFairRow } from "app/Scenes/CityGuide/Components/CityEventRows"
import { Fair } from "app/Scenes/CityGuide/utils/types"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const TEST_CONTEXT: CityEventRowContext = {
  contextScreenOwnerType: OwnerType.cityGuideEventList,
  contextScreenOwnerSlug: "london-united-kingdom",
}

const makeFair = (overrides: Partial<Fair> = {}): Fair =>
  ({
    id: "fair-1",
    internalID: "fair-internal-1",
    slug: "frieze-london",
    name: "Frieze London",
    location: { address: "The Regent's Park, London NW1 4NR" },
    ...overrides,
  }) as unknown as Fair

describe("renderFairRow", () => {
  it("renders a plus for a fair with an address", () => {
    renderWithWrappers(
      <AddToItineraryProvider citySlug="london-united-kingdom" cityName="London">
        {renderFairRow(makeFair(), TEST_CONTEXT)}
      </AddToItineraryProvider>
    )

    expect(screen.getByLabelText("Add Frieze London to an itinerary")).toBeTruthy()
  })

  // A stop needs a place to go, same rule the Fair page header's own plus follows.
  it("renders no plus for a fair with no address", () => {
    renderWithWrappers(
      <AddToItineraryProvider citySlug="london-united-kingdom" cityName="London">
        {renderFairRow(makeFair({ location: null }), TEST_CONTEXT)}
      </AddToItineraryProvider>
    )

    expect(screen.queryByLabelText("Add Frieze London to an itinerary")).toBeNull()
  })
})
