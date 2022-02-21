import { OldMyCollectionArtworkInsightsTestsQuery } from "__generated__/OldMyCollectionArtworkInsightsTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkArtistArticlesFragmentContainer } from "./MyCollectionArtworkArtistArticles"
import { OldMyCollectionArtworkArtistAuctionResultsFragmentContainer } from "./OldMyCollectionArtworkArtistAuctionResults"
import { OldMyCollectionArtworkArtistMarketFragmentContainer } from "./OldMyCollectionArtworkArtistMarket"
import { OldMyCollectionArtworkDemandIndexFragmentContainer } from "./OldMyCollectionArtworkDemandIndex"
import { OldMyCollectionArtworkInsightsFragmentContainer } from "./OldMyCollectionArtworkInsights"

jest.unmock("react-relay")

describe("MyCollectionArtworkInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<OldMyCollectionArtworkInsightsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query OldMyCollectionArtworkInsightsTestsQuery @relay_test_operation {
          artwork(id: "some-artwork-id") {
            ...OldMyCollectionArtworkInsights_artwork
          }

          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...OldMyCollectionArtworkInsights_marketPriceInsights
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork && props?.marketPriceInsights) {
          return (
            <OldMyCollectionArtworkInsightsFragmentContainer
              marketPriceInsights={props.marketPriceInsights}
              artwork={props?.artwork}
            />
          )
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const resolveData = (passedProps = {}) => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, passedProps)
    )
  }

  it("renders without throwing an error", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    const text = extractText(wrapper.root)
    expect(text).toContain("Market Insights")
    expect(text).toContain(
      '<mock-value-for-field-"sizebucket"> other by <mock-value-for-field-"name">'
    )
    expect(
      wrapper.root.findByType(OldMyCollectionArtworkDemandIndexFragmentContainer)
    ).toBeDefined()
    expect(
      wrapper.root.findByType(OldMyCollectionArtworkArtistMarketFragmentContainer)
    ).toBeDefined()
    expect(
      wrapper.root.findByType(OldMyCollectionArtworkArtistAuctionResultsFragmentContainer)
    ).toBeDefined()
    expect(
      wrapper.root.findByType(MyCollectionArtworkArtistArticlesFragmentContainer)
    ).toBeDefined()
  })
})
