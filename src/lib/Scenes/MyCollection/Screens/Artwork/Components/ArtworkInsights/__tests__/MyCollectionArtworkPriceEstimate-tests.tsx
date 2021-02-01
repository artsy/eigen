import { ContextModule, OwnerType, tappedInfoBubble } from "@artsy/cohesion"
import { MyCollectionArtworkPriceEstimateTestsQuery } from "__generated__/MyCollectionArtworkPriceEstimateTestsQuery.graphql"
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkPriceEstimateFragmentContainer } from "../MyCollectionArtworkPriceEstimate"

jest.unmock("react-relay")
jest.mock("react-tracking")

describe("MyCollectionArtworkPriceEstimate", () => {
  const trackEvent = jest.fn()
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkPriceEstimateTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkPriceEstimateTestsQuery @relay_test_operation {
          artwork(id: "foo") {
            ...MyCollectionArtworkPriceEstimate_artwork
          }
          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...MyCollectionArtworkPriceEstimate_marketPriceInsights
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork && props?.marketPriceInsights) {
          return (
            <MyCollectionArtworkPriceEstimateFragmentContainer
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
      Artwork: () => ({
        costMinor: 2000,
        costCurrencyCode: "USD",
      }),
      MarketPriceInsights: () => ({
        artsyQInventory: 20,
        lowRangeCents: 200,
        midRangeCents: 400,
        highRangeCents: 600,
      }),
    })
    expect(wrapper.root.findByType(InfoButton)).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("Price estimate")
    expect(text).toContain("Based on 20 comparable works")
    expect(text).toContain("$4Median")
    expect(text).toContain("Sold price range")
    expect(text).toContain("$2 – $6")
    expect(text).toContain("Your price paid for this work")
    expect(text).toContain("USD 2000")
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
        subject: "priceEstimate",
        contextScreenOwnerId: "artwork-id",
        contextScreenOwnerSlug: "artwork-slug",
      })
    )
  })
})
