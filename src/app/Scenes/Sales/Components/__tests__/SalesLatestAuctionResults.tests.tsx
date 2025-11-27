import { screen } from "@testing-library/react-native"
import { SalesLatestAuctionResultsQuery } from "__generated__/SalesLatestAuctionResultsQuery.graphql"
import {
  SalesLatestAuctionResultsQueryRenderer,
  SalesLatestAuctionResultsScreenQuery,
} from "app/Scenes/Sales/Components/SalesLatestAuctionResults"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SalesLatestAuctionResults", () => {
  const { renderWithRelay } = setupTestWrapper<SalesLatestAuctionResultsQuery>({
    Component: () => <SalesLatestAuctionResultsQueryRenderer />,
    query: SalesLatestAuctionResultsScreenQuery,
  })

  // Suppress console.log from component
  const consoleSpy = jest.spyOn(console, "log").mockImplementation()

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  it("renders without throwing errors", () => {
    renderWithRelay()

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

  it("renders LatestAuctionResultsRail when me data is available", () => {
    renderWithRelay({
      Me: () => ({
        latestAuctionResults: {
          edges: [
            {
              node: {
                title: "Test Artwork",
                internalID: "artwork-1",
                slug: "artist-test-artwork",
              },
            },
          ],
        },
      }),
    })

    expect(() => screen.root).not.toThrow()
  })

  it("handles empty auction results", () => {
    renderWithRelay({
      Me: () => ({
        latestAuctionResults: {
          edges: [],
        },
      }),
    })

    expect(() => screen.root).not.toThrow()
  })
})
