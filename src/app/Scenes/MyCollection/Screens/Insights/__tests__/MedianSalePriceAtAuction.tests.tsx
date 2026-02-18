import { screen, waitFor } from "@testing-library/react-native"
import { MedianSalePriceAtAuction } from "app/Scenes/MyCollection/Screens/Insights/MedianSalePriceAtAuction"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("MedianSalePriceAtAuction", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props) => (
      <MedianSalePriceAtAuction artistID="artist-id" initialCategory="Painting" {...props} />
    ),
  })

  it("renders title", async () => {
    renderWithRelay({
      SelectArtistModal_myCollectionInfo: () => ({
        artist: {
          name: "Test Artist"
        }
      }),
      MedianSalePriceChartDataContextProvider_query: () => ({
        artist: {
          id: "artist-id",
          name: "Test Artist",
          auctionResultConnection: {
            edges: []
          }
        }
      })
    })

    await flushPromiseQueue()

    // Wait for Suspense to resolve and component to fully render
    await waitFor(() => {
      expect(screen.getByTestId("Median_Auction_Price_title")).toBeTruthy()
    })
  })
})
