import { ContextModule, OwnerType, tappedInfoBubble } from "@artsy/cohesion"
import { MyCollectionArtworkDemandIndexTestsQuery } from "__generated__/MyCollectionArtworkDemandIndexTestsQuery.graphql"
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkDemandIndexFragmentContainer, tests } from "../MyCollectionArtworkDemandIndex"

jest.unmock("react-relay")
jest.mock("react-tracking")

describe("MyCollectionArtworkDemandIndex", () => {
  const trackEvent = jest.fn()
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
    const mockTracking = useTracking as jest.Mock
    mockTracking.mockImplementation(() => {
      return {
        trackEvent,
      }
    })
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

    expect(trackEvent).toHaveBeenCalledTimes(1)
    expect(trackEvent).toHaveBeenCalledWith(
      tappedInfoBubble({
        contextModule: ContextModule.myCollectionArtwork,
        contextScreenOwnerType: OwnerType.myCollectionArtwork,
        subject: "demandIndex",
        contextScreenOwnerId: "artwork-id",
        contextScreenOwnerSlug: "artwork-slug",
      })
    )
  })
})
