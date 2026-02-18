import { screen } from "@testing-library/react-native"
import { SalesAuctionsOverviewQuery } from "__generated__/SalesAuctionsOverviewQuery.graphql"
import {
  SalesAuctionsOverviewQueryRenderer,
  SalesAuctionsOverviewScreenQuery,
} from "app/Scenes/Sales/Components/SalesAuctionsOverview"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SalesAuctionsOverview", () => {
  const { renderWithRelay } = setupTestWrapper<SalesAuctionsOverviewQuery>({
    Component: () => <SalesAuctionsOverviewQueryRenderer />,
    query: SalesAuctionsOverviewScreenQuery,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders both CurrentlyRunningAuctions and UpcomingAuctions components", () => {
    renderWithRelay({
      Viewer: () => ({
        sales: {
          edges: [
            {
              node: {
                name: "Test Auction",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Current Live Auctions")).toBeOnTheScreen()
    expect(screen.getByText("Upcoming Auctions")).toBeOnTheScreen()
  })

  it("renders nothing when no auctions", () => {
    renderWithRelay({
      Viewer: () => ({
        sales: {
          edges: [],
        },
      }),
    })

    expect(screen.queryByText("Current Live Auctions")).not.toBeOnTheScreen()
    expect(screen.queryByText("Upcoming Auctions")).not.toBeOnTheScreen()
  })
})
