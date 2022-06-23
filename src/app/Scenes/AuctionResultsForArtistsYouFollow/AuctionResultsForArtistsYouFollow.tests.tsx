import { AuctionResultsForArtistsYouFollowTestsQuery } from "__generated__/AuctionResultsForArtistsYouFollowTestsQuery.graphql"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { AuctionResultsForArtistsYouFollowContainer } from "./AuctionResultsForArtistsYouFollow"

jest.unmock("react-relay")

describe("AuctionResultsForArtistsYouFollowContainer", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<AuctionResultsForArtistsYouFollowTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query AuctionResultsForArtistsYouFollowTestsQuery($first: Int!, $after: String)
        @relay_test_operation {
          me {
            ...AuctionResultsForArtistsYouFollow_me @arguments(first: $first, after: $after)
          }
        }
      `}
      variables={{ after: "YXJyYXljb25uZWN0aW9uOjA", first: 3 }}
      render={({ props }) => {
        if (props) {
          return <AuctionResultsForArtistsYouFollowContainer me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("Renders list of auction results for artists you follow", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Me: () => ({
        id: "test-id",
        auctionResultsByFollowedArtists: {
          totalCount: 1,
          edges: [auctionResultEdge],
        },
      }),
    })

    expect(tree.root.findAllByType(AuctionResultsForArtistsYouFollowContainer)).toHaveLength(1)
  })
})

const auctionResultEdge = {
  node: {
    artistID: "4d8b92bb4eb68a1b2c000452",
    internalID: "333952",
    title: "Enso: The Sound of the Bell of Paired Sal Trees",
    currency: "HKD",
    dateText: "2015",
    mediumText: "acrylic on canvas mounted on aluminum frame",
    saleDate: "2021-06-01",
    organization: "Phillips",
    boughtIn: false,
    priceRealized: {
      cents: 315000000,
      display: "HK$3,150,000",
    },
    performance: {
      mid: "70%",
    },
    images: {
      thumbnail: {
        url: "https://d2v80f5yrouhh2.cloudfront.net/OTJxNHuhGDnPi8wQcvXvxA/thumbnail.jpg",
      },
    },
  },
}
