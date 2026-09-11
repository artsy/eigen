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

// The bug this guards against: `ItineraryStopSaveControl` used to read the entity only from
// `ItineraryStopEntitiesProvider`'s context. That works for a row, but the stop preview renders
// through a `@gorhom/bottom-sheet` modal, which mounts its children into a `@gorhom/portal`
// `PortalHost` elsewhere in the tree. Unlike `ReactDOM.createPortal`, that does not carry React
// context across, so inside the sheet the context read always saw the default (empty) value and
// the Save button silently vanished. A test that mounts the control inside a provider — as every
// test here did before this fix — cannot see that failure mode, since it never goes through a
// portal. This suite covers both paths: the `entity` prop (what the portal case now uses) with
// no provider in the tree at all, and the context path (what a row still uses).
describe("ItineraryStopSaveControl", () => {
  describe("with an entity prop and no provider", () => {
    it("renders the save button", () => {
      renderWithWrappers(
        <ItineraryStopSaveControl stopId="stop-1" stopTitle="Museum" entity={entity} />
      )

      expect(screen.getByTestId("city-guide-save-button")).toBeTruthy()
    })

    it("renders a labelled button when variant is button", () => {
      renderWithWrappers(
        <ItineraryStopSaveControl
          stopId="stop-1"
          stopTitle="Museum"
          variant="button"
          entity={entity}
        />
      )

      expect(screen.getByText("Save")).toBeTruthy()
    })
  })

  describe("with no entity prop, reading from context", () => {
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
})
