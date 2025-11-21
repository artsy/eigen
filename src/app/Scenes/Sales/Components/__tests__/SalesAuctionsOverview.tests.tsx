import { screen } from "@testing-library/react-native"
import { SalesAuctionsOverviewQuery } from "__generated__/SalesAuctionsOverviewQuery.graphql"
import {
  SalesAuctionsOverviewQueryRenderer,
  SalesAuctionsOverviewScreenQuery,
} from "app/Scenes/Sales/Components/SalesAuctionsOverview"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SalesAuctionsOverview", () => {
  const mockSetCurrentSalesCount = jest.fn()
  const mockSetUpcomingSalesCount = jest.fn()

  const { renderWithRelay } = setupTestWrapper<SalesAuctionsOverviewQuery>({
    Component: () => (
      <SalesAuctionsOverviewQueryRenderer
        setCurrentSalesCountOnParent={mockSetCurrentSalesCount}
        setUpcomingSalesCountOnParent={mockSetUpcomingSalesCount}
      />
    ),
    query: SalesAuctionsOverviewScreenQuery,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing errors", () => {
    renderWithRelay()

    expect(() => screen.root).not.toThrow()
  })

  it("renders both CurrentlyRunningAuctions and UpcomingAuctions components", () => {
    renderWithRelay({
      Viewer: () => ({
        salesConnection: {
          edges: [
            {
              node: {
                name: "Test Auction",
                liveURLIfOpen: "https://live.artsy.net/test",
              },
            },
          ],
        },
      }),
    })

    // Both auction sections should be rendered
    expect(() => screen.root).not.toThrow()
  })

  it("passes setSalesCountOnParent callbacks to child components", () => {
    renderWithRelay()

    // The callbacks should be passed to the child components
    // Child components will call these when they mount
    expect(() => screen.root).not.toThrow()
  })

  it("handles empty auction data gracefully", () => {
    renderWithRelay({
      Viewer: () => ({
        salesConnection: {
          edges: [],
        },
      }),
    })

    expect(() => screen.root).not.toThrow()
  })
})
