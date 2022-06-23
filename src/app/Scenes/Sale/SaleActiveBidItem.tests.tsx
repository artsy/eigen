import { SaleActiveBidItemTestsQuery } from "__generated__/SaleActiveBidItemTestsQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { HighestBid, Outbid, ReserveNotMet } from "app/Scenes/MyBids/Components/BiddingStatuses"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { DateTime } from "luxon"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SaleActiveBidItemContainer } from "./Components/SaleActiveBidItem"

jest.unmock("react-relay")

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
    const tree = renderWithWrappers(<TestRenderer />)

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

    const button = tree.root.findAllByType(TouchableOpacity)[0]
    button.props.onPress()
    expect(navigate).toBeCalledWith("artwork-href")
  })

  it("renders highest bid if a lot is the highest bid", () => {
    const tree = renderWithWrappers(<TestRenderer />)

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

    expect(tree.root.findAllByType(HighestBid)).toHaveLength(1)
  })

  it("renders ReserveNotMet if the reserve has not been met", () => {
    const tree = renderWithWrappers(<TestRenderer />)

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

    expect(tree.root.findAllByType(ReserveNotMet)).toHaveLength(1)
  })

  it("renders Outbid if the user has been outbid", () => {
    const tree = renderWithWrappers(<TestRenderer />)

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

    expect(tree.root.findAllByType(Outbid)).toHaveLength(1)
  })

  it("renders the right bid count if the user has only 1 bid", () => {
    const tree = renderWithWrappers(<TestRenderer />)

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

    expect(extractText(tree.root)).toContain("1 bid")
  })

  it("renders the right bid count if the user has more than 1 bid", () => {
    const tree = renderWithWrappers(<TestRenderer />)

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

    expect(extractText(tree.root)).toContain("5 bids")
  })
})
