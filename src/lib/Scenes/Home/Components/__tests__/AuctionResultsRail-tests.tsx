import { cloneDeep, first } from "lodash"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { navigate } from "lib/navigation/navigate"

import { AuctionResultsRailTestsQuery } from "__generated__/AuctionResultsRailTestsQuery.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { AuctionResultsRailFragmentContainer } from "../AuctionResultsRail"

jest.unmock("react-relay")

describe("AuctionResultsRailFragmentContainer", () => {
  let env: ReturnType<typeof createMockEnvironment>
  const mockScrollRef = jest.fn()

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
          return <AuctionResultsRailFragmentContainer me={props.me!} scrollRef={mockScrollRef} />
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
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: meResponseMock,
        },
      })
    })
  })

  it("looks correct when rendered with sales missing auctionResultsByFollowedArtists", () => {
    const auctionResultsCopy = cloneDeep(meResponseMock)
    auctionResultsCopy.results.forEach((result) => {
      // @ts-ignore
      result.auctionResultsByFollowedArtists.edges = []
    })
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: meResponseMock,
        },
      })
    })
  })

  it("routes to auction-result-for-you URL", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: meResponseMock,
        },
      })
    })
    // @ts-ignore
    first(tree.root.findAllByType(SectionTitle)).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/auction-result-for-you")
  })
})

const auctionResultEdge = {
  cursor: "YXJyYXljb25uZWN0aW9uOjA=",
  node: {
    id: "QXVjdGlvblJlc3VsdDozMzM5NTI=",
    artistID: "4d8b92bb4eb68a1b2c000452",
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
