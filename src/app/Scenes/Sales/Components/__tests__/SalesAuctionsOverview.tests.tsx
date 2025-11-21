import { SalesAuctionsOverviewQueryRenderer } from "app/Scenes/Sales/Components/SalesAuctionsOverview"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SalesAuctions", () => {
  const mockSetCurrentSalesCount = jest.fn()
  const mockSetUpcomingSalesCount = jest.fn()

  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <SalesAuctionsOverviewQueryRenderer
        setCurrentSalesCountOnParent={mockSetCurrentSalesCount}
        setUpcomingSalesCountOnParent={mockSetUpcomingSalesCount}
      />
    ),
  })

  it("renders without throwing errors", () => {
    expect(() => {
      renderWithRelay()
    }).not.toThrow()
  })
})
