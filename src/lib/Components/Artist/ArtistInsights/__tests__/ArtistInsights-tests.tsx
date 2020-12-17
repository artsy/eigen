import { ArtistInsightsTestsQuery } from "__generated__/ArtistInsightsTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { mockEnvironmentPayload } from "../../../../tests/mockEnvironmentPayload"
import { ArtistInsightsFragmentContainer } from "../ArtistInsights"
import { ArtistInsightsAuctionResultsPaginationContainer } from "../ArtistInsightsAuctionResults"

jest.unmock("react-relay")

describe("ArtistInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  const TestRenderer = () => (
    <QueryRenderer<ArtistInsightsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ArtistInsightsTestsQuery @relay_test_operation {
          artist(id: "some-id") {
            ...ArtistInsights_artist
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artist) {
          return <ArtistInsightsFragmentContainer artist={props.artist} />
        }
        return null
      }}
    />
  )

  it("renders list auction results", () => {
    const tree = renderWithWrappers(<TestRenderer />).root
    mockEnvironmentPayload(mockEnvironment)
    expect(tree.findAllByType(ArtistInsightsAuctionResultsPaginationContainer).length).toEqual(1)
  })
})
