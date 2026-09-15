import { act, fireEvent, screen } from "@testing-library/react-native"
import { ItineraryStopEntityResolvers } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopEntityResolvers"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { ItineraryStopEntitiesProvider } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
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
// saveable item below still issue no query at all and keep using bare `renderWithWrappers`.

const savedStop = makeItineraryStop({
  internalID: "stop-2",
  title: "Museum",
  address: "Trafalgar Square, WC2N 5DN",
  category: "MUSEUM",
  note: "🥂 🧀",
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
    partner: { name: "Trafalgar Square, WC2N 5DN" },
    location: null,
  },
})

const unsaveableStop = makeItineraryStop({
  internalID: "stop-1",
  title: "Coffee at London Cafe",
  startTime: "10am",
  endTime: null,
  image: { url: "https://example.com/cafe.jpg" },
  latitude: 51.5136,
  longitude: -0.1365,
  item: null,
})

interface RowProps {
  stop: ItineraryStop
  number: number
  citySlug: string
  itineraryId: string
  cityName: string
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
      {
        stop: savedStop,
        number: 2,
        citySlug: "london-united-kingdom",
        itineraryId: "guide-1",
        cityName: "London",
      }
    )

    expect(await screen.findByText("Museum")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
    expect(screen.getByText("11am-4pm")).toBeTruthy()
    expect(screen.getByText("🏛 Trafalgar Square, WC2N 5DN")).toBeTruthy()
  })

  it("hides the image section when the stop has no image", () => {
    renderWithWrappers(
      <ItineraryStopRow
        stop={makeItineraryStop({ ...unsaveableStop, image: null })}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
    expect(screen.queryByTestId("itinerary-stop-image")).toBeNull()
  })

  it("leaves the note off the row", async () => {
    renderRow(
      { Show: () => ({ isFollowed: false }) },
      {
        stop: savedStop,
        number: 2,
        citySlug: "london-united-kingdom",
        itineraryId: "guide-1",
        cityName: "London",
      }
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

    const withItem = (item: ItineraryStop["item"]) =>
      makeItineraryStop({
        ...unsaveableStop,
        title: "",
        item,
      })

    // The row layout has to live on an element inside the link, not on the link: RouterLink
    // renders palette's Touchable, which wraps multiple children in an unstyled Flex
    // (Touchable.js:42) and leaves the image and text with no width to share. RNTL does no
    // layout, so this asserts where the layout is declared.
    it("declares the row layout inside the link", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={withItem({
            __typename: "Show",
            name: "A show",
            href: "/show/a-show",
            slug: "a-show",
            isFreeAdmission: null,
            coverImage: null,
            partner: null,
            location: null,
          })}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      expect(screen.getByTestId("itinerary-stop-row-content")).toHaveStyle({
        flexDirection: "row",
      })
    })

    it("navigates to a show", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={withItem({
            __typename: "Show",
            name: "Georg Baselitz: Back Again",
            href: "/show/white-cube-georg-baselitz-back-again",
            slug: "white-cube-georg-baselitz-back-again",
            isFreeAdmission: null,
            coverImage: null,
            partner: null,
            location: null,
          })}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      fireEvent.press(screen.getByTestId("itinerary-stop-row"))

      expect(navigate).toHaveBeenCalledWith("/show/white-cube-georg-baselitz-back-again")
    })

    // A gallery stop points at a Location, and the partner behind it is what has a page.
    it("navigates to the gallery behind a location", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={withItem({
            __typename: "Location",
            name: "Bermondsey",
            city: null,
            address: null,
            coordinates: null,
            partner: {
              name: "White Cube",
              href: "/partner/white-cube",
              slug: "white-cube",
              profile: null,
            },
          })}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      fireEvent.press(screen.getByTestId("itinerary-stop-row"))

      expect(navigate).toHaveBeenCalledWith("/partner/white-cube")
    })

    // A custom stop has no entity page, so it gets its own screen, addressed by the itinerary
    // it belongs to — Metaphysics has no root lookup for a single stop.
    it("goes to a custom stop's own screen", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={unsaveableStop}
          number={1}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      fireEvent.press(screen.getByTestId("itinerary-stop-row"))

      expect(navigate).toHaveBeenCalledWith(
        "/city-guide/london-united-kingdom/itinerary/guide-1/stop/stop-1"
      )
    })

    // The source link leaves Artsy, so the screen offers it rather than the row following it.
    it("does not follow a custom stop's source link", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={makeItineraryStop({
            ...unsaveableStop,
            sourceURL: "https://timeout.com/london-cafe",
          })}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      fireEvent.press(screen.getByTestId("itinerary-stop-row"))

      expect(navigate).not.toHaveBeenCalledWith("https://timeout.com/london-cafe")
    })
  })

  // No saveable item means no query, so these two must not go through the entities/resolvers stack.
  it("omits the note when the stop has none", () => {
    renderWithWrappers(
      <ItineraryStopRow
        stop={unsaveableStop}
        number={1}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.queryByText("🥂 🧀")).toBeNull()
  })

  // A custom stop has no entity to resolve, so its plus renders straight away rather than
  // waiting on a lookup the way an Artsy stop's control does.
  it("shows the plus on a custom stop without waiting on a lookup", () => {
    renderWithWrappers(
      <ItineraryStopRow
        stop={unsaveableStop}
        number={1}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.getByTestId("custom-stop-save-button")).toBeOnTheScreen()
    expect(screen.getByTestId("follow-icon-button-add")).toBeOnTheScreen()
  })

  it("renders no entity save control when the stop has no save target", () => {
    renderWithWrappers(
      <ItineraryStopRow
        stop={unsaveableStop}
        number={1}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.queryByTestId("city-guide-save-button")).toBeNull()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
  })

  it("reflects the resolved followed state", async () => {
    renderRow(
      { Show: () => ({ isFollowed: true }) },
      {
        stop: savedStop,
        number: 2,
        citySlug: "london-united-kingdom",
        itineraryId: "guide-1",
        cityName: "London",
      }
    )

    expect(await screen.findByTestId("city-guide-save-button-check-icon")).toBeTruthy()
  })

  // The designs give the card three lines and separate hours from admission with a dot.
  it("renders the three card lines for a show, with a dot between hours and admission", () => {
    renderWithWrappers(
      <ItineraryStopRow
        stop={makeItineraryStop({
          ...unsaveableStop,
          title: "",
          startTime: "10am",
          endTime: "6pm",
          item: {
            __typename: "Show",
            name: "Georg Baselitz: Back Again",
            href: "/show/white-cube-georg-baselitz-back-again",
            slug: "white-cube-georg-baselitz-back-again",
            isFreeAdmission: false,
            coverImage: null,
            partner: { name: "White Cube" },
            location: null,
          },
        })}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
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
        stop={makeItineraryStop({
          ...unsaveableStop,
          startTime: "10am",
          endTime: "6pm",
          item: null,
        })}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.getByText("10am-6pm")).toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-stop-meta-dot")).not.toBeOnTheScreen()
  })
})
