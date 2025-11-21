import { act, screen } from "@testing-library/react-native"
import { AuctionsOverviewScreen } from "app/Scenes/AuctionsOverview/AuctionsOverview"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("AuctionsOverview", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <AuctionsOverviewScreen />,
  })

  it("renders without errors", () => {
    renderWithRelay()

    expect(screen.getByTestId("Auctions-Overview-Screen-ScrollView")).toBeOnTheScreen()
  })

  it("can refresh with pull to refresh", async () => {
    renderWithRelay()

    const ScrollView = screen.getByTestId("Auctions-Overview-Screen-ScrollView")
    const refreshControl = ScrollView.props.refreshControl

    expect(refreshControl.props.refreshing).toBe(false)

    await act(async () => {
      refreshControl.props.onRefresh()
    })

    expect(screen.getByTestId("Auctions-Overview-Screen-ScrollView")).toBeOnTheScreen()
  })
})
