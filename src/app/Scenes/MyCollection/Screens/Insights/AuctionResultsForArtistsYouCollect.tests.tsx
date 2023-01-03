import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { AuctionResultsForArtistsYouCollect } from "./AuctionResultsForArtistsYouCollect"

jest.unmock("react-relay")

describe("AuctionResultsForArtistsYouCollect", () => {
  const mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <AuctionResultsForArtistsYouCollect />
    </RelayEnvironmentProvider>
  )

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
