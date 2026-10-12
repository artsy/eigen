import { screen } from "@testing-library/react-native"
import { ItineraryStopNote } from "app/Components/ItineraryStopNote/ItineraryStopNote"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("ItineraryStopNote", () => {
  const { renderWithRelay } = setupTestWrapper({ Component: ItineraryStopNote })

  it("shows the stop's note under its heading", async () => {
    renderWithRelay(
      { ItineraryStop: () => ({ note: "Ask for the back room." }) },
      { stopID: "stop-1" }
    )

    expect(await screen.findByText("What to see")).toBeOnTheScreen()
    expect(screen.getByText("Ask for the back room.")).toBeOnTheScreen()
  })

  it("renders nothing when the stop has no note", () => {
    renderWithRelay({ ItineraryStop: () => ({ note: "  " }) }, { stopID: "stop-1" })

    expect(screen.queryByTestId("itinerary-stop-note")).not.toBeOnTheScreen()
  })
})
