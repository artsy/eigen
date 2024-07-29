import { screen } from "@testing-library/react-native"
import { MyCollectionArtworkInsightsTestsQuery } from "__generated__/MyCollectionArtworkInsightsTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { MyCollectionArtworkInsights } from "./MyCollectionArtworkInsights"

describe("MyCollectionArtworkInsights", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionArtworkInsightsTestsQuery>({
    Component: (props) => {
      if (!props?.artwork || !props?.marketPriceInsights || !props.me) {
        return null
      }
      return (
        <MyCollectionArtworkInsights
          me={props.me}
          marketPriceInsights={props.marketPriceInsights}
          artwork={props?.artwork}
        />
      )
    },
    query: graphql`
      query MyCollectionArtworkInsightsTestsQuery @relay_test_operation {
        artwork(id: "some-artwork-id") {
          ...MyCollectionArtworkInsights_artwork
          ...MyCollectionArtworkSubmissionStatus_submissionState
          consignmentSubmission {
            state
          }
        }

        marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
          ...MyCollectionArtworkInsights_marketPriceInsights
        }
        me {
          ...MyCollectionArtworkInsights_me
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

  describe("AREnableSubmitArtworkTier2Information feature flag is on", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableSubmitArtworkTier2Information: true,
      })
    })

    it("renders the submission status when status is REJECTES", async () => {
      renderWithRelay({
        Query: () => ({
          artwork: { ...mockArtwork, consignmentSubmission: { state: "REJECTED" } },
        }),
      })

      expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).not.toBe(null)
    })

    it("does not render the submission status when status is not REJECTES", async () => {
      renderWithRelay({
        Query: () => ({
          artwork: { ...mockArtwork, consignmentSubmission: { state: "APPROVED" } },
        }),
      })

      expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).toBe(null)
    })
  })

  describe("AREnableSubmitArtworkTier2Information feature flag is off", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableSubmitArtworkTier2Information: false,
      })
    })

    it("does not render the submission status when status is REJECTES ", async () => {
      renderWithRelay({
        Query: () => ({
          artwork: { ...mockArtwork, consignmentSubmission: { state: "REJECTED" } },
        }),
      })

      expect(screen.queryByTestId("MyCollectionArtworkSubmissionStatus-Container")).toBe(null)
    })
  })

  describe("Conditional Display of RequestForPriceEstimateBanner", () => {
    it("does not display RequestForPriceEstimateBanner when Artist is not P1", () => {
      renderWithRelay({
        Query: () => ({
          artwork: mockArtwork,
          marketPriceInsights: mockMarketPriceInsightsForHighDemandIndex,
        }),
      })
      expect(screen.queryByTestId("request-price-estimate-button")).toBeNull()
    })

    it("does not display when artwork is submitted", () => {
      renderWithRelay({
        Query: () => ({
          artwork: {
            ...mockArtworkForP1Artist,
            consignmentsSubmission: { displayText: "Consignment" },
          },
          marketPriceInsights: mockMarketPriceInsightsForHighDemandIndex,
        }),
      })

      expect(screen.queryByTestId("request-price-estimate-button")).toBeNull()
    })
  })

  describe("display of Submit for Sale section", () => {
    it("renders Submit for Sale section if P1 artist and artwork was not submitted to sale", () => {
      renderWithRelay({
        Query: () => ({
          artwork: {
            artist: {
              targetSupply: {
                isTargetSupply: true,
              },
            },
            submissionId: null,
          },
        }),
      })
      expect(screen.getByText("Interested in Selling This Work?")).toBeTruthy()
    })

    it("does not render Submit for Sale section if not P1 artist", () => {
      renderWithRelay({
        Query: () => ({
          artwork: {
            artist: {
              targetSupply: {
                isTargetSupply: false,
              },
            },
          },
        }),
      })

      expect(() => screen.getByText("Interested in Selling This Work?")).toThrow(
        "Unable to find an element with text: Interested in Selling This Work?"
      )
    })
    it("does not render Submit for Sale section if P1 artist and artwork was submited to sale", () => {
      renderWithRelay({
        Query: () => ({
          artwork: {
            artist: {
              targetSupply: {
                isTargetSupply: true,
              },
            },
            submissionId: "someId",
          },
        }),
      })

      expect(() => screen.getByText("Interested in Selling This Work?")).toThrow(
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
                  isTargetSupply: true,
                },
              },
            },
          },
        },
      ],
    },
  },
}
