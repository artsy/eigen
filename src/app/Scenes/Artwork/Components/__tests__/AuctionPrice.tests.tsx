import { AuctionPriceTestsQuery } from "__generated__/AuctionPriceTestsQuery.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import {
  AuctionPriceFragmentContainer,
  AuctionPriceProps,
} from "app/Scenes/Artwork/Components/AuctionPrice"
import {
  AuctionPreview,
  AuctionPreviewNoStartingBid,
  ClosedAuctionArtwork,
  LiveAuctionInProgeress,
  OpenAuctionNoReserveNoBids,
  OpenAuctionNoReserveWithBids,
  OpenAuctionReserveMetWithBids,
  OpenAuctionReserveMetWithMyLosingBid,
  OpenAuctionReserveMetWithMyWinningBid,
  OpenAuctionReserveNoBids,
  OpenAuctionReserveNotMetIncreasingOwnBid,
  OpenAuctionReserveNotMetWithBids,
} from "app/__fixtures__/ArtworkBidInfo"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("AuctionPrice", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestWrapper = (props: Omit<AuctionPriceProps, "artwork">) => {
    return (
      <QueryRenderer<AuctionPriceTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query AuctionPriceTestsQuery @relay_test_operation @raw_response_type {
            artwork(id: "auction_artwork_estimate_premium") {
              ...AuctionPrice_artwork
            }
          }
        `}
        variables={{}}
        render={({ props: relayProps }) => {
          if (relayProps?.artwork) {
            return <AuctionPriceFragmentContainer artwork={relayProps.artwork} {...props} />
          }
          return null
        }}
      />
    )
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  describe("for closed auction", () => {
    it("displays Auction Closed", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSED} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ClosedAuctionArtwork,
      })

      expect(getByText("Bidding closed")).toBeTruthy()
    })
  })

  describe("for live sale in progress", () => {
    it("does not display anything", () => {
      const { toJSON } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.LIVE_INTEGRATION_ONGOING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => LiveAuctionInProgeress,
      })

      expect(toJSON()).toBeNull()
    })
  })

  describe("for auction preview", () => {
    it("displays proper starting bid info", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.PREVIEW} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => AuctionPreview,
      })

      expect(getByText("Starting bid")).toBeTruthy()
      expect(getByText("CHF 4,000")).toBeTruthy()
    })
  })

  describe("for auction preview with no start bid set", () => {
    it("displays nothing if current bid info is unavailable", () => {
      const { toJSON } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.PREVIEW} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => AuctionPreviewNoStartingBid,
      })

      expect(toJSON()).toBeNull()
    })
  })

  describe("for open auction with no reserve and no bids", () => {
    it("displays proper starting bid info", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => OpenAuctionNoReserveNoBids,
      })

      expect(getByText("Starting bid")).toBeTruthy()
      expect(getByText("$500")).toBeTruthy()
    })
  })

  describe("open auction with no reserve with bids present", () => {
    it("displays proper current bid info including bid count", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => OpenAuctionNoReserveWithBids,
      })

      expect(getByText("Current bid")).toBeTruthy()
      expect(getByText("$850")).toBeTruthy()
      expect(getByText("11 bids")).toBeTruthy()
    })
  })

  describe("for open auction with reserve and no bids", () => {
    it("displays proper starting bid info and resserve message", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => OpenAuctionReserveNoBids,
      })

      expect(getByText("Starting bid")).toBeTruthy()
      expect(getByText("This work has a reserve")).toBeTruthy()
      expect(getByText("$3,000")).toBeTruthy()
    })
  })

  describe("for open auction with some bids and reserve not met", () => {
    it("displays current bid message inculding reserve warning", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => OpenAuctionReserveNotMetWithBids,
      })

      expect(getByText("Current bid")).toBeTruthy()
      expect(getByText("2 bids, reserve not met")).toBeTruthy()
      expect(getByText("$10,000")).toBeTruthy()
    })
  })

  describe("for open auction with some bids and satisfied reserve", () => {
    it("displays current bid message inculding reserve met", () => {
      const { getByText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => OpenAuctionReserveMetWithBids,
      })

      expect(getByText("Current bid")).toBeTruthy()
      expect(getByText("2 bids, reserve met")).toBeTruthy()
      expect(getByText("$500")).toBeTruthy()
    })
  })

  describe("for open auction with my bid winning", () => {
    it("displays max bid and winning indicator", () => {
      const { getByText, getByLabelText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => OpenAuctionReserveMetWithMyWinningBid,
      })

      expect(getByText("Your max: $15,000")).toBeTruthy()
      expect(getByLabelText("My Bid Winning Icon")).toBeTruthy()
    })
  })

  describe("for open auction with my bid losing", () => {
    it("displays max bid and losing indicator", () => {
      const { getByText, getByLabelText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => OpenAuctionReserveMetWithMyLosingBid,
      })

      expect(getByText("Your max: $400")).toBeTruthy()
      expect(getByLabelText("My Bid Losing Icon")).toBeTruthy()
    })
  })

  describe("for open auction with me increasing my max bid while winning", () => {
    it("displays max bid and winning indicator", () => {
      const { getByText, getByLabelText } = renderWithWrappers(
        <TestWrapper auctionState={AuctionTimerState.CLOSING} />
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => OpenAuctionReserveNotMetIncreasingOwnBid,
      })

      expect(getByText("Your max: $15,000")).toBeTruthy()
      expect(getByLabelText("My Bid Winning Icon")).toBeTruthy()
    })
  })
})
