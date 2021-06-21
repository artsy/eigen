import { AuctionResultForYouContainerTestsQuery } from "__generated__/AuctionResultForYouContainerTestsQuery.graphql"
import { LinkText } from "lib/Components/Text/LinkText"
import { navigate } from "lib/navigation/navigate"
import { Tab } from "lib/Scenes/Favorites/Favorites"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { first } from "lodash"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { AuctionResultForYouContainer } from "../AuctionResultForYou"

jest.unmock("react-relay")

describe("AuctionResultForYouContainer", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<AuctionResultForYouContainerTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query AuctionResultForYouContainerTestsQuery($first: Int!, $after: String) @relay_test_operation {
          me {
            ...AuctionResultForYou_me @arguments(first: $first, after: $after)
          }
        }
      `}
      variables={{ after: "YXJyYXljb25uZWN0aW9uOjA", first: 3 }}
      render={({ props }) => {
        if (props) {
          return <AuctionResultForYouContainer me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("Renders list of auction results for you", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    const mockProps = {
      auctionResultsByFollowedArtists: () => ({
        counts: {
          total: 0,
        },
        edges: [auctionResultEdge, auctionResultEdge, auctionResultEdge],
      }),
    }

    mockEnvironmentPayload(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(AuctionResultForYouContainer)).toHaveLength(1)
  })

  it("routes to favorites URL with passProps", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    const mockProps = {
      auctionResultsByFollowedArtists: () => ({
        counts: {
          total: 0,
        },
        edges: [auctionResultEdge, auctionResultEdge, auctionResultEdge],
      }),
    }

    mockEnvironmentPayload(mockEnvironment, mockProps)
    first(tree.root.findAllByType(LinkText))?.props.onPress()

    expect(navigate).toHaveBeenCalledWith("/favorites", { passProps: { initialTab: Tab.artists } })
  })
})

const auctionResultEdge = {
  node: {
    id: "QXVjdGlvblJlc3VsdDozMzM5NTI=",
    artistID: "4d8b92bb4eb68a1b2c000452",
    internalID: "333952",
    title: "Enso: The Sound of the Bell of Paired Sal Trees",
    currency: "HKD",
    dateText: "2015",
    mediumText: "acrylic on canvas mounted on aluminum frame",
    saleDate: "2021-06-01T00:00:00.000Z",
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
