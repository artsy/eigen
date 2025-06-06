import { screen } from "@testing-library/react-native"
import { PartnerBanner } from "app/Components/PartnerBanner"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("PartnerBanner", () => {
  it("renders with the specified banner text", () => {
    renderWithWrappers(<PartnerBanner bannerText="Banner Text" />)

    // The banner repeats the text 2 times
    const bannerTexts = screen.getAllByText("Banner Text")
    expect(bannerTexts.length).toBe(2)

    // Should also render bullet points between text elements
    const bulletPoints = screen.getAllByText("•")
    expect(bulletPoints.length).toBe(3)
  })
})
