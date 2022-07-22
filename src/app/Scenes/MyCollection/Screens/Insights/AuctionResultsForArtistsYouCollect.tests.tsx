import { screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperationRawPayload } from "app/tests/resolveMostRecentRelayOperation"
import { AuctionResultsForArtistsYouCollect } from "./AuctionResultsForArtistsYouCollect"

describe("AuctionResultsForArtistsYouCollect", () => {
  const TestRenderer = () => <AuctionResultsForArtistsYouCollect />

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionInsights: true })
  })

  it("renders auction results", async () => {
    const { getByTestId } = renderWithRelayWrappers(<TestRenderer />)

    resolveMostRecentRelayOperationRawPayload({
      errors: [],
      data: { me: {} },
    })

    screen.debug()

    expect(getByTestId("Results_Section_List")).toBeTruthy()
  })
})
