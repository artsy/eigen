import { MyCollectionArtworkDemandIndexTestsQuery } from "__generated__/MyCollectionArtworkDemandIndexTestsQuery.graphql"
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import { extractText } from "lib/tests/extractText"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import {
  MyCollectionArtworkDemandIndexFragmentContainer,
  tests,
} from "./MyCollectionArtworkDemandIndex"

jest.unmock("react-relay")

describe("MyCollectionArtworkDemandIndex", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkDemandIndexTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkDemandIndexTestsQuery @relay_test_operation {
          artwork(id: "some-artwork-id") {
            ...MyCollectionArtworkDemandIndex_artwork
          }
          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...MyCollectionArtworkDemandIndex_marketPriceInsights
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.marketPriceInsights && props?.artwork) {
          return (
            <MyCollectionArtworkDemandIndexFragmentContainer
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
        demandRank: 8,
      }),
    })
    expect(wrapper.root.findByType(InfoButton)).toBeDefined()
    expect(wrapper.root.findByType(tests.DemandRankScale)).toBeDefined()
    expect(wrapper.root.findByType(tests.DemandRankDetails)).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("Demand index")
    expect(text).toContain("80.0010")
    expect(text).toContain("Very Strong Demand (> 9.0)")
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
          "subject": "demandIndex",
        },
      ]
    `)
  })
})
