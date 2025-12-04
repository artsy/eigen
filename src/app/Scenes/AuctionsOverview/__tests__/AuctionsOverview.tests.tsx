import { screen } from "@testing-library/react-native"
import { AuctionsOverviewScreen } from "app/Scenes/AuctionsOverview/AuctionsOverview"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("AuctionsOverview", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <AuctionsOverviewScreen />,
  })

  it("renders without errors", () => {
    renderWithRelay()

    expect(screen.getByTestId("Auctions-Overview-Screen-ScrollView")).toBeOnTheScreen()

    // The header shows "Current and Upcoming Auctions" (appears 2 times in Screen component)
    const titles = screen.getAllByText("Current and Upcoming Auctions")
    expect(titles.length).toBe(2)
  })
})
