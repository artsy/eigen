import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { PrivateListingsBanner } from "./PrivateListingsBanner"

describe("PrivateListingsBanner Screen", () => {
  describe("when partner name present", () => {
    it("renders the correct text", () => {
      const { getByTestId } = renderWithWrappers(
        <PrivateListingsBanner partnerName="Hello Partner" />
      )
      expect(getByTestId("private-listings-banner")).toHaveTextContent(
        "This is a private listing from Hello Partner."
      )
    })
  })

  describe("when partner name is null", () => {
    it("renders the correct text", () => {
      const { getByTestId } = renderWithWrappers(<PrivateListingsBanner />)
      expect(getByTestId("private-listings-banner")).toHaveTextContent("This is a private listing.")
    })
  })
})
