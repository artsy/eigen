import { SalesActiveBidsQueryRenderer } from "app/Scenes/Sales/Components/SalesActiveBids"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SalesActiveBids", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => <SalesActiveBidsQueryRenderer />,
  })

  it("renders without throwing errors", () => {
    expect(() => {
      renderWithRelay()
    }).not.toThrow()
  })
})
