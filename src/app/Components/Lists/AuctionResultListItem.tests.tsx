import { AuctionResultListItemTestsQuery } from "__generated__/AuctionResultListItemTestsQuery.graphql"
import { AuctionResultsMidEstimate } from "app/Components/AuctionResult/AuctionResultMidEstimate"
import { extractNodes } from "app/utils/extractNodes"
import { extractText } from "app/utils/tests/extractText"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import moment from "moment"
import { graphql } from "react-relay"
import { AuctionResultListItemFragmentContainer } from "./AuctionResultListItem"

describe("AuctionResults", () => {
  const { renderWithRelay } = setupTestWrapper<AuctionResultListItemTestsQuery>({
    Component: (props: any) => {
      if (props?.artist) {
        const results = extractNodes(props.artist.auctionResultsConnection)
        return (
          <AuctionResultListItemFragmentContainer
            auctionResult={results[0] as any}
            onPress={() => null}
          />
        )
      }
      return null
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
    const tree = renderWithRelay({
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

    expect(extractText(tree.UNSAFE_getByProps({ testID: "price" }))).toBe(
      "$one gazillion (+10% est)"
    )
    expect(tree.UNSAFE_getAllByProps({ testID: "priceUSD" }).length).toBe(0)
  })

  it("renders price in USD when currency is not USD", () => {
    const tree = renderWithRelay({
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

    expect(extractText(tree.UNSAFE_getByProps({ testID: "price" }))).toBe(
      "€one gazillion • $one gazillion (+10% est)"
    )
    expect(extractText(tree.UNSAFE_getByProps({ testID: "priceUSD" }))).toBe("$one gazillion")
  })

  it("renders auction result when auction results are not available yet", () => {
    const tree = renderWithRelay({
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

    expect(tree.UNSAFE_getByProps({ testID: "price" }).props.children).toBe("Awaiting results")
    expect(tree.UNSAFE_getAllByProps({ testID: "priceUSD" }).length).toBe(0)
  })

  it("renders auction result when auction result is `bought in`", () => {
    const tree = renderWithRelay({
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

    expect(tree.UNSAFE_getByProps({ testID: "price" }).props.children).toBe("Bought in")
    expect(tree.UNSAFE_getAllByProps({ testID: "priceUSD" }).length).toBe(0)
  })

  it("renders sale date correctly", () => {
    const tree = renderWithRelay({
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

    expect(tree.UNSAFE_getByProps({ testID: "saleInfo" }).props.children).toContain("Jan 12, 2021")
    expect(tree.UNSAFE_getAllByType(AuctionResultsMidEstimate)[0].props.value).toEqual("mid-1")
    expect(tree.UNSAFE_getAllByType(AuctionResultsMidEstimate)[0].props.shortDescription).toEqual(
      "est"
    )
  })
})
