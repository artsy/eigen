import { AuctionResultsForArtistsYouCollect } from "app/Scenes/MyCollection/Screens/Insights/AuctionResultsForArtistsYouCollect"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

describe("AuctionResultsForArtistsYouCollect", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <AuctionResultsForArtistsYouCollect />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders auction results", async () => {
    const { getByTestId } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

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
