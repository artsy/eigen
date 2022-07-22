import { act, fireEvent } from "@testing-library/react-native"
import { RequestForPriceEstimateBannerTestsQuery } from "__generated__/RequestForPriceEstimateBannerTestsQuery.graphql"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"

import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { RequestForPriceEstimateBanner } from "./RequestForPriceEstimateBanner"

describe("RequestForPriceEstimateBanner", () => {
  const TestRenderer = () => (
    <QueryRenderer<RequestForPriceEstimateBannerTestsQuery>
      environment={getMockRelayEnvironment()}
      query={graphql`
        query RequestForPriceEstimateBannerTestsQuery @relay_test_operation {
          artwork(id: "foo") {
            ...RequestForPriceEstimateBanner_artwork
          }
          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...RequestForPriceEstimateBanner_marketPriceInsights
          }
          me {
            ...RequestForPriceEstimateBanner_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork && props?.marketPriceInsights && props?.me) {
          return (
            <RequestForPriceEstimateBanner
              me={props.me}
              artwork={props.artwork}
              marketPriceInsights={props.marketPriceInsights}
            />
          )
        }
        return null
      }}
    />
  )

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing an error", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      MarketPriceInsights: () => ({
        demandRank: 7.5,
      }),
    })
    expect(getByTestId("request-price-estimate-button")).toBeDefined()
    expect(getByTestId("request-price-estimate-banner-text")).toBeDefined()
  })

  it("tracks analytics event when RequestForEstimate button is tapped", () => {
    const { getByTestId } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
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
      context_screen: "MyCollectionArtworkInsights",
      context_screen_owner_type: "myCollectionArtwork",
      context_screen_owner_id: "artwork-id",
      context_screen_owner_slug: "artwork-slug",
      demand_index: 7.5,
    })
  })
})
