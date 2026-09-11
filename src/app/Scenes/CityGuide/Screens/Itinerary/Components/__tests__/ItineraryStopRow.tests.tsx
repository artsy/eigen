import { act, fireEvent, screen } from "@testing-library/react-native"
import { ItineraryStopEntityResolvers } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopEntityResolvers"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { ItineraryStopEntitiesProvider } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"

// The row itself fires no query any more (Task 13): a saveable stop's entity is resolved by
// ItineraryStopEntityResolvers, sitting alongside the row here, and reported into
// ItineraryStopEntitiesProvider, which the row's save control reads from. So these tests build
// that small stack directly rather than using `setupTestWrapper`, whose `renderWithRelay`
// assumes the component under test is the one issuing the query. The two stops with no
// saveTarget below still issue no query at all and keep using bare `renderWithWrappers`.

const savedStop: ItineraryStop = {
  id: "stop-2",
  title: "Museum",
  address: "Trafalgar Square, WC2N 5DN",
  category: "MUSEUM",
  displayTime: "11am-4pm",
  note: "🥂 🧀",
  imageUrl: "https://example.com/image.jpg",
  coordinates: { lat: 51.5194, lng: -0.127 },
  saveTarget: { type: "SHOW", slug: "museum-show" },
}

const unsaveableStop: ItineraryStop = {
  id: "stop-1",
  title: "Coffee at London Cafe",
  displayTime: "10am",
  imageUrl: "https://example.com/cafe.jpg",
  coordinates: { lat: 51.5136, lng: -0.1365 },
  saveTarget: null,
}

interface RowProps {
  stop: ItineraryStop
  number: number
  onPress: (stop: ItineraryStop) => void
}

/**
 * Mounts the row alongside its own entity provider and resolver, seeded with just this one
 * stop, then resolves the single query that stop's resolver fires.
 */
const renderRow = (mockResolvers: MockResolvers, props: RowProps) => {
  const env = createMockEnvironment()

  const view = renderWithWrappers(
    <RelayEnvironmentProvider environment={env}>
      <ItineraryStopEntitiesProvider stops={[props.stop]}>
        <ItineraryStopEntityResolvers stops={[props.stop]} />
        <ItineraryStopRow {...props} />
      </ItineraryStopEntitiesProvider>
    </RelayEnvironmentProvider>
  )

  act(() => {
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )
  })

  return view
}

describe("ItineraryStopRow", () => {
  it("renders the number, title, time and address", async () => {
    renderRow(
      { Show: () => ({ isFollowed: false }) },
      { stop: savedStop, number: 2, onPress: jest.fn() }
    )

    expect(await screen.findByText("Museum")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
    expect(screen.getByText("11am-4pm")).toBeTruthy()
    expect(screen.getByText("Trafalgar Square, WC2N 5DN")).toBeTruthy()
  })

  it("leaves the note to the preview sheet rather than the row", async () => {
    renderRow(
      { Show: () => ({ isFollowed: false }) },
      { stop: savedStop, number: 2, onPress: jest.fn() }
    )

    expect(await screen.findByText("Museum")).toBeTruthy()
    expect(screen.queryByText("🥂 🧀")).toBeNull()
  })

  it("opens the preview when the row is tapped", async () => {
    const onPress = jest.fn()
    renderRow({ Show: () => ({ isFollowed: false }) }, { stop: savedStop, number: 2, onPress })

    fireEvent.press(await screen.findByTestId("itinerary-stop-row"))

    expect(onPress).toHaveBeenCalledWith(savedStop)
  })

  // No saveTarget means no query, so these two must not go through the entities/resolvers stack.
  it("omits the note when the stop has none", () => {
    renderWithWrappers(<ItineraryStopRow stop={unsaveableStop} number={1} onPress={jest.fn()} />)

    expect(screen.queryByText("🥂 🧀")).toBeNull()
  })

  it("renders no save control when the stop has no save target", () => {
    renderWithWrappers(<ItineraryStopRow stop={unsaveableStop} number={1} onPress={jest.fn()} />)

    expect(screen.queryByTestId("city-guide-save-button")).toBeNull()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
  })

  it("reflects the resolved followed state", async () => {
    renderRow(
      { Show: () => ({ isFollowed: true }) },
      { stop: savedStop, number: 2, onPress: jest.fn() }
    )

    expect(await screen.findByTestId("city-guide-save-button-check-icon")).toBeTruthy()
  })

  // The designs give the card three lines and separate hours from admission with a dot.
  it("renders the three card lines for a show, with a dot between hours and admission", () => {
    renderWithWrappers(
      <ItineraryStopRow
        stop={{
          ...unsaveableStop,
          title: "",
          displayTime: "10am-6pm",
          cardItem: {
            __typename: "Show",
            name: "Georg Baselitz: Back Again",
            href: "/show/white-cube-georg-baselitz-back-again",
            isFreeAdmission: false,
            partner: { name: "White Cube" },
          },
        }}
        onPress={jest.fn()}
      />
    )

    expect(screen.getByText("Georg Baselitz: Back Again")).toBeOnTheScreen()
    expect(screen.getByText("White Cube")).toBeOnTheScreen()
    expect(screen.getByText("10am-6pm")).toBeOnTheScreen()
    expect(screen.getByText("Paid Entry")).toBeOnTheScreen()
    expect(screen.getByTestId("itinerary-stop-meta-dot")).toBeOnTheScreen()
  })

  it("shows no dot when there is only one of hours and admission", () => {
    renderWithWrappers(
      <ItineraryStopRow
        stop={{ ...unsaveableStop, displayTime: "10am-6pm", cardItem: undefined }}
        onPress={jest.fn()}
      />
    )

    expect(screen.getByText("10am-6pm")).toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-stop-meta-dot")).not.toBeOnTheScreen()
  })
})
