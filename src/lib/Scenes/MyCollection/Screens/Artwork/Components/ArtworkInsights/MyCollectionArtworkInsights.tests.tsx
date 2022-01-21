import { MyCollectionArtworkInsightsTestsQuery } from "__generated__/MyCollectionArtworkInsightsTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkArtistArticlesFragmentContainer } from "./MyCollectionArtworkArtistArticles"
import { MyCollectionArtworkArtistAuctionResultsFragmentContainer } from "./MyCollectionArtworkArtistAuctionResults"
import { MyCollectionArtworkArtistMarketFragmentContainer } from "./MyCollectionArtworkArtistMarket"
import { MyCollectionArtworkDemandIndexFragmentContainer } from "./MyCollectionArtworkDemandIndex"
import { MyCollectionArtworkInsightsFragmentContainer } from "./MyCollectionArtworkInsights"

jest.unmock("react-relay")

describe("MyCollectionArtworkInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkInsightsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkInsightsTestsQuery @relay_test_operation {
          artwork(id: "some-artwork-id") {
            ...MyCollectionArtworkInsights_artwork
          }

          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...MyCollectionArtworkInsights_marketPriceInsights
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork && props?.marketPriceInsights) {
          return (
            <MyCollectionArtworkInsightsFragmentContainer
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
    expect(wrapper.root.findByType(MyCollectionArtworkDemandIndexFragmentContainer)).toBeDefined()
    expect(wrapper.root.findByType(MyCollectionArtworkArtistMarketFragmentContainer)).toBeDefined()
    expect(
      wrapper.root.findByType(MyCollectionArtworkArtistAuctionResultsFragmentContainer)
    ).toBeDefined()
    expect(
      wrapper.root.findByType(MyCollectionArtworkArtistArticlesFragmentContainer)
    ).toBeDefined()
  })
})
