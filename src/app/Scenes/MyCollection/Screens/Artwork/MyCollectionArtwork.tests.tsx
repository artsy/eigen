import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkScreen } from "./MyCollectionArtwork"

jest.mock("./MyCollectionArtwork.tsx", () => {
  const View = require("react-native/Libraries/Components/View/View")
  return {
    MyCollectionArtworkScreen: () => <View testID="old-my-collection-artwork" />,
  }
})

jest.unmock("react-relay")

describe("My Collection Artwork", () => {
  describe("when new my collection artwork feature flag is enabled", () => {
    let mockEnvironment: ReturnType<typeof createMockEnvironment>

    beforeEach(() => {
      mockEnvironment = createMockEnvironment()
    })

    it("show new artwork screen ", () => {
      const { getByTestId } = renderWithHookWrappersTL(
        <MyCollectionArtworkScreen
          artworkSlug="random-slug"
          artistInternalID="internal-id"
          medium="medium"
        />,
        mockEnvironment
      )

      mockEnvironmentPayload(mockEnvironment)
      expect(() => getByTestId("my-collection-artwork")).toBeTruthy()
      expect(() => getByTestId("old-my-collection-artwork")).toThrowError(
        "Unable to find an element with testID: old-my-collection-artwork"
      )
    })
  })

  describe("edit button", () => {
    let mockEnvironment: ReturnType<typeof createMockEnvironment>

    beforeEach(() => {
      mockEnvironment = createMockEnvironment()
    })

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

        mockEnvironmentPayload(mockEnvironment, {
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

        mockEnvironmentPayload(mockEnvironment, {
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
