import { act, fireEvent, screen } from "@testing-library/react-native"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import { ItinerarySection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { dropSortableItem, resetSortableListSpy } from "app/utils/tests/draxSortableListSpy"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createRef } from "react"
import { ScrollView } from "react-native"
import { DraxProvider } from "react-native-drax"

jest.mock("react-native-reanimated", () =>
  require("app/utils/tests/draxReanimatedMock").draxReanimatedMock()
)
jest.mock("react-native-drax", () => require("app/utils/tests/draxSortableListSpy").mockDrax())

// Both fixture stops have no item, so no query fires and setupTestWrapper would throw.
// See the harness rule in the ItineraryStopRow test.
const section = {
  internalID: "day-1",
  title: "Day 1 — Easing in",
  stops: [
    makeItineraryStop({
      internalID: "stop-1",
      title: "Coffee at London Cafe",
      startTime: "10am",
      endTime: null,
      image: { url: "https://example.com/a.jpg" },
      latitude: 51.5136,
      longitude: -0.1365,
    }),
    makeItineraryStop({
      internalID: "stop-2",
      title: "Museum",
      startTime: "11am",
      endTime: "4pm",
      image: { url: "https://example.com/b.jpg" },
      latitude: 51.5194,
      longitude: -0.127,
    }),
  ],
} as ItinerarySection

// Drax's sortable items read the provider's context, and the section registers its scroll
// listeners against the screen's scroll view — both stubbed here.
const renderSection = (props: Partial<React.ComponentProps<typeof ItinerarySectionRow>> = {}) =>
  renderWithWrappers(
    <DraxProvider>
      <ItinerarySectionRow
        section={section}
        sectionIndex={0}
        startNumber={1}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
        scrollRef={createRef<ScrollView>()}
        registerScrollHandlers={jest.fn()}
        {...props}
      />
    </DraxProvider>
  )

describe("ItinerarySectionRow", () => {
  beforeEach(() => {
    resetSortableListSpy()
  })

  it("renders the title and its stops expanded by default", () => {
    renderSection()

    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
    expect(screen.getByText("Museum")).toBeTruthy()
  })

  it("numbers stops from startNumber", () => {
    renderSection({ startNumber: 4 })

    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
  })

  it("hides the stops when the header is tapped", () => {
    renderSection()

    fireEvent.press(screen.getByTestId("itinerary-section-header"))

    expect(screen.queryByText("Coffee at London Cafe")).toBeNull()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
  })

  it("renders no header when the title was cleared to an empty string", () => {
    renderSection({ section: { ...section, title: "" } })

    expect(screen.queryByTestId("itinerary-section-header")).toBeNull()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
  })

  it("falls back to a Day N label when the title is null", () => {
    renderSection({ section: { ...section, title: null }, sectionIndex: 2 })

    expect(screen.getByText("Day 3")).toBeTruthy()
  })

  it("registers its scroll listeners with the screen's scroll view", () => {
    const registerScrollHandlers = jest.fn()

    renderSection({ registerScrollHandlers })

    expect(registerScrollHandlers).toHaveBeenCalledWith("day-1", expect.any(Object))
  })

  // Drax reports a drop by index; the screen reorders by stop id. That translation is the
  // only logic this component adds to the drag, so it is what's worth pinning down.
  describe("a dropped stop", () => {
    it("reports the section, the dragged stop's id and both indices", () => {
      const onReorderStop = jest.fn()

      renderSection({ canReorder: true, onReorderStop })

      act(() => dropSortableItem(0, 1, 0))

      expect(onReorderStop).toHaveBeenCalledWith("day-1", "stop-2", 1, 0)
    })

    it("reports nothing when the index names no stop", () => {
      const onReorderStop = jest.fn()

      renderSection({ canReorder: true, onReorderStop })

      act(() => dropSortableItem(0, 7, 0))

      expect(onReorderStop).not.toHaveBeenCalled()
    })
  })
})
