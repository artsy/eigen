import { SalesRecommendedAuctionLotsQueryRenderer } from "app/Scenes/Sales/Components/SalesRecommendedAuctionLots"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SalesRecommendedAuctionLots", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SalesRecommendedAuctionLotsQueryRenderer />,
  })

  it("renders without throwing errors", () => {
    expect(() => {
      renderWithRelay()
    }).not.toThrow()
  })
})
