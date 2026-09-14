import { act, fireEvent, screen } from "@testing-library/react-native"
import { ItineraryStopEntityResolvers } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopEntityResolvers"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { ItineraryStopEntitiesProvider } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { navigate } from "app/system/navigation/navigate"
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

  it("leaves the note off the row", async () => {
    renderRow(
      { Show: () => ({ isFollowed: false }) },
      { stop: savedStop, number: 2, onPress: jest.fn() }
    )

    expect(await screen.findByText("Museum")).toBeTruthy()
    expect(screen.queryByText("🥂 🧀")).toBeNull()
  })

  // Tapping a stop goes straight to its entity. Only a stop with no entity behind it — a cafe,
  // a landmark — opens its own details instead.
  describe("tapping a stop", () => {
    beforeEach(() => {
      ;(navigate as jest.Mock).mockClear()
    })

    const withItem = (cardItem: ItineraryStop["cardItem"]) => ({
      ...unsaveableStop,
      title: "",
      cardItem,
    })

    // The row layout has to live on an element inside the link, not on the link: RouterLink
    // renders palette's Touchable, which wraps multiple children in an unstyled Flex
    // (Touchable.js:42) and leaves the image and text with no width to share. RNTL does no
    // layout, so this asserts where the layout is declared.
    it("declares the row layout inside the link", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={withItem({ __typename: "Show", name: "A show", href: "/show/a-show" })}
          onPress={jest.fn()}
        />
      )

      expect(screen.getByTestId("itinerary-stop-row-content")).toHaveStyle({
        flexDirection: "row",
      })
    })

    it("navigates to a show", () => {
      const onPress = jest.fn()
      renderWithWrappers(
        <ItineraryStopRow
          stop={withItem({
            __typename: "Show",
            name: "Georg Baselitz: Back Again",
            href: "/show/white-cube-georg-baselitz-back-again",
          })}
          onPress={onPress}
        />
      )

      fireEvent.press(screen.getByTestId("itinerary-stop-row"))

      expect(navigate).toHaveBeenCalledWith("/show/white-cube-georg-baselitz-back-again")
      expect(onPress).not.toHaveBeenCalled()
    })

    // A gallery stop points at a Location, and the partner behind it is what has a page.
    it("navigates to the gallery behind a location", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={withItem({
            __typename: "Location",
            name: "Bermondsey",
            partner: { name: "White Cube", href: "/partner/white-cube" },
          })}
          onPress={jest.fn()}
        />
      )

      fireEvent.press(screen.getByTestId("itinerary-stop-row"))

      expect(navigate).toHaveBeenCalledWith("/partner/white-cube")
    })

    it("opens the details for a custom stop", () => {
      const onPress = jest.fn()
      renderWithWrappers(<ItineraryStopRow stop={unsaveableStop} number={1} onPress={onPress} />)

      fireEvent.press(screen.getByTestId("itinerary-stop-row"))

      expect(onPress).toHaveBeenCalledWith(unsaveableStop)
      expect(navigate).not.toHaveBeenCalled()
    })

    // The source link leaves Artsy, so it is offered inside the details rather than followed.
    it("does not follow a custom stop's source link", () => {
      const onPress = jest.fn()
      renderWithWrappers(
        <ItineraryStopRow
          stop={{ ...unsaveableStop, sourceURL: "https://timeout.com/london-cafe" }}
          onPress={onPress}
        />
      )

      fireEvent.press(screen.getByTestId("itinerary-stop-row"))

      expect(navigate).not.toHaveBeenCalled()
      expect(onPress).toHaveBeenCalled()
    })
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
