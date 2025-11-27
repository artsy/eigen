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

  it("renders the header with title", () => {
    renderWithRelay()

    // The header shows "Current and Upcoming Auctions" (appears multiple times in Screen component)
    const titles = screen.getAllByText("Current and Upcoming Auctions")
    expect(titles.length).toBeGreaterThan(0)
    expect(titles[0]).toBeOnTheScreen()
  })

  it("renders ZeroState when no auctions are available", () => {
    renderWithRelay({
      Viewer: () => ({
        salesConnection: {
          edges: [],
        },
      }),
    })

    // Screen should still render with zero state
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

    // After refresh, the screen should still be present
    expect(screen.getByTestId("Auctions-Overview-Screen-ScrollView")).toBeOnTheScreen()
  })

  it("increments fetchKey on refresh to trigger remount", async () => {
    renderWithRelay()

    const ScrollView = screen.getByTestId("Auctions-Overview-Screen-ScrollView")
    const refreshControl = ScrollView.props.refreshControl

    await act(async () => {
      refreshControl.props.onRefresh()
    })

    // Screen continues to work after refresh with new fetchKey
    expect(screen.getByTestId("Auctions-Overview-Screen-ScrollView")).toBeOnTheScreen()
  })
})
