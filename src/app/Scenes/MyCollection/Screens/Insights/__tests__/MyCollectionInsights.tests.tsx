import { screen } from "@testing-library/react-native"
import { MyCollectionInsightsQuery } from "__generated__/MyCollectionInsightsQuery.graphql"
import { MyCollectionInsightsQR } from "app/Scenes/MyCollection/Screens/Insights/MyCollectionInsights"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("MyCollectionInsights", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionInsightsQuery>({
    Component: MyCollectionInsightsQR,
    query: graphql`
      query MyCollectionInsights_Test_Query @relay_test_operation {
        me {
          ...AuctionResultsForArtistsYouCollectRail_me
          ...MedianAuctionPriceRail_me
          ...CareerHighlightsRail_me
          auctionResults: myCollectionAuctionResults(first: 3) {
            totalCount
          }
          myCollectionInfo {
            artworksCount
            ...MyCollectionInsightsOverview_myCollectionInfo
          }
          myCollectionConnection(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `,
  })

  describe("when the step 1 of phase 1 feature flag is enabled ", () => {
    it("shows insights overview", async () => {
      renderWithRelay({
        Me: () => ({
          myCollectionConnection: myCollectionConnectionMock,
          myCollectionAuctionResults: myCollectionAuctionResultsMock,
          myCollectionInfo: myCollectionInfoMock,
        }),
      })

      expect(await screen.findByText("Total Artworks")).toBeTruthy()
      expect(screen.getByText("24")).toBeTruthy()
      expect(screen.getByText("Total Artists")).toBeTruthy()
      expect(screen.getByText("13")).toBeTruthy()
    })
  })

  it("shows empty state when the user has no artworks in their collection", async () => {
    renderWithRelay({
      Me: () => ({
        myCollectionConnection: { edges: [] },
        myCollectionAuctionResults: myCollectionAuctionResultsMock,
        myCollectionInfo: myCollectionInfoMock,
      }),
    })

    expect(await screen.findByText("Gain deeper knowledge of your collection")).toBeTruthy()
  })
})

const myCollectionConnectionMock = {
  edges: [
    {
      node: {
        id: "random-id",
      },
    },
  ],
}

const myCollectionAuctionResultsMock = {
  totalCount: 1,
  edges: [
    {
      node: {
        id: "random-id",
      },
    },
  ],
}

const myCollectionInfoMock = {
  artworksCount: 24,
  artistsCount: 13,
}
