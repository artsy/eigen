import { fireEvent, screen } from "@testing-library/react-native"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import { ItinerarySection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { PanGesture } from "react-native-gesture-handler"
import { fireGestureHandler, getByGestureTestId } from "react-native-gesture-handler/jest-utils"

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

describe("ItinerarySectionRow", () => {
  it("renders the title and its stops expanded by default", () => {
    renderWithWrappers(
      <ItinerarySectionRow
        section={section}
        sectionIndex={0}
        startNumber={1}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
    expect(screen.getByText("Coffee at London Cafe")).toBeTruthy()
    expect(screen.getByText("Museum")).toBeTruthy()
  })

  it("numbers stops from startNumber", () => {
    renderWithWrappers(
      <ItinerarySectionRow
        section={section}
        sectionIndex={0}
        startNumber={4}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("5")).toBeTruthy()
  })

  it("hides the stops when the header is tapped", () => {
    renderWithWrappers(
      <ItinerarySectionRow
        section={section}
        sectionIndex={0}
        startNumber={1}
        citySlug="london-united-kingdom"
        itineraryId="guide-1"
        cityName="London"
      />
    )

    fireEvent.press(screen.getByTestId("itinerary-section-header"))

    expect(screen.queryByText("Coffee at London Cafe")).toBeNull()
    expect(screen.getByText("Day 1 — Easing in")).toBeTruthy()
  })

  describe("swipe to delete", () => {
    it("offers no swipe gesture by default", () => {
      renderWithWrappers(
        <ItinerarySectionRow
          section={section}
          sectionIndex={0}
          startNumber={1}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      expect(screen.queryByTestId("delete-button-stop-1")).toBeNull()
    })

    it("wraps every stop with a swipe row once canDelete is true", () => {
      renderWithWrappers(
        <ItinerarySectionRow
          section={section}
          sectionIndex={0}
          startNumber={1}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
          canDelete
        />
      )

      // The delete panel sits behind the row, off-screen until swiped, but RNTL renders both.
      expect(screen.getByTestId("delete-button-stop-1")).toBeTruthy()
      expect(screen.getByTestId("delete-button-stop-2")).toBeTruthy()
    })
  })

  describe("hold-and-drag to reorder", () => {
    it("does not bind a drag gesture by default", () => {
      renderWithWrappers(
        <ItinerarySectionRow
          section={section}
          sectionIndex={0}
          startNumber={1}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
        />
      )

      expect(() => getByGestureTestId("drag-itinerary-stop-stop-1")).toThrow()
    })

    it("calls onReorderStop with the section, the dragged stop, and both indices once the drag crosses into a neighbour", () => {
      const onReorderStop = jest.fn()

      renderWithWrappers(
        <ItinerarySectionRow
          section={section}
          sectionIndex={0}
          startNumber={1}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
          canReorder
          onReorderStop={onReorderStop}
        />
      )

      // Rows measure 0 in RNTL (no real layout pass), so the section's row gap alone decides
      // the threshold — any downward drag past half of it crosses into the next stop.
      fireGestureHandler<PanGesture>(getByGestureTestId("drag-itinerary-stop-stop-1"), [
        { translationY: 0 },
        { translationY: 20 },
      ])

      expect(onReorderStop).toHaveBeenCalledWith("day-1", "stop-1", 0, 1)
    })

    it("does not call onReorderStop when the drag ends back where it started", () => {
      const onReorderStop = jest.fn()

      renderWithWrappers(
        <ItinerarySectionRow
          section={section}
          sectionIndex={0}
          startNumber={1}
          citySlug="london-united-kingdom"
          itineraryId="guide-1"
          cityName="London"
          canReorder
          onReorderStop={onReorderStop}
        />
      )

      fireGestureHandler<PanGesture>(getByGestureTestId("drag-itinerary-stop-stop-1"), [
        { translationY: 0 },
      ])

      expect(onReorderStop).not.toHaveBeenCalled()
    })
  })
})
