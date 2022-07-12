import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithRelayWrappersTL } from "app/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { AuctionResultsForArtistsYouCollect } from "./AuctionResultsForArtistsYouCollect"

describe("AuctionResultsForArtistsYouCollect", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={getRelayEnvironment()}>
      <AuctionResultsForArtistsYouCollect />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionInsights: true })
  })

  it("renders auction results", async () => {
    const { getByTestId } = renderWithRelayWrappersTL(<TestRenderer />, mockEnvironment)

    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({
        errors: [],
        data: { me: {} },
      })
    })

    await flushPromiseQueue()

    expect(getByTestId("Results_Section_List")).toBeTruthy()
  })
})
