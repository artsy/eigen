import { ActionType, OwnerType } from "@artsy/cohesion"
import { fireEvent, screen } from "@testing-library/react-native"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// The row fires no query: a stop already knows what it points at, so its plus needs no
// lookup. It does need an AddToItineraryProvider above it, or it renders no plus at all.

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
    internalID: "show-1",
    slug: "museum-show",
    name: "Museum",
    href: "/show/museum-show",
    isFreeAdmission: null,
    exhibitionPeriod: null,
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
  citySlug: string
  itineraryId: string
  cityName: string
}

/** Mounts the row under the provider its plus needs. */
const renderRow = (props: RowProps) =>
  renderWithWrappers(
    <AddToItineraryProvider citySlug="london-united-kingdom" cityName="London">
      <ItineraryStopRow {...props} />
    </AddToItineraryProvider>
  )

describe("ItineraryStopRow", () => {
  it("shows a check when the stop is already on one of my itineraries", () => {
    renderRow({
      stop: makeItineraryStop({
        ...savedStop,
        isOnMyItineraries: true,
        myItineraries: [{ internalID: "mine-1" }],
      }),
      citySlug: "london-united-kingdom",
      itineraryId: "guide-1",
      cityName: "London",
    })

    expect(screen.getByTestId("city-guide-save-button-check-icon")).toBeTruthy()
  })

  it("renders the title, time and address", async () => {
    renderRow({
      stop: savedStop,
      citySlug: "london-united-kingdom",
      itineraryId: "guide-1",
      cityName: "London",
    })

    expect(await screen.findByText("Museum")).toBeTruthy()
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
    expect(screen.queryByTestId("stop-card-image")).toBeNull()
  })

  it("leaves the note off the row", async () => {
    renderRow({
      stop: savedStop,
      citySlug: "london-united-kingdom",
      itineraryId: "guide-1",
      cityName: "London",
    })

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

    // The row layout has to live on an element inside the link, not on the link: `StopCard`
    // declares it itself. RNTL does no layout, so this asserts where it's declared.
    it("declares the row layout inside the link", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={withItem({
            __typename: "Show",
            internalID: "a-show-id",
            name: "A show",
            href: "/show/a-show",
            slug: "a-show",
            isFreeAdmission: null,
            exhibitionPeriod: null,
            coverImage: null,
            partner: null,
            location: null,
          })}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      expect(screen.getByTestId("stop-card")).toHaveStyle({
        flexDirection: "row",
      })
    })

    it("navigates to a show", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={withItem({
            __typename: "Show",
            internalID: "white-cube-georg-baselitz-back-again-id",
            name: "Georg Baselitz: Back Again",
            href: "/show/white-cube-georg-baselitz-back-again",
            slug: "white-cube-georg-baselitz-back-again",
            isFreeAdmission: null,
            exhibitionPeriod: null,
            coverImage: null,
            partner: null,
            location: null,
          })}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      fireEvent.press(screen.getByTestId("stop-card-link"))

      expect(navigate).toHaveBeenCalledWith("/show/white-cube-georg-baselitz-back-again")
    })

    // A gallery stop points at a Location, and the partner behind it is what has a page.
    it("navigates to the gallery behind a location", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={withItem({
            __typename: "Location",
            internalID: "bermondsey-id",
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

      fireEvent.press(screen.getByTestId("stop-card-link"))

      expect(navigate).toHaveBeenCalledWith("/partner/white-cube")
    })

    // A custom stop has no entity page, so it gets its own screen, addressed by the itinerary
    // it belongs to — Metaphysics has no root lookup for a single stop.
    it("goes to a custom stop's own screen", () => {
      renderWithWrappers(
        <ItineraryStopRow
          stop={unsaveableStop}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      fireEvent.press(screen.getByTestId("stop-card-link"))

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

      fireEvent.press(screen.getByTestId("stop-card-link"))

      expect(navigate).not.toHaveBeenCalledWith("https://timeout.com/london-cafe")
    })
  })

  // No saveTarget means the plus needs no lookup — a custom stop's own control renders
  // straight away, and an entity-backed stop's plus needs only an AddToItineraryProvider.
  it("omits the note when the stop has none", () => {
    renderWithWrappers(
      <ItineraryStopRow
        stop={unsaveableStop}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.queryByText("🥂 🧀")).toBeNull()
  })

  // A custom stop has no entity to resolve, so its plus renders straight away rather than
  // waiting on a lookup the way an Artsy stop's control does. Its plus opens the same Add to
  // Itinerary sheet as an Artsy stop's, so it still needs the provider mounted above it.
  it("shows the plus on a custom stop without waiting on a lookup", () => {
    renderRow({
      stop: unsaveableStop,
      citySlug: "london-united-kingdom",
      itineraryId: "guide-1",
      cityName: "London",
    })

    expect(screen.getByTestId("custom-stop-save-button")).toBeOnTheScreen()
  })

  it("renders no entity save control when the stop has no save target", () => {
    renderWithWrappers(
      <ItineraryStopRow
        stop={unsaveableStop}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.queryByTestId("city-guide-save-button")).toBeNull()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
  })

  // The plus has no saved state now: which itineraries hold the entity is the sheet's business.
  it("shows a plus on an entity-backed stop", () => {
    renderRow({
      stop: savedStop,
      citySlug: "london-united-kingdom",
      itineraryId: "guide-1",
      cityName: "London",
    })

    expect(screen.getByTestId("city-guide-save-button-add-icon")).toBeTruthy()
  })

  describe("tracking the plus", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("tracks the row's own itinerary as context, with the entity as the destination", () => {
      renderWithWrappers(
        <AddToItineraryProvider citySlug="london-united-kingdom" cityName="London">
          <ItineraryStopRow
            stop={savedStop}
            citySlug="london-united-kingdom"
            itineraryId="guide-1"
            itinerarySlug="guide-one"
            cityName="London"
            isCuratedGuide
          />
        </AddToItineraryProvider>
      )

      fireEvent.press(screen.getByTestId("city-guide-save-button"))

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ActionType.tappedAddToItinerary,
          context_screen_owner_type: OwnerType.cityGuideGuide,
          context_screen_owner_id: "guide-1",
          context_screen_owner_slug: "guide-one",
          destination_screen_owner_type: OwnerType.show,
          destination_screen_owner_id: "show-1",
          destination_screen_owner_slug: "museum-show",
          is_curated_guide: true,
        })
      )
    })

    it("tracks a custom stop with no destination entity", () => {
      renderWithWrappers(
        <AddToItineraryProvider citySlug="london-united-kingdom" cityName="London">
          <ItineraryStopRow
            stop={unsaveableStop}
            citySlug="london-united-kingdom"
            itineraryId="guide-1"
            cityName="London"
          />
        </AddToItineraryProvider>
      )

      fireEvent.press(screen.getByTestId("custom-stop-save-button"))

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ActionType.tappedAddToItinerary,
          context_screen_owner_type: OwnerType.cityGuideGuide,
          context_screen_owner_id: "guide-1",
          is_curated_guide: false,
        })
      )
    })
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
            internalID: "georg-baselitz-back-again-id",
            name: "Georg Baselitz: Back Again",
            href: "/show/white-cube-georg-baselitz-back-again",
            slug: "white-cube-georg-baselitz-back-again",
            isFreeAdmission: false,
            exhibitionPeriod: null,
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
    expect(screen.getByTestId("stop-card-meta-dot")).toBeOnTheScreen()
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
    expect(screen.queryByTestId("stop-card-meta-dot")).not.toBeOnTheScreen()
  })
})
