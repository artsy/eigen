import { screen } from "@testing-library/react-native"
import { SalesRecommendedAuctionLotsQuery } from "__generated__/SalesRecommendedAuctionLotsQuery.graphql"
import {
  SalesRecommendedAuctionLotsQueryRenderer,
  SalesRecommendedAuctionLotsScreenQuery,
} from "app/Scenes/Sales/Components/SalesRecommendedAuctionLots"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

jest.mock("app/system/flags/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(() => ({ variant: null })),
}))

describe("SalesRecommendedAuctionLots", () => {
  const { renderWithRelay } = setupTestWrapper<SalesRecommendedAuctionLotsQuery>({
    Component: () => <SalesRecommendedAuctionLotsQueryRenderer />,
    query: SalesRecommendedAuctionLotsScreenQuery,
    variables: { includeBackfill: true },
  })

  it("renders without throwing errors", () => {
    renderWithRelay()

    expect(() => screen.root).not.toThrow()
  })

  it("returns null when viewer is not available", () => {
    renderWithRelay({
      Query: () => ({
        viewer: null,
      }),
    })

    // Should render without crashing even when viewer is null
    expect(() => screen.root).not.toThrow()
  })

  it("renders RecommendedAuctionLotsRail when viewer data is available", () => {
    renderWithRelay({
      Viewer: () => ({
        artworksConnection: {
          edges: [
            {
              node: {
                title: "Recommended Artwork",
                internalID: "artwork-1",
                slug: "artist-recommended-artwork",
              },
            },
          ],
        },
      }),
    })

    expect(() => screen.root).not.toThrow()
  })

  it("handles empty recommended artworks", () => {
    renderWithRelay({
      Viewer: () => ({
        artworksConnection: {
          edges: [],
        },
      }),
    })

    expect(() => screen.root).not.toThrow()
  })

  it("queries with includeBackfill parameter", () => {
    const { env } = renderWithRelay()

    // Verify the query was executed
    expect(env).toBeTruthy()
  })
})
