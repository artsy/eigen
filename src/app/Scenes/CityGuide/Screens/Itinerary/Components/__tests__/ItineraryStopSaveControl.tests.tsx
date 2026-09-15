import { screen } from "@testing-library/react-native"
import { ItineraryStopSaveControl } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSaveControl"
import {
  ItineraryStopEntitiesProvider,
  ItineraryStopEntity,
  useReportItineraryStopEntity,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useEffect } from "react"

const entity: ItineraryStopEntity = {
  stopId: "stop-1",
  id: "show-node-id",
  internalID: "show-internal-id",
  isFollowed: false,
  type: "SHOW",
}

const saveableStop = makeItineraryStop({
  internalID: "stop-1",
  title: "Museum",
  startTime: "11am",
  endTime: "4pm",
  latitude: 51.5194,
  longitude: -0.127,
  item: {
    __typename: "Show",
    slug: "museum-show",
    name: "Museum",
    href: "/show/museum-show",
    isFreeAdmission: null,
    coverImage: null,
    partner: null,
    location: null,
  },
})

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

  it("renders the save control once an entity is reported", () => {
    renderWithWrappers(
      <ItineraryStopEntitiesProvider stops={[saveableStop]}>
        <Reporter />
        <ItineraryStopSaveControl stopId="stop-1" stopTitle="Museum" />
      </ItineraryStopEntitiesProvider>
    )

    expect(screen.getByTestId("city-guide-save-button")).toBeTruthy()
  })
})
