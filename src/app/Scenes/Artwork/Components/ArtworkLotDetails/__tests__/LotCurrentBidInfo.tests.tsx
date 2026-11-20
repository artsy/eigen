import { act, screen } from "@testing-library/react-native"
import { LotCurrentBidInfo_TestQuery } from "__generated__/LotCurrentBidInfo_TestQuery.graphql"
import { LotCurrentBidInfo } from "app/Scenes/Artwork/Components/ArtworkLotDetails/LotCurrentBidInfo"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("LotCurrentBidInfo", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    const data = useLazyLoadQuery<LotCurrentBidInfo_TestQuery>(
      graphql`
        query LotCurrentBidInfo_TestQuery @relay_test_operation {
          artwork(id: "artworkID") {
            ...LotCurrentBidInfo_artwork
          }
        }
      `,
      {}
    )

    if (data.artwork) {
      return <LotCurrentBidInfo artwork={data.artwork} />
    }

    return null
  }

  it("should render `Current Bid` when no bids", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Starting bid")).toBeTruthy()
  })

  it("should render `Current Bid` when bids present", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork: {
            ...saleArtwork,
            counts: {
              bidderPositions: 1,
            },
          },
        }),
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText(/Current bid/)).toBeTruthy()
  })

  it("should render `1 bid` label", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork: {
            ...saleArtwork,
            counts: {
              bidderPositions: 1,
            },
          },
        }),
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Current bid (1 bid)")).toBeTruthy()
  })

  it("should render `x bids` label", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork: {
            ...saleArtwork,
            counts: {
              bidderPositions: 5,
            },
          },
        }),
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Current bid (5 bids)")).toBeTruthy()
  })

  it("should render `x bids` label", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork: {
            ...saleArtwork,
            counts: {
              bidderPositions: 5,
            },
          },
        }),
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Current bid (5 bids)")).toBeTruthy()
  })

  it("should render only reserve label", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork: {
            ...saleArtwork,
            reserveMessage: "This work has a reserve",
          },
        }),
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Starting bid (this work has a reserve)")).toBeTruthy()
  })

  it("should render reserve label with bids", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          saleArtwork: {
            ...saleArtwork,
            reserveMessage: "Reserve not met",
            counts: {
              bidderPositions: 5,
            },
          },
        }),
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Current bid (5 bids, reserve not met)")).toBeTruthy()
  })

  it("should display max bid and winning indicator", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          myLotStanding: [
            {
              mostRecentBid: {
                isWinning: true,
                maxBid: {
                  display: "$15,000",
                },
              },
              activeBid: {
                isWinning: true,
              },
            },
          ],
        }),
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Your max: $15,000")).toBeTruthy()
    expect(screen.getByLabelText("My Bid Winning Icon")).toBeTruthy()
  })

  it("should display max bid and losing indicator", async () => {
    await renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    await act(async () => {
      await resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artwork,
          myLotStanding: [
            {
              mostRecentBid: {
                isWinning: false,
                maxBid: {
                  display: "$400",
                },
              },
              activeBid: null,
            },
          ],
        }),
      })
      await flushPromiseQueue()
    })

    expect(screen.getByText("Your max: $400")).toBeTruthy()
    expect(screen.getByLabelText("My Bid Losing Icon")).toBeTruthy()
  })
})

const saleArtwork = {
  reserveMessage: null,
  currentBid: {
    display: "$500",
  },
  counts: {
    bidderPositions: 0,
  },
}

const artwork = {
  saleArtwork,
}
