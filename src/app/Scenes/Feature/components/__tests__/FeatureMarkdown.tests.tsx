import { FeatureMarkdown } from "app/Scenes/Feature/components/FeatureMarkdown"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

describe(FeatureMarkdown, () => {
  it("renders markdown", () => {
    const root = renderWithWrappersLEGACY(<FeatureMarkdown content="this is _some_ **markdown**" />)
    expect(extractText(root.root)).toContain("this is some markdown")
  })
})
