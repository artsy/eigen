import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
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
    describe("when there is no submission", () => {
      it("shows the edit button", async () => {
        const { findByText } = renderWithHookWrappersTL(
          <MyCollectionArtworkScreen
            artworkSlug="random-slug"
            artistInternalID="internal-id"
            medium="medium"
          />,
          mockEnvironment
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => ({
            consignmentSubmission: null,
          }),
        })

        expect(await findByText("Edit")).toBeTruthy()
      })
    })

    describe("when submission is in progress", () => {
      it("hides the edit button when the artwork is coming from a submission", async () => {
        const { findByText } = renderWithHookWrappersTL(
          <MyCollectionArtworkScreen
            artworkSlug="random-slug"
            artistInternalID="internal-id"
            medium="medium"
          />,
          mockEnvironment
        )

        resolveMostRecentRelayOperation(mockEnvironment, {
          Artwork: () => ({
            consignmentSubmission: "some-consignmentSubmission",
          }),
        })

        await expect(findByText("Edit")).rejects.toThrow(
          "Unable to find an element with text: Edit"
        )
      })
    })
  })
})
