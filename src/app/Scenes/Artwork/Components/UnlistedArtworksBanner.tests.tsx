import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { UnlistedArtworksBanner } from "./UnlistedArtworksBanner"

describe("UnlistedArtworksBanner Screen", () => {
  describe("when partner name present", () => {
    it("renders the correct text", () => {
      const { getByTestId } = renderWithWrappers(
        <UnlistedArtworksBanner partnerName="Hello Partner" />
      )
      expect(getByTestId("unlisted-artworks-banner")).toHaveTextContent(
        "This is a private listing from Hello Partner."
      )
    })
  })

  describe("when partner name is null", () => {
    it("renders the correct text", () => {
      const { getByTestId } = renderWithWrappers(<UnlistedArtworksBanner />)
      expect(getByTestId("unlisted-artworks-banner")).toHaveTextContent(
        "This is a private listing."
      )
    })
  })
})
