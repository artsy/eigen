import { screen } from "@testing-library/react-native"
import { PriceEstimateRequestedTestsQuery } from "__generated__/PriceEstimateRequestedTestsQuery.graphql"
import { PriceEstimateRequested } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/RequestForPriceEstimate/PriceEstimateRequested"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("RequestForPriceEstimateBanner", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<PriceEstimateRequestedTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query PriceEstimateRequestedTestsQuery @relay_test_operation {
          artwork(id: "foo") {
            ...RequestForPriceEstimateBanner_artwork
          }
          me {
            ...RequestForPriceEstimateBanner_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork && props?.me) {
          return (
            <GlobalStoreProvider>
              <PriceEstimateRequested me={props.me} artwork={props.artwork} />
            </GlobalStoreProvider>
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

  it("renders 'requested' state if in global store without throwing an error", async () => {
    renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-id",
        hasPriceEstimateRequest: null,
      }),
    })
    __globalStoreTestUtils__?.injectState({
      requestedPriceEstimates: {
        requestedPriceEstimates: {
          "artwork-id": {
            artworkId: "artwork-id",
            requestedAt: 1666015648950,
          },
        },
      },
    })

    await flushPromiseQueue()

    expect(screen.getByText("Price Estimate Request Sent")).toBeDefined()
  })

  it("renders 'requested' state if hasPriceEstimateRequest is true", () => {
    renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        internalID: "artwork-id",
        slug: "artwork-id",
        hasPriceEstimateRequest: true,
      }),
    })
    expect(screen.getByText("Price Estimate Request Sent")).toBeDefined()
  })
})
