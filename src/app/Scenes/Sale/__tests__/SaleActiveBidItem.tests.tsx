import { SaleActiveBidItemTestsQuery } from "__generated__/SaleActiveBidItemTestsQuery.graphql"
import {
  HighestBid,
  Outbid,
  ReserveNotMet,
  BiddingLiveNow,
  LiveAuction,
} from "app/Scenes/MyBids/Components/BiddingStatuses"
import { SaleActiveBidItemContainer } from "app/Scenes/Sale/Components/SaleActiveBidItem"
import { navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { DateTime } from "luxon"
import { TouchableOpacity } from "react-native"
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

  it("navigates to the sale artwork screen on press", () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    const button = view.root.findAllByType(TouchableOpacity)[0]
    button.props.onPress()
    expect(navigate).toBeCalledWith("artwork-href")
  })

  it("renders highest bid if a lot is the highest bid", () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(view.root.findAllByType(HighestBid)).toHaveLength(1)
  })

  it("renders ReserveNotMet if the reserve has not been met", () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(view.root.findAllByType(ReserveNotMet)).toHaveLength(1)
  })

  it("renders Outbid if the user has been outbid", () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(view.root.findAllByType(Outbid)).toHaveLength(1)
  })

  it("renders BiddingLiveNow and hides bids info if the sale is in live bidding state", () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(extractText(view.root)).not.toContain("1 bid")
    expect(view.root.findAllByType(BiddingLiveNow)).toHaveLength(1)
  })

  it("renders LiveAuction and hides bids info if the sale is past live bidding start time", () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(extractText(view.root)).not.toContain("1 bid")
    expect(view.root.findAllByType(LiveAuction)).toHaveLength(1)
  })

  it("renders the right bid count if the user has only 1 bid", () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(extractText(view.root)).toContain("1 bid")
  })

  it("renders the right bid count if the user has more than 1 bid", () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockEnvironment, mockProps)

    expect(extractText(view.root)).toContain("5 bids")
  })
})
