import { screen } from "@testing-library/react-native"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import {
  ItineraryStopEntitiesProvider,
  ItineraryStopEntity,
  useReportItineraryStopEntity,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useEffect } from "react"

const entity: ItineraryStopEntity = {
  stopId: "stop-1",
  id: "show-node-id",
  internalID: "show-internal-id",
  isFollowed: false,
  type: "SHOW",
}

const saveableStop: ItineraryStop = {
  id: "stop-1",
  title: "Museum",
  displayTime: "11am-4pm",
  imageUrl: "https://example.com/image.jpg",
  coordinates: { lat: 51.5194, lng: -0.127 },
  saveTarget: { type: "SHOW", slug: "museum-show" },
}

/** Reports `entity` into the provider on mount, standing in for a resolver. */
const Reporter: React.FC = () => {
  const { report } = useReportItineraryStopEntity()

  useEffect(() => {
    report(entity)
  }, [report])

  return null
}

describe("ItineraryStopSaveControl", () => {
  it("renders nothing before the provider has an entity for this stop", () => {
    renderWithWrappers(
      <ItineraryStopEntitiesProvider stops={[saveableStop]}>
        <ItineraryStopSaveControl stopId="stop-1" stopTitle="Museum" />
      </ItineraryStopEntitiesProvider>
    )

    expect(screen.queryByTestId("city-guide-save-button")).toBeNull()
  })

  it("renders the save button once the provider reports an entity for this stop", () => {
    renderWithWrappers(
      <ItineraryStopEntitiesProvider stops={[saveableStop]}>
        <Reporter />
        <ItineraryStopSaveControl stopId="stop-1" stopTitle="Museum" />
      </ItineraryStopEntitiesProvider>
    )

    expect(screen.getByTestId("city-guide-save-button")).toBeTruthy()
  })
})
