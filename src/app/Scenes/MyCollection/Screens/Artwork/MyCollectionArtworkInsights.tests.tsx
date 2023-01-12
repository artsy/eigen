import { MyCollectionArtworkInsightsTestsQuery } from "__generated__/MyCollectionArtworkInsightsTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkInsights } from "./MyCollectionArtworkInsights"

jest.unmock("react-relay")

describe("MyCollectionArtworkInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkInsightsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkInsightsTestsQuery @relay_test_operation {
          artwork(id: "some-artwork-id") {
            ...MyCollectionArtworkInsights_artwork
          }

          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...MyCollectionArtworkInsights_marketPriceInsights
          }
          me {
            ...MyCollectionArtworkInsights_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (!props?.artwork || !props?.marketPriceInsights) {
          return null
        }
        return (
          <StickyTabPage
            tabs={[
              {
                title: "test",
                content: (
                  <MyCollectionArtworkInsights
                    me={props.me}
                    marketPriceInsights={props.marketPriceInsights}
                    artwork={props?.artwork}
                  />
                ),
              },
            ]}
          />
        )
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders without throwing an error", async () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Query: () => ({
        artwork: mockArtwork,
        marketPriceInsights: mockMarketPriceInsights,
      }),
    })

    // Artwork Artist Market

    expect(await getByText("Artist Market")).toBeTruthy()
    expect(await getByText("Based on the last 36 months of auction data")).toBeTruthy()
    expect(await getByText("Annual Value Sold")).toBeTruthy()
    expect(await getByText("$1k")).toBeTruthy()
    expect(await getByText("Annual Lots Sold")).toBeTruthy()
    expect(await getByText("100")).toBeTruthy()
    expect(await getByText("Sell-through Rate")).toBeTruthy()
    expect(await getByText("20%")).toBeTruthy()
    expect(await getByText("Price Over Estimate")).toBeTruthy()
    expect(await getByText("200%")).toBeTruthy()
    expect(await getByText("Liquidity")).toBeTruthy()
    expect(await getByText("High")).toBeTruthy()

    // Artwork Comparable Works

    expect(await getByText("Comparable Works")).toBeTruthy()
  })

  describe("Conditional Display of RequestForPriceEstimateBanner", () => {
    it("does not display RequestForPriceEstimateBanner when Artist is not P1", () => {
      const { queryByTestId } = renderWithWrappers(<TestRenderer />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Query: () => ({
          artwork: mockArtwork,
          marketPriceInsights: mockMarketPriceInsightsForHighDemandIndex,
        }),
      })
      expect(queryByTestId("request-price-estimate-button")).toBeNull()
    })

    it("does not display when artwork is submitted", () => {
      const { queryByTestId } = renderWithWrappers(<TestRenderer />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Query: () => ({
          artwork: {
            ...mockArtworkForP1Artist,
            consignmentsSubmission: { displayText: "Consignment" },
          },
          marketPriceInsights: mockMarketPriceInsightsForHighDemandIndex,
        }),
      })

      expect(queryByTestId("request-price-estimate-button")).toBeNull()
    })
  })

  describe("display of Submit for Sale section", () => {
    it("renders Submit for Sale section if P1 artist and artwork was not submitted to sale", () => {
      const { getByText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Query: () => ({
          artwork: {
            artist: {
              targetSupply: {
                isP1: true,
              },
            },
            submissionId: null,
          },
        }),
      })
      expect(getByText("Interested in Selling This Work?")).toBeTruthy()
    })

    it("does not render Submit for Sale section if not P1 artist", () => {
      const { getByText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Query: () => ({
          artwork: {
            artist: {
              targetSupply: {
                isP1: false,
              },
            },
          },
        }),
      })

      expect(() => getByText("Interested in Selling This Work?")).toThrow(
        "Unable to find an element with text: Interested in Selling This Work?"
      )
    })
    it("does not render Submit for Sale section if P1 artist and artwork was submited to sale", () => {
      const { getByText } = renderWithWrappers(<TestRenderer />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Query: () => ({
          artwork: {
            artist: {
              targetSupply: {
                isP1: true,
              },
            },
            submissionId: "someId",
          },
        }),
      })

      expect(() => getByText("Interested in Selling This Work?")).toThrow(
        "Unable to find an element with text: Interested in Selling This Work?"
      )
    })
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
              isP1: false,
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

const mockMarketPriceInsightsForHighDemandIndex = {
  ...mockMarketPriceInsights,
  demandRank: 0.95,
}

const mockArtworkForP1Artist = {
  ...mockArtwork,
  ...{
    comparableAuctionResults: {
      edges: [
        {
          ...mockArtwork.comparableAuctionResults.edges[0],
          ...{
            node: {
              ...mockArtwork.comparableAuctionResults.edges[0].node,
              artist: {
                name: "Takashi Murakami",
                targetSupply: {
                  isP1: true,
                },
              },
            },
          },
        },
      ],
    },
  },
}
