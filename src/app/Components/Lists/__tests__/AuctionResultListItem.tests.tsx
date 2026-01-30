import { fireEvent, screen } from "@testing-library/react-native"
import { AuctionResultListItemTestsQuery } from "__generated__/AuctionResultListItemTestsQuery.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import * as navigation from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { graphql } from "react-relay"

describe("AuctionResults", () => {
  const navigate = jest.spyOn(navigation, "navigate")
  const mockOnPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper<AuctionResultListItemTestsQuery>({
    Component: (props) => {
      if (!props.artist) {
        return null
      }
      const results = extractNodes(props.artist.auctionResultsConnection)
      return (
        <AuctionResultListItemFragmentContainer auctionResult={results[0]} onPress={mockOnPress} />
      )
    },
    query: graphql`
      query AuctionResultListItemTestsQuery @relay_test_operation {
        artist(id: "some-id") {
          auctionResultsConnection(first: 1) {
            edges {
              node {
                id
                ...AuctionResultListItem_auctionResult
              }
            }
          }
        }
      }
    `,
  })

  it("renders auction result when auction results are available", () => {
    renderWithRelay({
      Artist: () => ({
        auctionResultsConnection: {
          edges: [
            {
              node: {
                id: "an-id",
                currency: "USD",
                priceRealized: {
                  display: "$one gazillion",
                  displayUSD: "$one gazillion",
                },
                performance: {
                  mid: "10",
                },
                artist: {
                  name: "artist-name",
                  slug: "artist-slug",
                },
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("$one gazillion")).toBeOnTheScreen()
    expect(screen.queryAllByTestId("priceUSD").length).toBe(0)
  })

  it("renders price in USD when currency is not USD", () => {
    renderWithRelay({
      Artist: () => ({
        auctionResultsConnection: {
          edges: [
            {
              node: {
                id: "an-id",
                currency: "EU",
                priceRealized: {
                  display: "€one gazillion",
                  displayUSD: "$one gazillion",
                },
                performance: {
                  mid: "10",
                },
                artist: {
                  name: "artist-name",
                  slug: "artist-slug",
                },
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("€one gazillion • $one gazillion")).toBeOnTheScreen()
    expect(screen.getByTestId("priceUSD")).toHaveTextContent("$one gazillion")
  })

  it("renders auction result when auction results are not available yet", () => {
    renderWithRelay({
      Artist: () => ({
        auctionResultsConnection: {
          edges: [
            {
              node: {
                id: "an-id",
                priceRealized: {
                  display: null,
                  displayUSD: null,
                },
                performance: {
                  mid: "10",
                },
                saleDate: DateTime.now().minus({ days: 1 }).toISO(),
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByTestId("price")).toHaveTextContent("Awaiting results")
    expect(screen.queryAllByTestId("priceUSD").length).toBe(0)
  })

  it("renders auction result when auction result is `bought in`", () => {
    renderWithRelay({
      Artist: () => ({
        auctionResultsConnection: {
          edges: [
            {
              node: {
                id: "an-id",
                priceRealized: {
                  display: null,
                  displayUSD: null,
                },
                performance: {
                  mid: "10",
                },
                saleDate: DateTime.now().minus({ months: 2 }).toISO(),
                boughtIn: true,
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByTestId("price")).toHaveTextContent("Bought in")
    expect(screen.queryAllByTestId("priceUSD").length).toBe(0)
  })

  it("renders sale date correctly", () => {
    renderWithRelay({
      Artist: () => ({
        auctionResultsConnection: {
          edges: [
            {
              node: {
                id: "an-id",
                saleDate: "2021-01-11T18:00:00-06:00",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByTestId("saleInfo")).toHaveTextContent(/Jan 12, 2021/)
  })
  it("navigates to the lot screen for upcoming auction results happening in ", async () => {
    renderWithRelay({
      Artist: () => ({
        auctionResultsConnection: {
          edges: [
            {
              node: {
                id: "an-id",
                saleDate: "2055-01-11T18:00:00-06:00",
                isUpcoming: true,
                isInArtsyAuction: true,
                externalURL: "https://www.artsy.net/artwork/auction-lot",
                mediumText: "Painting",
              },
            },
          ],
        },
      }),
    })

    const button = screen.getByText("Painting")

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith("https://www.artsy.net/artwork/auction-lot")
  })

  it("triggers on press when specfied", () => {
    renderWithRelay({
      Artist: () => ({
        auctionResultsConnection: {
          edges: [
            {
              node: {
                id: "an-id",
                saleDate: "2055-01-11T18:00:00-06:00",
                isUpcoming: true,
                isInArtsyAuction: true,
                externalURL: "https://www.artsy.net/artwork/auction-lot",
                mediumText: "Sculpture",
              },
            },
          ],
        },
      }),
    })

    const button = screen.getByText("Sculpture")

    fireEvent.press(button)

    expect(mockOnPress).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalled()
  })
})
