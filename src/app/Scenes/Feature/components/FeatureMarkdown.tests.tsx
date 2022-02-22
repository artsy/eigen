import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { FeatureMarkdown } from "./FeatureMarkdown"

describe(FeatureMarkdown, () => {
  it("renders markdown", () => {
    const root = renderWithWrappers(<FeatureMarkdown content="this is _some_ **markdown**" />)
    expect(extractText(root.root)).toContain("this is some markdown")
  })
})
