import { screen } from "@testing-library/react-native"
import { AuctionResultsForArtistsYouCollect } from "app/Scenes/MyCollection/Screens/Insights/AuctionResultsForArtistsYouCollect"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("AuctionResultsForArtistsYouCollect", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props) => <AuctionResultsForArtistsYouCollect {...props} />,
  })

  it("renders auction results", async () => {
    renderWithRelay({
      Me: () => ({
        myCollectionAuctionResults: {
          edges: [
            {
              node: {
                internalID: "auction-result-id",
                artistID: "artist-id",
                artistName: "Artist Name",
                title: "Artwork Title",
                dateText: "2020",
                mediumText: "Oil on canvas",
              },
            },
          ],
        },
      }),
    })

    expect(await screen.findByTestId("Results_Section_List")).toBeTruthy()
  })
})
