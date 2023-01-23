import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { FeatureMarkdown } from "./FeatureMarkdown"

describe(FeatureMarkdown, () => {
  it("renders markdown", () => {
    const root = renderWithWrappersLEGACY(<FeatureMarkdown content="this is _some_ **markdown**" />)
    expect(extractText(root.root)).toContain("this is some markdown")
  })
})
