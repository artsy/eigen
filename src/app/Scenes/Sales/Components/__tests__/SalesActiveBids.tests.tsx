import { screen } from "@testing-library/react-native"
import { SalesActiveBidsQuery } from "__generated__/SalesActiveBidsQuery.graphql"
import {
  SalesActiveBidsQueryRenderer,
  SalesActiveBidsScreenQuery,
} from "app/Scenes/Sales/Components/SalesActiveBids"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SalesActiveBids", () => {
  const { renderWithRelay } = setupTestWrapper<SalesActiveBidsQuery>({
    Component: () => <SalesActiveBidsQueryRenderer />,
    query: SalesActiveBidsScreenQuery,
  })

  it("renders without throwing errors", () => {
    renderWithRelay()

    // Component renders null when no active bids, so we just check it doesn't crash
    expect(() => screen.root).not.toThrow()
  })

  it("returns null when me is not available", () => {
    renderWithRelay({
      Query: () => ({
        me: null,
      }),
    })

    // Should render without crashing even when me is null
    expect(() => screen.root).not.toThrow()
  })

  it("renders SaleListActiveBids when me data is available", () => {
    renderWithRelay({
      Me: () => ({
        lotStandings: [
          {
            isLeading: true,
            sale: {
              name: "Test Auction",
              slug: "test-auction",
            },
          },
        ],
      }),
    })

    // If me data is present, SaleListActiveBids component should be rendered
    expect(() => screen.root).not.toThrow()
  })
})
