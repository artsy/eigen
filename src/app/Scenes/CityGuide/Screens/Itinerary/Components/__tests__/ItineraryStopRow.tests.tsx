import { fireEvent, screen } from "@testing-library/react-native"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// The row fires no query: a stop already knows what it points at, so its plus needs no
// lookup. It does need an AddToItineraryProvider above it, or it renders no plus at all.

const savedStop: ItineraryStop = {
  id: "stop-2",
  title: "Museum",
  address: "Trafalgar Square, WC2N 5DN",
  category: "MUSEUM",
  displayTime: "11am-4pm",
  note: "🥂 🧀",
  imageUrl: "https://example.com/image.jpg",
  coordinates: { lat: 51.5194, lng: -0.127 },
  saveTarget: { itemType: "SHOW", itemID: "show-1" },
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
  it("renders the number, title, time and address", async () => {
    renderRow({
      stop: savedStop,
      number: 2,
      citySlug: "london-united-kingdom",
      itineraryId: "guide-1",
      cityName: "London",
    })

    expect(await screen.findByText("Museum")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
    expect(screen.getByText("11am-4pm")).toBeTruthy()
    expect(screen.getByText("Trafalgar Square, WC2N 5DN")).toBeTruthy()
  })

  it("leaves the note off the row", async () => {
    renderRow({
      stop: savedStop,
      number: 2,
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
            partner: { name: "White Cube", href: "/partner/white-cube" },
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
          stop={{ ...unsaveableStop, sourceURL: "https://timeout.com/london-cafe" }}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      fireEvent.press(screen.getByTestId("itinerary-stop-row"))

      expect(navigate).not.toHaveBeenCalledWith("https://timeout.com/london-cafe")
    })
  })

  // No saveTarget means no query, so these two must not go through the entities/resolvers stack.
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

  // The plus has no saved state now: which itineraries hold the entity is the sheet's business.
  it("shows a plus on an entity-backed stop", () => {
    renderRow({
      stop: savedStop,
      number: 2,
      citySlug: "london-united-kingdom",
      itineraryId: "guide-1",
      cityName: "London",
    })

    expect(screen.getByTestId("city-guide-save-button-add-icon")).toBeTruthy()
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
        stop={{ ...unsaveableStop, displayTime: "10am-6pm", cardItem: undefined }}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.getByText("10am-6pm")).toBeOnTheScreen()
    expect(screen.queryByTestId("itinerary-stop-meta-dot")).not.toBeOnTheScreen()
  })
})
