import { act, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { CurrentlyRunningAuctions } from "./CurrentlyRunningAuctions"
import { SalesScreen } from "./Sales"
import { UpcomingAuctions } from "./UpcomingAuctions"

describe("Sales", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SalesScreen />,
  })

  const upcomingAuctionsRefreshMock = jest.fn()
  const currentAuctionsRefreshMock = jest.fn()

  it("renders without Errors", async () => {
    renderWithRelay()

    await waitForElementToBeRemoved(() => screen.getByTestId("SalePlaceholder"))

    expect(screen.getByTestId("Sales-Screen-ScrollView")).toBeDefined()
  })

  it("renders the ZeroState when there are no sales", async () => {
    renderWithRelay()

    await waitForElementToBeRemoved(() => screen.getByTestId("SalePlaceholder"))

    const CurrentAuction = screen.UNSAFE_getAllByType(CurrentlyRunningAuctions)[0]
    const UpcomingAuction = screen.UNSAFE_getAllByType(UpcomingAuctions)[0]

    act(() => {
      CurrentAuction.props.setSalesCountOnParent(0)
      UpcomingAuction.props.setSalesCountOnParent(0)
    })

    await waitFor(() => expect(screen.getByTestId("Sales-Zero-State-Container")).toBeDefined())
  })

  it("Can refresh current and upcoming auctions", async () => {
    renderWithRelay()

    await waitForElementToBeRemoved(() => screen.getByTestId("SalePlaceholder"))

    const CurrentAuction = screen.UNSAFE_getAllByType(CurrentlyRunningAuctions)[0]
    const UpcomingAuction = screen.UNSAFE_getAllByType(UpcomingAuctions)[0]

    const ScrollView = screen.getByTestId("Sales-Screen-ScrollView")

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
