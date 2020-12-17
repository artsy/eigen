import { ArtistInsightsAuctionResultsTestsQuery } from "__generated__/ArtistInsightsAuctionResultsTestsQuery.graphql"
import { mockEdges } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { mockEnvironmentPayload } from "../../../../tests/mockEnvironmentPayload"
import { ArtistInsightsAuctionResultFragmentContainer } from "../ArtistInsightsAuctionResult"
import { ArtistInsightsAuctionResultsPaginationContainer } from "../ArtistInsightsAuctionResults"

jest.unmock("react-relay")

describe("ArtistInsightsAuctionResults", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<ArtistInsightsAuctionResultsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistInsightsAuctionResultsTestsQuery @relay_test_operation {
          artist(id: "some-id") {
            ...ArtistInsightsAuctionResults_artist
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artist) {
          return <ArtistInsightsAuctionResultsPaginationContainer artist={props.artist} />
        }
        return null
      }}
    />
  )

  it("renders list auction results when auction results are available", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironmentPayload(mockEnvironment, {
      Artist: () => ({
        auctionResultsConnection: {
          edges: mockEdges(5),
        },
      }),
    })

    expect(tree.findAllByType(FlatList).length).toEqual(1)
    expect(tree.findAllByType(ArtistInsightsAuctionResultFragmentContainer).length).toEqual(5)
  })
})
