import { screen } from "@testing-library/react-native"
import { MyCollectionArtworkInsightsTestsQuery } from "__generated__/MyCollectionArtworkInsightsTestsQuery.graphql"
import { MyCollectionArtworkInsights } from "app/Scenes/MyCollection/Screens/Artwork/MyCollectionArtworkInsights"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("MyCollectionArtworkInsights", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionArtworkInsightsTestsQuery>({
    Component: (props) => {
      if (!props?.artwork) {
        return null
      }
      return <MyCollectionArtworkInsights artwork={props?.artwork} />
    },
    query: graphql`
      query MyCollectionArtworkInsightsTestsQuery @relay_test_operation {
        artwork(id: "some-artwork-id") {
          ...MyCollectionArtworkInsights_artwork
        }
      }
    `,
  })

  it("renders without throwing an error", async () => {
    renderWithRelay({
      Query: () => ({
        artwork: mockArtwork,
        marketPriceInsights: mockMarketPriceInsights,
      }),
    })

    // Artwork Artist Market

    expect(screen.getByText("Artist Market")).toBeTruthy()
    expect(screen.getByText("Based on the last 36 months of auction data")).toBeTruthy()
    expect(screen.getByText("Annual Value Sold")).toBeTruthy()
    expect(screen.getByText("$1k")).toBeTruthy()
    expect(screen.getByText("Annual Lots Sold")).toBeTruthy()
    expect(screen.getByText("100")).toBeTruthy()
    expect(screen.getByText("Sell-through Rate")).toBeTruthy()
    expect(screen.getByText("20%")).toBeTruthy()
    expect(screen.getByText("Price Over Estimate")).toBeTruthy()
    expect(screen.getByText("200%")).toBeTruthy()
    expect(screen.getByText("Liquidity")).toBeTruthy()
    expect(screen.getByText("High")).toBeTruthy()

    // Artwork Comparable Works

    expect(screen.getByText("Comparable Works")).toBeTruthy()
  })
})

const mockMarketPriceInsights = {
  sellThroughRate: 0.2,
  annualLotsSold: 100,
  annualValueSoldDisplayText: "$1k",
  medianSaleOverEstimatePercentage: "200",
  liquidityRankDisplayText: "High",
}

const mockArtwork = {
  internalID: "some-artwork-id",
  slug: "some-artwork-slug",
  comparableAuctionResults: {
    edges: [
      {
        cursor: "YXJyYXljb25uZWN0aW9uOjA=",
        node: {
          id: "QXVjdGlvblJlc3VsdDozMzM5NTI=",
          artistID: "4d8b92bb4eb68a1b2c000452",
          artist: {
            name: "Takashi Murakami",
            targetSupply: {
              isTargetSupply: false,
            },
          },
          internalID: "333952",
          title: "A Comparable Auction Result",
          currency: "HKD",
          dateText: "2015",
          mediumText: "acrylic on canvas mounted on aluminum frame",
          saleDate: "2021-06-01T03:00:00+03:00",
          organization: "Phillips",
          boughtIn: false,
          priceRealized: {
            cents: 315000000,
            display: "HK$3,150,000",
            displayUSD: "$30,000",
          },
          performance: {
            mid: "70%",
          },
          images: {
            thumbnail: {
              url: "https://d2v80f5yrouhh2.cloudfront.net/OTJxNHuhGDnPi8wQcvXvxA/thumbnail.jpg",
            },
          },
        },
      },
    ],
  },
  marketPriceInsights: mockMarketPriceInsights,
}
