import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { MyCollectionArtworkScreen } from "./MyCollectionArtwork"

const mockEnvironment = getMockRelayEnvironment()

describe("My Collection Artwork", () => {
  it("show new artwork screen ", () => {
    const { getByTestId } = renderWithHookWrappersTL(
      <MyCollectionArtworkScreen
        artworkId="random-id"
        artistInternalID="internal-id"
        medium="medium"
        category="medium"
      />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment)
    expect(() => getByTestId("my-collection-artwork")).toBeTruthy()
  })
})
