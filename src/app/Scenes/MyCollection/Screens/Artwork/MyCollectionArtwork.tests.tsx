import { screen } from "@testing-library/react-native"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { MyCollectionArtworkScreen } from "./MyCollectionArtwork"

const mockEnvironment = getMockRelayEnvironment()

describe("My Collection Artwork", () => {
  it("show new artwork screen ", () => {
    renderWithHookWrappersTL(
      <MyCollectionArtworkScreen
        artworkId="random-id"
        artistInternalID="internal-id"
        medium="medium"
        category="medium"
      />,
      mockEnvironment
    )

    resolveMostRecentRelayOperation(mockEnvironment)
    expect(() => screen.getByTestId("my-collection-artwork")).toBeTruthy()
  })

  describe("Edit button", () => {
    it("should be visible when consignmentSubmission is available", () => {
      renderWithHookWrappersTL(
        <MyCollectionArtworkScreen
          artworkId="random-id"
          artistInternalID="internal-id"
          medium="medium"
          category="medium"
        />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          consignmentSubmission: {
            internalID: "submission-id",
          },
        }),
      })
      expect(screen.getByText("Edit")).toBeOnTheScreen()
    })

    it("should be visible when consignmentSubmission is not available", () => {
      renderWithHookWrappersTL(
        <MyCollectionArtworkScreen
          artworkId="random-id"
          artistInternalID="internal-id"
          medium="medium"
          category="medium"
        />,
        mockEnvironment
      )

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          consignmentSubmission: null,
        }),
      })
      expect(() => screen.getByText("Edit")).toThrow()
    })
  })
})
