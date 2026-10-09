import { fireEvent, screen } from "@testing-library/react-native"
import { MarkdownPlayground } from "app/system/devTools/MarkdownPlayground/MarkdownPlayground"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("MarkdownPlayground", () => {
  it("renders before and after for every call site", () => {
    renderWithWrappers(<MarkdownPlayground />)

    expect(screen.getAllByText("BEFORE · simple-markdown")).toHaveLength(9)
    expect(screen.getAllByText("AFTER · enriched-markdown")).toHaveLength(9)
  })

  it("renders every example without render errors", () => {
    renderWithWrappers(<MarkdownPlayground />)

    for (const name of [
      "Paragraphs",
      "Emphasis",
      "Links",
      "Lists",
      "Headings",
      "Quote & rule",
      "Image",
      "Sale info",
      "Opening hours",
      "Long text",
    ]) {
      fireEvent.press(screen.getByText(name))
      expect(screen.queryByText(/Render error/)).not.toBeOnTheScreen()
    }
  })
})
