import { fireEvent, screen } from "@testing-library/react-native"
import { RequestForPriceEstimateBannerTestsQuery } from "__generated__/RequestForPriceEstimateBannerTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { RequestForPriceEstimateBanner } from "./RequestForPriceEstimateBanner"

describe("RequestForPriceEstimateBanner", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<RequestForPriceEstimateBannerTestsQuery>
      environment={mockEnvironment}
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
              contextModule="insights"
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
    __globalStoreTestUtils__?.reset()
  })

  const resolveData = (passedProps = {}) => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, passedProps)
    )
  }

  it("renders without throwing an error", async () => {
    renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        internalID: "some-internal-id",
        hasPriceEstimateRequest: false,
        isPriceEstimateRequestable: true,
      }),
      MarketPriceInsights: () => ({
        demandRank: 7.5,
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByTestId("request-price-estimate-button")).toBeDefined()
    expect(screen.getByTestId("request-price-estimate-banner-title")).toBeDefined()
    expect(screen.getByTestId("request-price-estimate-banner-description")).toBeDefined()
  })

  it("rendering nothing if the price estimate is not requestable", () => {
    renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        internalID: "some-internal-id",
        hasPriceEstimateRequest: false,
        isPriceEstimateRequestable: false,
      }),
    })

    expect(screen.queryByTestId("request-price-estimate-button")).toBeNull()
    expect(screen.queryByTestId("request-price-estimate-banner-title")).toBeNull()
    expect(screen.queryByTestId("request-price-estimate-banner-description")).toBeNull()
  })

  it("tracks analytics event when RequestForEstimate button is tapped", () => {
    renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-slug",
        hasPriceEstimateRequest: false,
        isPriceEstimateRequestable: true,
      }),
      MarketPriceInsights: () => ({
        demandRank: 7.5,
      }),
    })

    const TheButton = screen.getByTestId("request-price-estimate-button")

    fireEvent.press(TheButton)

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
