import { act, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { AuctionsOverviewScreen } from "app/Scenes/AuctionsOverview/AuctionsOverview"
import { CurrentlyRunningAuctions } from "app/Scenes/Sales/CurrentlyRunningAuctions"
import { UpcomingAuctions } from "app/Scenes/Sales/UpcomingAuctions"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("AuctionsOverview", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <AuctionsOverviewScreen />,
  })

  const upcomingAuctionsRefreshMock = jest.fn()
  const currentAuctionsRefreshMock = jest.fn()

  it("renders without Errors", async () => {
    renderWithRelay()

    await waitForElementToBeRemoved(() => screen.queryByTestId("AuctionsOverviewPlaceholder"))

    expect(screen.getByTestId("Auctions-Overview-Screen-ScrollView")).toBeOnTheScreen()
  })

  it("Can refresh current and upcoming auctions", async () => {
    renderWithRelay()

    await waitForElementToBeRemoved(() => screen.queryByTestId("AuctionsOverviewPlaceholder"))

    const CurrentAuction = screen.UNSAFE_getAllByType(CurrentlyRunningAuctions)[0]
    const UpcomingAuction = screen.UNSAFE_getAllByType(UpcomingAuctions)[0]

    const ScrollView = screen.getByTestId("Auctions-Overview-Screen-ScrollView")

    await act(() => {
      CurrentAuction.props.setRefetchPropOnParent(currentAuctionsRefreshMock)
      UpcomingAuction.props.setRefetchPropOnParent(upcomingAuctionsRefreshMock)
      // pull to refresh
      ScrollView.props.refreshControl.props.onRefresh()
    })

    expect(upcomingAuctionsRefreshMock).toHaveBeenCalledTimes(1)
    expect(currentAuctionsRefreshMock).toHaveBeenCalledTimes(1)
  })
})
