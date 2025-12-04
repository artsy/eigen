import { fireEvent, screen } from "@testing-library/react-native"
import { SalesRecommendedAuctionLotsQuery } from "__generated__/SalesRecommendedAuctionLotsQuery.graphql"
import {
  SalesRecommendedAuctionLotsQueryRenderer,
  SalesRecommendedAuctionLotsScreenQuery,
} from "app/Scenes/Sales/Components/SalesRecommendedAuctionLots"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
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

    expect(screen.getByText("Your Auction Picks")).toBeOnTheScreen()
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

    const header = screen.getByText("Your Auction Picks")
    expect(header).toBeOnTheScreen()
    fireEvent.press(header)

    expect(navigate).toHaveBeenCalledWith("/auctions/lots-for-you-ending-soon")

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_screen_owner_type: "auctions",
      context_module: "lotsForYouRail",
      destination_screen_owner_type: "lotsForYou",
      type: "header",
    })
  })
})
