import { fireEvent } from "@testing-library/react-native"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkScreen } from "./MyCollectionArtwork"

jest.unmock("react-relay")

const mockEnvironment = defaultEnvironment as any as ReturnType<typeof createMockEnvironment>

describe("My Collection Artwork", () => {
  it("show new artwork screen ", () => {
    const { getByTestId } = renderWithHookWrappersTL(
      <MyCollectionArtworkScreen
        artworkSlug="random-slug"
        artistInternalID="internal-id"
        medium="medium"
        category="medium"
      />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment)
    expect(() => getByTestId("my-collection-artwork")).toBeTruthy()
    expect(() => getByTestId("old-my-collection-artwork")).toThrowError(
      "Unable to find an element with testID: old-my-collection-artwork"
    )
  })

  describe("edit button", () => {
    it("shows the edit button", async () => {
      const { findByText } = renderWithHookWrappersTL(
        <MyCollectionArtworkScreen
          artworkSlug="random-slug"
          artistInternalID="internal-id"
          medium="medium"
          category="medium"
        />,
        mockEnvironment
      )

      const editButton = await findByText("Edit")

      expect(editButton).toBeTruthy()

      fireEvent.press(editButton)
    })
  })
})
