import { fireEvent, screen } from "@testing-library/react-native"
import { SaleActiveBidItemTestsQuery } from "__generated__/SaleActiveBidItemTestsQuery.graphql"
import { SaleActiveBidItemContainer } from "app/Scenes/Sale/Components/SaleActiveBidItem"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { DateTime } from "luxon"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("SaleActiveBidItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const futureDate = () => DateTime.now().plus({ year: 1 }).toISO()

  const lotStanding = {
    activeBid: {
      isWinning: true,
    },
    mostRecentBid: {
      maxBid: {
        display: "CHF 375",
      },
    },
    saleArtwork: {
      reserveStatus: "no_reserve",
      counts: {
        bidderPositions: 1,
      },
      currentBid: {
        display: "CHF 375",
      },
      artwork: {
        href: "artwork-href",
      },
    },
    sale: {
      liveStartAt: futureDate(),
      isLiveOpen: false,
      isLiveOpenHappened: false,
    },
  }

  const TestRenderer = () => (
    <QueryRenderer<SaleActiveBidItemTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleActiveBidItemTestsQuery @relay_test_operation {
          me {
            lotStandings(saleID: "sale-id") {
              ...SaleActiveBidItem_lotStanding
            }
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (
          props?.me?.lotStandings &&
          Array.isArray(props.me.lotStandings) &&
          props.me.lotStandings[0]
        ) {
          return <SaleActiveBidItemContainer lotStanding={props?.me?.lotStandings[0]} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("navigates to the sale artwork screen on press", async () => {
    await renderWithWrappers(<TestRenderer />)

    const highestBidLot = {
      ...lotStanding,
      activeBid: {
        isWinning: true,
      },
    }
    const mockProps = {
      Me: () => ({
        lotStandings: [highestBidLot],
      }),
    }

    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    await fireEvent.press(screen.getByRole("button"))
    expect(navigate).toBeCalledWith("artwork-href")
  })

  it("renders highest bid if a lot is the highest bid", async () => {
    await renderWithWrappers(<TestRenderer />)

    const highestBidLot = {
      ...lotStanding,
      activeBid: {
        isWinning: true,
      },
    }
    const mockProps = {
      Me: () => ({
        lotStandings: [highestBidLot],
      }),
    }

    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(screen.getAllByText("Highest bid")).toHaveLength(1)
  })

  it("renders ReserveNotMet if the reserve has not been met", async () => {
    await renderWithWrappers(<TestRenderer />)

    const reserveNotMetBidLot = {
      ...lotStanding,
      saleArtwork: {
        reserveStatus: "ReserveNotMet",
        counts: {
          bidderPositions: 1,
        },
        currentBid: {
          display: "CHF 375",
        },
      },
    }
    const mockProps = {
      Me: () => ({
        lotStandings: [reserveNotMetBidLot],
      }),
    }

    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(screen.getAllByText("Reserve not met")).toHaveLength(1)
  })

  it("renders Outbid if the user has been outbid", async () => {
    await renderWithWrappers(<TestRenderer />)

    const outbidBidLot = {
      ...lotStanding,
      activeBid: {
        isWinning: false,
      },
    }
    const mockProps = {
      Me: () => ({
        lotStandings: [outbidBidLot],
      }),
    }

    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(screen.getAllByText("Outbid")).toHaveLength(1)
  })

  it("renders BiddingLiveNow and hides bids info if the sale is in live bidding state", async () => {
    await renderWithWrappers(<TestRenderer />)

    const liveBiddingLot = {
      ...lotStanding,
      saleArtwork: {
        counts: {
          bidderPositions: 1,
        },
        sale: {
          isLiveOpen: true,
          isLiveOpenHappened: true,
        },
      },
    }
    const mockProps = {
      Me: () => ({
        lotStandings: [liveBiddingLot],
      }),
    }

    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(screen.queryByText(/1 bid/)).not.toBeOnTheScreen()
    expect(screen.getAllByText("Bidding live now")).toHaveLength(1)
  })

  it("renders LiveAuction and hides bids info if the sale is past live bidding start time", async () => {
    await renderWithWrappers(<TestRenderer />)

    const liveBiddingLot = {
      ...lotStanding,
      saleArtwork: {
        counts: {
          bidderPositions: 1,
        },
        sale: {
          isLiveOpen: false,
          isLiveOpenHappened: true,
        },
      },
    }
    const mockProps = {
      Me: () => ({
        lotStandings: [liveBiddingLot],
      }),
    }

    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(screen.queryByText(/1 bid/)).not.toBeOnTheScreen()
    expect(screen.getAllByText("Live auction")).toHaveLength(1)
  })

  it("renders the right bid count if the user has only 1 bid", async () => {
    await renderWithWrappers(<TestRenderer />)

    const oneBidLot = {
      ...lotStanding,
      saleArtwork: {
        reserveStatus: "no_reserve",
        counts: {
          bidderPositions: 1,
        },
        currentBid: {
          display: "CHF 375",
        },
      },
    }
    const mockProps = {
      Me: () => ({
        lotStandings: [oneBidLot],
      }),
    }

    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(screen.getByText(/1 bid/)).toBeOnTheScreen()
  })

  it("renders the right bid count if the user has more than 1 bid", async () => {
    await renderWithWrappers(<TestRenderer />)

    const fiveBidsLot = {
      ...lotStanding,
      saleArtwork: {
        reserveStatus: "no_reserve",
        counts: {
          bidderPositions: 5,
        },
        currentBid: {
          display: "CHF 375",
        },
      },
    }
    const mockProps = {
      Me: () => ({
        lotStandings: [fiveBidsLot],
      }),
    }

    await resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(screen.getByText(/5 bids/)).toBeOnTheScreen()
  })
})
