import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { MyCollectionArtworkScreen } from "./MyCollectionArtwork"

describe("My Collection Artwork", () => {
  it("show new artwork screen ", () => {
    const { getByTestId } = renderWithRelayWrappers(
      <MyCollectionArtworkScreen
        artworkSlug="random-slug"
        artistInternalID="internal-id"
        medium="medium"
      />
    )

    resolveMostRecentRelayOperation()
    expect(() => getByTestId("my-collection-artwork")).toBeTruthy()
    expect(() => getByTestId("old-my-collection-artwork")).toThrowError(
      "Unable to find an element with testID: old-my-collection-artwork"
    )
  })

  describe("edit button", () => {
    describe("when there is no submission", () => {
      it("shows the edit button", async () => {
        const { findByText } = renderWithRelayWrappers(
          <MyCollectionArtworkScreen
            artworkSlug="random-slug"
            artistInternalID="internal-id"
            medium="medium"
          />
        )

        resolveMostRecentRelayOperation({
          Artwork: () => ({
            consignmentSubmission: null,
          }),
        })

        expect(await findByText("Edit")).toBeTruthy()
      })
    })

    describe("when submission is in progress", () => {
      it("hides the edit button when the artwork is coming from a submission", async () => {
        const { findByText } = renderWithRelayWrappers(
          <MyCollectionArtworkScreen
            artworkSlug="random-slug"
            artistInternalID="internal-id"
            medium="medium"
          />
        )

        resolveMostRecentRelayOperation({
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
