import { SaleActiveBidItemTestsQuery } from "__generated__/SaleActiveBidItemTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { HighestBid, Outbid, ReserveNotMet } from "app/Scenes/MyBids/Components/BiddingStatuses"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { DateTime } from "luxon"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { SaleActiveBidItemContainer } from "./Components/SaleActiveBidItem"

describe("SaleActiveBidItem", () => {
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
    },
  }

  const TestRenderer = () => (
    <QueryRenderer<SaleActiveBidItemTestsQuery>
      environment={getRelayEnvironment()}
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

  it("navigates to the sale artwork screen on press", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockProps)

    const button = tree.root.findAllByType(TouchableOpacity)[0]
    button.props.onPress()
    expect(navigate).toBeCalledWith("artwork-href")
  })

  it("renders highest bid if a lot is the highest bid", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockProps)

    expect(tree.root.findAllByType(HighestBid)).toHaveLength(1)
  })

  it("renders ReserveNotMet if the reserve has not been met", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockProps)

    expect(tree.root.findAllByType(ReserveNotMet)).toHaveLength(1)
  })

  it("renders Outbid if the user has been outbid", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockProps)

    expect(tree.root.findAllByType(Outbid)).toHaveLength(1)
  })

  it("renders the right bid count if the user has only 1 bid", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockProps)

    expect(extractText(tree.root)).toContain("1 bid")
  })

  it("renders the right bid count if the user has more than 1 bid", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

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

    resolveMostRecentRelayOperation(mockProps)

    expect(extractText(tree.root)).toContain("5 bids")
  })
})
