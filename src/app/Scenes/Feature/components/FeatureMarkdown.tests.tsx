import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { FeatureMarkdown } from "./FeatureMarkdown"

describe(FeatureMarkdown, () => {
  it("renders markdown", () => {
    const root = renderWithWrappersLEGACY(<FeatureMarkdown content="this is _some_ **markdown**" />)
    expect(extractText(root.root)).toContain("this is some markdown")
  })
})
