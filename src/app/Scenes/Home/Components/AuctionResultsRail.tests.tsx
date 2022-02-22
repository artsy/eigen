import { cloneDeep, first } from "lodash"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

import { navigate } from "app/navigation/navigate"

import { AuctionResultsRailTestsQuery } from "__generated__/AuctionResultsRailTestsQuery.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { AuctionResultsRailFragmentContainer } from "./AuctionResultsRail"

jest.unmock("react-relay")

describe("AuctionResultsRailFragmentContainer", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<AuctionResultsRailTestsQuery>
      environment={env}
      query={graphql`
        query AuctionResultsRailTestsQuery @raw_response_type {
          me {
            ...AuctionResultsRail_me
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props) {
          return <AuctionResultsRailFragmentContainer title="Auction Results" me={props.me!} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("doesn't throw when rendered", () => {
    renderWithWrappers(<TestRenderer />)
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          me: meResponseMock,
        }),
      })
    )
  })

  it("looks correct when rendered with sales missing auctionResultsByFollowedArtists", () => {
    const auctionResultsCopy = cloneDeep(meResponseMock)
    auctionResultsCopy.results.forEach((result) => {
      result.auctionResultsByFollowedArtists.edges = []
    })

    renderWithWrappers(<TestRenderer />)
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          me: auctionResultsCopy,
        }),
      })
    )
  })

  it("routes to auction-results-for-artists-you-follow URL", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Query: () => ({
          me: meResponseMock,
        }),
      })
    )

    first(tree.root.findAllByType(SectionTitle))?.props.onPress()
    expect(navigate).toHaveBeenCalledWith("/auction-results-for-artists-you-follow")
  })
})

const auctionResultEdge = {
  cursor: "YXJyYXljb25uZWN0aW9uOjA=",
  node: {
    id: "QXVjdGlvblJlc3VsdDozMzM5NTI=",
    artistID: "4d8b92bb4eb68a1b2c000452",
    artist: {
      name: "Takashi Murakami",
    },
    internalID: "333952",
    title: "Enso: The Sound of the Bell of Paired Sal Trees",
    currency: "HKD",
    dateText: "2015",
    mediumText: "acrylic on canvas mounted on aluminum frame",
    saleDate: "2021-06-01T03:00:00+03:00",
    organization: "Phillips",
    boughtIn: false,
    priceRealized: {
      cents: 315000000,
      display: "HK$3,150,000",
      displayUSD: "$30,000",
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
const meResponseMock = {
  results: [
    {
      auctionResultsByFollowedArtists: {
        totalCount: 1510,
        edges: [auctionResultEdge, auctionResultEdge, auctionResultEdge],
      },
    },
  ],
}
