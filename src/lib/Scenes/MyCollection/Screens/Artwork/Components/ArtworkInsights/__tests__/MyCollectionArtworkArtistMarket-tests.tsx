import { MyCollectionArtworkArtistMarketTestsQuery } from "__generated__/MyCollectionArtworkArtistMarketTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { InfoButton } from "../InfoButton"
import { MyCollectionArtworkArtistMarketFragmentContainer } from "../MyCollectionArtworkArtistMarket"

jest.unmock("react-relay")

describe("MyCollectionArtworkArtistMarket", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkArtistMarketTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkArtistMarketTestsQuery @relay_test_operation {
          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...MyCollectionArtworkArtistMarket_marketPriceInsights
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.marketPriceInsights) {
          return <MyCollectionArtworkArtistMarketFragmentContainer marketPriceInsights={props.marketPriceInsights} />
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
    resolveData({
      MarketPriceInsights: () => ({
        annualValueSoldCents: 43433100000,
        liquidityRank: 0.999,
        annualLotsSold: 20,
        demandTrend: -7,
        medianSaleToEstimateRatio: 1,
      }),
    })
    expect(wrapper.root.findByType(InfoButton)).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("Artist market")
    expect(text).toContain("Based on the last 36 months of auction data")
    expect(text).toContain("Avg. Annual Lots Sold")
    expect(text).toContain("Sell-through Rate")

    // The following fields have formatting behavior attached; didn't test the values
    // of the other fields because they're just pass-through data.
    expect(text).toContain("Avg. Annual Value Sold")
    expect(text).toContain("434,331,000")
    expect(text).toContain("Median Sale Price to Estimate")
    expect(text).toContain("1x")
    expect(text).toContain("Liquidity")
    expect(text).toContain("Very High")
    expect(text).toContain("1-Year Trend")
    expect(text).toContain("Flat")
  })
})
