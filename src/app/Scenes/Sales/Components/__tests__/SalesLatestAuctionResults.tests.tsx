import { SalesLatestAuctionResultsQueryRenderer } from "app/Scenes/Sales/Components/SalesLatestAuctionResults"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SalesLatestAuctionResults", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SalesLatestAuctionResultsQueryRenderer />,
  })

  it("renders without throwing errors", () => {
    expect(() => {
      renderWithRelay()
    }).not.toThrow()
  })
})
