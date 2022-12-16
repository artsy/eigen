import { AuctionResultListItemTestsQuery } from "__generated__/AuctionResultListItemTestsQuery.graphql"
import { AuctionResultsMidEstimate } from "app/Components/AuctionResult/AuctionResultMidEstimate"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { extractNodes } from "app/utils/extractNodes"
import moment from "moment"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { AuctionResultListItemFragmentContainer } from "./AuctionResultListItem"

jest.unmock("react-relay")

describe("AuctionResults", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
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
            <AuctionResultListItemFragmentContainer
              auctionResult={results[0]}
              onPress={() => null}
            />
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

    expect(tree.findByProps({ testID: "price" }).props.children).toBe("$one gazillion")
    expect(tree.findAllByProps({ testID: "priceUSD" }).length).toBe(0)
  })

  it.only("renders price in USD when currency is not USD", () => {
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
      "€one gazillion • $one gazillion (-10% est)"
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
    expect(tree.root.findAllByType(AuctionResultsMidEstimate)[0].props.value).toEqual("mid-1")
    expect(tree.root.findAllByType(AuctionResultsMidEstimate)[0].props.shortDescription).toEqual(
      "est"
    )
  })
})
