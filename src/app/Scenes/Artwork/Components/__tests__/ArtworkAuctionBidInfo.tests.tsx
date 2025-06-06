import { ArtworkAuctionBidInfo_Test_Query } from "__generated__/ArtworkAuctionBidInfo_Test_Query.graphql"
import { ArtworkAuctionBidInfo } from "app/Scenes/Artwork/Components/ArtworkAuctionBidInfo"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("ArtworkAuctionBidInfo", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<ArtworkAuctionBidInfo_Test_Query>(
      graphql`
        query ArtworkAuctionBidInfo_Test_Query {
          artwork(id: "artworkID") {
            ...ArtworkAuctionBidInfo_artwork
          }
        }
      `,
      {}
    )

    if (data.artwork) {
      return <ArtworkAuctionBidInfo artwork={data.artwork} />
    }

    return null
  }

  it("displays proper starting bid info when no bids", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })
    await flushPromiseQueue()

    expect(getByText("Starting bid")).toBeTruthy()
    expect(getByText("$3,000")).toBeTruthy()
  })

  it("displays proper current bid info when there are bids", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        saleArtwork: {
          ...artwork.saleArtwork,
          currentBid: {
            display: "$850",
          },
          counts: {
            bidderPositions: 1,
          },
        },
      }),
    })
    await flushPromiseQueue()

    expect(getByText("Current bid")).toBeTruthy()
    expect(getByText("$850")).toBeTruthy()
  })

  it("displays nothing when no current bid info", async () => {
    const { queryByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        ...artwork,
        saleArtwork: {
          ...artwork.saleArtwork,
          currentBid: {
            display: null,
          },
        },
      }),
    })
    await flushPromiseQueue()

    expect(queryByLabelText("Auction Bid Info")).toBeNull()
  })

  describe("displays winning indicator", () => {
    it("with my bid winning", async () => {
      const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork: {
            ...artwork.saleArtwork,
            currentBid: {
              display: "$15,000",
            },
            counts: {
              bidderPositions: 1,
            },
          },
          myLotStanding: [
            {
              mostRecentBid: { isWinning: true, maxBid: { display: "$15,000" } },
              activeBid: { isWinning: true },
            },
          ],
        }),
      })
      await flushPromiseQueue()

      expect(getByLabelText("My Bid Winning Icon")).toBeTruthy()
    })

    it("with me increasing my max bid while winning", async () => {
      const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork: {
            ...artwork.saleArtwork,
            currentBid: {
              display: "$10,000",
            },
            counts: {
              bidderPositions: 2,
            },
          },
          myLotStanding: [
            {
              mostRecentBid: { isWinning: false, maxBid: { display: "$15,000" } },
              activeBid: { isWinning: true },
            },
          ],
        }),
      })
      await flushPromiseQueue()

      expect(getByLabelText("My Bid Winning Icon")).toBeTruthy()
    })
  })

  describe("displays losing indicator", () => {
    it("for open auction with my bid losing", async () => {
      const { getByLabelText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork: {
            ...artwork.saleArtwork,
            currentBid: {
              display: "$500",
            },
            counts: {
              bidderPositions: 2,
            },
          },
          myLotStanding: [
            {
              mostRecentBid: { isWinning: false, maxBid: { display: "$400" } },
              activeBid: null,
            },
          ],
        }),
      })
      await flushPromiseQueue()

      expect(getByLabelText("My Bid Losing Icon")).toBeTruthy()
    })
  })
})

const artwork = {
  isForSale: true,
  saleArtwork: {
    currentBid: {
      display: "$3,000",
    },
    counts: {
      bidderPositions: 0,
    },
  },
  myLotStanding: null,
}
