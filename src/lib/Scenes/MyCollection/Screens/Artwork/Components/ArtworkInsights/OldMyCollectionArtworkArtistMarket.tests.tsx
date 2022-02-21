import { OldMyCollectionArtworkArtistMarketTestsQuery } from "__generated__/OldMyCollectionArtworkArtistMarketTestsQuery.graphql"
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import { extractText } from "lib/tests/extractText"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { OldMyCollectionArtworkArtistMarketFragmentContainer } from "./OldMyCollectionArtworkArtistMarket"

jest.unmock("react-relay")

describe("OldMyCollectionArtworkArtistMarket", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<OldMyCollectionArtworkArtistMarketTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query OldMyCollectionArtworkArtistMarketTestsQuery @relay_test_operation {
          artwork(id: "foo") {
            ...OldMyCollectionArtworkArtistMarket_artwork
          }
          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...OldMyCollectionArtworkArtistMarket_marketPriceInsights
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork && props?.marketPriceInsights) {
          return (
            <OldMyCollectionArtworkArtistMarketFragmentContainer
              artwork={props.artwork}
              marketPriceInsights={props.marketPriceInsights}
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

  afterEach(() => {
    jest.clearAllMocks()
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
    expect(text).toContain("Artist Market Statistics")
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

  it("tracks analytics event when info button is tapped", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
      }),
    })
    wrapper.root.findByType(InfoButton).props.onPress()

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "tappedInfoBubble",
          "context_module": "myCollectionArtwork",
          "context_screen_owner_id": "artwork-id",
          "context_screen_owner_slug": "artwork-slug",
          "context_screen_owner_type": "myCollectionArtwork",
          "subject": "artistMarketStatistics",
        },
      ]
    `)
  })
})
