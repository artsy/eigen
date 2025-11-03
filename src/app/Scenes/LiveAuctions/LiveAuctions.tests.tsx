import { act, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { LiveAuctionsScreen } from "app/Scenes/LiveAuctions/LiveAuctions"
import { CurrentlyRunningAuctions } from "app/Scenes/Sales/CurrentlyRunningAuctions"
import { UpcomingAuctions } from "app/Scenes/Sales/UpcomingAuctions"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("LiveAuctions", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <LiveAuctionsScreen />,
  })

  const upcomingAuctionsRefreshMock = jest.fn()
  const currentAuctionsRefreshMock = jest.fn()

  it("renders without Errors", async () => {
    renderWithRelay()

    await waitForElementToBeRemoved(() => screen.queryByTestId("LiveAuctionsPlaceholder"))

    expect(screen.getByTestId("Live-Auctions-Screen-ScrollView")).toBeOnTheScreen()
  })

  it("Can refresh current and upcoming auctions", async () => {
    renderWithRelay()

    await waitForElementToBeRemoved(() => screen.queryByTestId("LiveAuctionsPlaceholder"))

    const CurrentAuction = screen.UNSAFE_getAllByType(CurrentlyRunningAuctions)[0]
    const UpcomingAuction = screen.UNSAFE_getAllByType(UpcomingAuctions)[0]

    const ScrollView = screen.getByTestId("Live-Auctions-Screen-ScrollView")

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
