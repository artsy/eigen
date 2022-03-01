import { act, fireEvent } from "@testing-library/react-native"
import { RequestForPriceEstimateTestsQuery } from "__generated__/RequestForPriceEstimateTestsQuery.graphql"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { RequestForPriceEstimate } from "./RequestForPriceEstimate"

jest.unmock("react-relay")

describe("RequestForPriceEstimate", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<RequestForPriceEstimateTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query RequestForPriceEstimateTestsQuery @relay_test_operation {
          artwork(id: "foo") {
            ...RequestForPriceEstimate_artwork
          }
          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...RequestForPriceEstimate_marketPriceInsights
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork && props?.marketPriceInsights) {
          return (
            <RequestForPriceEstimate
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
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
    resolveData({
      MarketPriceInsights: () => ({
        demandRank: 7.5,
      }),
    })
    expect(getByTestId("request-price-estimate-button")).toBeDefined()
    expect(getByTestId("request-price-estimate-banner-text")).toBeDefined()
  })

  it("tracks analytics event when RequestForEstimate button is tapped", () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
      }),
      MarketPriceInsights: () => ({
        demandRank: 7.5,
      }),
    })

    const TheButton = getByTestId("request-price-estimate-button")

    act(() => {
      fireEvent.press(TheButton)
    })

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "tappedRequestPriceEstimate",
      context_module: "myCollectionArtworkInsights",
      context_screen: "myCollectionArtwork",
      context_screen_owner_id: "artwork-id",
      context_screen_owner_slug: "artwork-slug",
      demand_index: 7.5,
    })
  })
})
