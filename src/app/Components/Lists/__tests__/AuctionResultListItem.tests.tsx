import { fireEvent, screen } from "@testing-library/react-native"
import { AuctionResultListItemTestsQuery } from "__generated__/AuctionResultListItemTestsQuery.graphql"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { RouterLink } from "app/system/navigation/RouterLink"
import * as navigation from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/system/navigation/RouterLink", () => {
  const { RouterLink } = jest.requireActual("app/system/navigation/RouterLink")
  return { RouterLink: jest.fn(RouterLink) }
})

describe("AuctionResults", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const navigate = jest.spyOn(navigation, "navigate")

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    jest.clearAllMocks()
    ;(RouterLink as unknown as jest.Mock).mockImplementation(
      jest.requireActual("app/system/navigation/RouterLink").RouterLink
    )
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

  it("renders auction result when auction results are available", async () => {
    await renderWithWrappers(<TestRenderer />)
    await resolveMostRecentRelayOperation(mockEnvironment, {
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

    expect(screen.getByTestId("price")).toHaveTextContent("$one gazillion")
    expect(screen.queryByTestId("priceUSD")).not.toBeOnTheScreen()
  })

  it("renders price in USD when currency is not USD", async () => {
    await renderWithWrappers(<TestRenderer />)
    await resolveMostRecentRelayOperation(mockEnvironment, {
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

    expect(screen.getByTestId("price")).toHaveTextContent("€one gazillion • $one gazillion")
    expect(screen.getByTestId("priceUSD")).toHaveTextContent("$one gazillion")
  })

  it("renders auction result when auction results are not available yet", async () => {
    await renderWithWrappers(<TestRenderer />)
    await resolveMostRecentRelayOperation(mockEnvironment, {
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
                saleDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByTestId("price")).toHaveTextContent("Awaiting results")
    expect(screen.queryByTestId("priceUSD")).not.toBeOnTheScreen()
  })

  it("renders auction result when auction result is `bought in`", async () => {
    await renderWithWrappers(<TestRenderer />)
    await resolveMostRecentRelayOperation(mockEnvironment, {
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
                saleDate: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
                boughtIn: true,
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByTestId("price")).toHaveTextContent("Bought in")
    expect(screen.queryByTestId("priceUSD")).not.toBeOnTheScreen()
  })

  it("renders sale date correctly", async () => {
    await renderWithWrappers(<TestRenderer />)
    await resolveMostRecentRelayOperation(mockEnvironment, {
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
    await renderWithWrappers(<TestRenderer />)
    await resolveMostRecentRelayOperation(mockEnvironment, {
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

    await fireEvent.press(button)

    expect(navigate).toHaveBeenCalledWith("https://www.artsy.net/artwork/auction-lot")
  })

  it("triggers on press when specfied", async () => {
    // Render RouterLink as a plain pressable host so we only exercise the item's own press handler
    ;(RouterLink as unknown as jest.Mock).mockImplementation(({ onPress, children }) => {
      const { View } = jest.requireActual("react-native")
      return (
        <View testID="router-link" onPress={onPress}>
          {children}
        </View>
      )
    })
    const mockOnPress = jest.fn()
    await renderWithWrappers(<TestRenderer onPress={mockOnPress} />)
    await resolveMostRecentRelayOperation(mockEnvironment, {
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

    await fireEvent.press(screen.getAllByTestId("router-link")[0])

    expect(mockOnPress).toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })
})
