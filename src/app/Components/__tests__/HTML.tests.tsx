import { screen } from "@testing-library/react-native"
import { HTML } from "app/Components/HTML"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("HTML", () => {
  it("applies the color prop to bare text with no wrapping tag", () => {
    renderWithWrappers(<HTML html="Bare text with no tag" color="mono0" />)

    const node = screen.getByText("Bare text with no tag")
    expect(node).toHaveStyle({ color: "#FFFFFF" })
  })

  it("applies the color prop to tags without an explicit tagsStyles entry", () => {
    renderWithWrappers(<HTML html="<strong>Bold text</strong>" color="mono0" />)

    const node = screen.getByText("Bold text")
    expect(node).toHaveStyle({ color: "#FFFFFF" })
  })
})
