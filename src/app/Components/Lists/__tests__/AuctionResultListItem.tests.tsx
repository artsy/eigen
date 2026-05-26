import { fireEvent, screen } from "@testing-library/react-native"
import { AuctionResultListItemTestsQuery } from "__generated__/AuctionResultListItemTestsQuery.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { RouterLink } from "app/system/navigation/RouterLink"
import * as navigation from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import moment from "moment"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

describe("AuctionResults", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const navigate = jest.spyOn(navigation, "navigate")

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    jest.clearAllMocks()
  })

  const TestRenderer = ({ onPress }: { onPress?: () => void }) => (
    <QueryRenderer<AuctionResultListItemTestsQuery>
      environment={mockEnvironment}
      query={graphql`
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
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artist) {
          const results = extractNodes(props.artist.auctionResultsConnection)
          return (
            <AuctionResultListItemFragmentContainer auctionResult={results[0]} onPress={onPress} />
          )
        }
        return null
      }}
    />
  )

  it("renders auction result when auction results are available", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment, {
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

    expect(extractText(tree.findByProps({ testID: "price" }))).toBe("$one gazillion")
    expect(tree.findAllByProps({ testID: "priceUSD" }).length).toBe(0)
  })

  it("renders price in USD when currency is not USD", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment, {
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

    expect(extractText(tree.findByProps({ testID: "price" }))).toBe(
      "€one gazillion • $one gazillion"
    )
    expect(extractText(tree.findByProps({ testID: "priceUSD" }))).toBe("$one gazillion")
  })

  it("renders auction result when auction results are not available yet", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment, {
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
                saleDate: moment().subtract(1, "day").toISOString(),
              },
            },
          ],
        },
      }),
    })

    expect(tree.findByProps({ testID: "price" }).props.children).toBe("Awaiting results")
    expect(tree.findAllByProps({ testID: "priceUSD" }).length).toBe(0)
  })

  it("renders auction result when auction result is `bought in`", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation(mockEnvironment, {
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
                saleDate: moment().subtract(2, "months").toISOString(),
                boughtIn: true,
              },
            },
          ],
        },
      }),
    })

    expect(tree.findByProps({ testID: "price" }).props.children).toBe("Bought in")
    expect(tree.findAllByProps({ testID: "priceUSD" }).length).toBe(0)
  })

  it("renders sale date correctly", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
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

    expect(tree.root.findByProps({ testID: "saleInfo" }).props.children).toContain("Jan 12, 2021")
  })
  it("navigates to the lot screen for upcoming auction results happening in ", async () => {
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, {
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
              },
            },
          ],
        },
      }),
    })

    const button = screen.getByText("Mediumtext-1")

    fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith("https://www.artsy.net/artwork/auction-lot")
  })

  it("triggers on press when specfied", () => {
    const mockOnPress = jest.fn()
    const tree = renderWithWrappersLEGACY(<TestRenderer onPress={mockOnPress} />)
    resolveMostRecentRelayOperation(mockEnvironment, {
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
              },
            },
          ],
        },
      }),
    })

    const button = tree.root.findAllByType(RouterLink)[0]

    button.props.onPress()

    expect(mockOnPress).toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })
})
